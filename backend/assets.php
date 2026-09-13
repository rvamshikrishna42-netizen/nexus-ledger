<?php
require_once __DIR__ . '/config.php';

$user   = requireAuth();
$method = $_SERVER['REQUEST_METHOD'];
$action = $_GET['action'] ?? '';

match (true) {
    $method === 'GET'  && $action === ''          => listAssets($user),
    $method === 'POST' && $action === ''          => createAsset($user),
    $method === 'POST' && $action === 'transfer'  => transferAsset($user),
    $method === 'POST' && $action === 'revoke'    => revokeAsset($user),
    $method === 'POST' && $action === 'verify'    => verifyAsset($user),
    default => respondError('Unknown action', 404),
};

function listAssets(array $user): void {
    $db   = getDB();
    $stmt = $db->prepare('SELECT * FROM assets ORDER BY created_at DESC');
    $stmt->execute();
    respond($stmt->fetchAll());
}

function createAsset(array $user): void {
    if (!in_array($user['role'], ['Super Admin', 'Admin', 'Manager'])) respondError('Permission denied', 403);

    $body  = getBody();
    $name  = sanitize($body['name']  ?? '');
    $type  = sanitize($body['type']  ?? '');
    $owner = sanitize($body['owner'] ?? '');
    if (!$name || !$type) respondError('Name and type required');

    $db      = getDB();
    $assetId = 'ASSET-' . strtoupper(bin2hex(random_bytes(4)));
    $hash    = hash('sha256', $name . $owner . time() . random_bytes(8));
    $tokenId = 'NFT-BEL-' . date('Y') . '-' . rand(100, 999);
    $tx      = '0x' . bin2hex(random_bytes(20));
    $block   = rand(19000000, 19100000);

    $stmt = $db->prepare(
        'INSERT INTO assets (asset_id, name, type, owner_name, owner_did, sha256_hash, token_id, blockchain_tx, block_number, blockchain_status, status, created_at)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, "Confirmed", "Active", NOW())'
    );
    $stmt->execute([$assetId, $name, $type, $owner, $body['owner_did'] ?? '', $hash, $tokenId, $tx, $block]);

    logAction($user, 'REGISTER_ASSET', $assetId, 'Low', 'Success', $tx);
    respond(['assetId' => $assetId, 'hash' => $hash, 'tokenId' => $tokenId, 'blockchainTx' => $tx], 201);
}

function transferAsset(array $user): void {
    $body    = getBody();
    $assetId = sanitize($body['asset_id'] ?? '');
    $newOwner= sanitize($body['new_owner'] ?? '');
    if (!$assetId || !$newOwner) respondError('Asset ID and new owner required');

    $db   = getDB();
    $stmt = $db->prepare("UPDATE assets SET owner_name = ?, blockchain_status = 'Confirmed' WHERE asset_id = ? AND status = 'Active'");
    $stmt->execute([$newOwner, $assetId]);

    $tx = '0x' . bin2hex(random_bytes(20));
    logAction($user, 'TRANSFER_ASSET', $assetId, 'Medium', 'Success', $tx);
    respond(['transferred' => true, 'newOwner' => $newOwner, 'tx' => $tx]);
}

function revokeAsset(array $user): void {
    if (!in_array($user['role'], ['Super Admin', 'Admin'])) respondError('Permission denied', 403);

    $body    = getBody();
    $assetId = sanitize($body['asset_id'] ?? '');
    if (!$assetId) respondError('Asset ID required');

    $db   = getDB();
    $stmt = $db->prepare("UPDATE assets SET status = 'Revoked' WHERE asset_id = ?");
    $stmt->execute([$assetId]);

    logAction($user, 'REVOKE_ASSET', $assetId, 'High', 'Success', null);
    respond(['revoked' => true]);
}

function verifyAsset(array $user): void {
    $body    = getBody();
    $assetId = sanitize($body['asset_id'] ?? '');
    $hash    = sanitize($body['hash']     ?? '');
    if (!$assetId) respondError('Asset ID required');

    $db   = getDB();
    $stmt = $db->prepare('SELECT * FROM assets WHERE asset_id = ?');
    $stmt->execute([$assetId]);
    $asset = $stmt->fetch();
    if (!$asset) respondError('Asset not found', 404);

    $hashMatch = !$hash || hash_equals($asset['sha256_hash'], $hash);
    respond(['verified' => $hashMatch, 'asset' => $asset]);
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
