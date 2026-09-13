<?php
require_once __DIR__ . '/config.php';

$user = requireAuth();

// Only auditors, admins, super admins can view audit logs
if (!in_array($user['role'], ['Super Admin', 'Admin', 'Auditor', 'Manager'])) {
    respondError('Permission denied', 403);
}

$db     = getDB();
$limit  = min((int)($_GET['limit'] ?? 100), 500);
$offset = (int)($_GET['offset'] ?? 0);
$risk   = sanitize($_GET['risk']   ?? '');
$status = sanitize($_GET['status'] ?? '');
$action = sanitize($_GET['action'] ?? '');

$where  = [];
$params = [];

if ($risk) {
    $where[]  = 'risk = ?';
    $params[] = $risk;
}
if ($status) {
    $where[]  = 'status = ?';
    $params[] = $status;
}
if ($action) {
    $where[]  = 'action = ?';
    $params[] = $action;
}

$whereClause = $where ? 'WHERE ' . implode(' AND ', $where) : '';

$stmt = $db->prepare("SELECT * FROM audit_logs $whereClause ORDER BY created_at DESC LIMIT $limit OFFSET $offset");
$stmt->execute($params);

respond([
    'logs'   => $stmt->fetchAll(),
    'limit'  => $limit,
    'offset' => $offset,
]);
