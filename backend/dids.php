<?php
require_once __DIR__ . '/config.php';

$user   = requireAuth();
$method = $_SERVER['REQUEST_METHOD'];
$action = $_GET['action'] ?? '';

match (true) {
    $method === 'GET' && $action === ''       => listDIDs($user),
    $method === 'POST' && $action === ''      => createDID($user),
    $method === 'POST' && $action === 'verify'=> verifyDID($user),
    $method === 'POST' && $action === 'deactivate' => deactivateDID($user),
    default => respondError('Unknown action', 404),
};

function listDIDs(array $user): void {
    $db   = getDB();
    $stmt = $db->prepare('SELECT * FROM dids ORDER BY created_at DESC');
    $stmt->execute();
    respond($stmt->fetchAll());
}

function createDID(array $user): void {
    // Only Admin+ can create DIDs for others
    if (!in_array($user['role'], ['Super Admin', 'Admin', 'Manager'])) {
        respondError('Permission denied', 403);
    }
    $body  = getBody();
    $name  = sanitize($body['name']  ?? '');
    $email = sanitize($body['email'] ?? '');
    if (!$name || !$email) respondError('Name and email required');

    $db  = getDB();
    $did = 'did:nexus:' . bin2hex(random_bytes(16));
    $tx  = '0x' . bin2hex(random_bytes(20));

    $stmt = $db->prepare(
        'INSERT INTO dids (did, owner_id, owner_name, owner_email, method, status, verified, blockchain_tx, block_number, created_at)
         VALUES (?, ?, ?, ?, "nexus-v1", "Active", 0, ?, ?, NOW())'
    );
    $stmt->execute([$did, $user['sub'], $name, $email, $tx, rand(18900000, 19100000)]);

    logAction($user, 'CREATE_DID', "did:nexus:...", 'Low', 'Success', $tx);
    respond(['did' => $did, 'blockchainTx' => $tx], 201);
}

function verifyDID(array $user): void {
    $body = getBody();
    $did  = sanitize($body['did'] ?? '');
    if (!$did) respondError('DID required');

    $db   = getDB();
    $stmt = $db->prepare('SELECT * FROM dids WHERE did = ?');
    $stmt->execute([$did]);
    $rec  = $stmt->fetch();

    if (!$rec) respondError('DID not found', 404);

    $stmt = $db->prepare('UPDATE dids SET verified = 1, last_verified = NOW() WHERE did = ?');
    $stmt->execute([$did]);

    logAction($user, 'VERIFY_DID', $did, 'Low', 'Success', null);
    respond(['verified' => true, 'did' => $did]);
}

function deactivateDID(array $user): void {
    if (!in_array($user['role'], ['Super Admin', 'Admin'])) respondError('Permission denied', 403);

    $body = getBody();
    $did  = sanitize($body['did'] ?? '');
    if (!$did) respondError('DID required');

    $db   = getDB();
    $stmt = $db->prepare("UPDATE dids SET status = 'Deactivated', verified = 0 WHERE did = ?");
    $stmt->execute([$did]);

    logAction($user, 'DEACTIVATE_DID', $did, 'Medium', 'Success', null);
    respond(['deactivated' => true]);
}

function logAction(array $user, string $action, string $resource, string $risk, string $status, ?string $tx): void {
    try {
        $db   = getDB();
        $ip   = $_SERVER['REMOTE_ADDR'] ?? '127.0.0.1';
        $stmt = $db->prepare(
            'INSERT INTO audit_logs (user_id, user_name, role, action, resource, tx_hash, risk, status, ip, created_at)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, NOW())'
        );
        $stmt->execute([$user['sub'], $user['name'], $user['role'], $action, $resource, $tx, $risk, $status, $ip]);
    } catch (\Exception) {}
}
