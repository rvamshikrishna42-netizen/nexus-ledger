<?php
require_once __DIR__ . '/config.php';

$user   = requireAuth();
$method = $_SERVER['REQUEST_METHOD'];
$action = $_GET['action'] ?? '';

match (true) {
    $method === 'GET'  && $action === ''       => listCerts($user),
    $method === 'POST' && $action === 'verify' => verifyCert($user),
    $method === 'POST' && $action === 'analyze'=> analyzeCert($user),
    default => respondError('Unknown action', 404),
};

function listCerts(array $user): void {
    $db   = getDB();
    $stmt = $db->prepare('SELECT * FROM certificates ORDER BY created_at DESC');
    $stmt->execute();
    respond($stmt->fetchAll());
}

function verifyCert(array $user): void {
    $body   = getBody();
    $certId = sanitize($body['cert_id'] ?? '');
    $hash   = sanitize($body['hash']    ?? '');

    if (!$certId) respondError('Certificate ID required');

    $db   = getDB();
    $stmt = $db->prepare('SELECT * FROM certificates WHERE cert_id = ?');
    $stmt->execute([$certId]);
    $cert = $stmt->fetch();

    if (!$cert) {
        logAction($user, 'VERIFY_CERT', $certId, 'Medium', 'Failed', null);
        respondError('Certificate not found', 404);
    }

    // Hash comparison
    $hashMatch = !$hash || hash_equals($cert['sha256_hash'], $hash);
    $status    = $cert['status'];
    $riskScore = (int)$cert['risk_score'];

    logAction($user, 'VERIFY_CERT', $certId, $riskScore > 60 ? 'High' : 'Low', 'Success', $cert['blockchain_tx'] ?? null);

    respond([
        'cert'       => $cert,
        'hashMatch'  => $hashMatch,
        'status'     => $status,
        'riskScore'  => $riskScore,
        'blockchain' => !empty($cert['blockchain_tx']),
    ]);
}

function analyzeCert(array $user): void {
    $body = getBody();
    $cert = $body['cert'] ?? [];

    // Rule-based risk engine
    $score   = 0;
    $reasons = [];

    if (empty($cert['issuer']) || str_contains($cert['issuer'], 'FAKE') || str_contains($cert['issuer'], 'Unverified')) {
        $score += 35;
        $reasons[] = ['text' => 'Issuer is unrecognized or flagged', 'severity' => 'critical'];
    }
    if (empty($cert['blockchain_tx'])) {
        $score += 20;
        $reasons[] = ['text' => 'No blockchain record found', 'severity' => 'high'];
    }
    if (!empty($cert['hash']) && $cert['hash'] === str_repeat('0', 64)) {
        $score += 30;
        $reasons[] = ['text' => 'Hash is all-zeros — possible spoofing', 'severity' => 'critical'];
    }
    if ($score === 0) {
        $reasons[] = ['text' => 'All automated checks passed', 'severity' => 'info'];
    }

    respond(['riskScore' => min($score, 100), 'reasons' => $reasons]);
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
