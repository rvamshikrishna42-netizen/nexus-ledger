<?php
require_once __DIR__ . '/config.php';

$method = $_SERVER['REQUEST_METHOD'];
$path   = $_GET['action'] ?? '';

match ($path) {
    'register' => handleRegister(),
    'login'    => handleLogin(),
    'logout'   => handleLogout(),
    'me'       => handleMe(),
    default    => respondError('Unknown auth action', 404),
};

function handleRegister(): void {
    if ($_SERVER['REQUEST_METHOD'] !== 'POST') respondError('Method not allowed', 405);
    $body = getBody();

    $name     = sanitize($body['name']     ?? '');
    $email    = sanitize($body['email']    ?? '');
    $password = $body['password'] ?? '';
    $role     = 'User';

    if (!$name || !$email || !$password) respondError('Name, email, and password are required');
    if (!filter_var($email, FILTER_VALIDATE_EMAIL)) respondError('Invalid email');
    if (strlen($password) < 8) respondError('Password must be at least 8 characters');

    $db = getDB();

    // Check duplicate
    $stmt = $db->prepare('SELECT id FROM users WHERE email = ?');
    $stmt->execute([$email]);
    if ($stmt->fetch()) respondError('Email already registered', 409);

    // Hash password
    $hash = password_hash($password, PASSWORD_BCRYPT, ['cost' => 12]);

    // Generate DID
    $did = 'did:nexus:' . bin2hex(random_bytes(16));

    $stmt = $db->prepare(
        'INSERT INTO users (name, email, password_hash, role, did, status, created_at)
         VALUES (?, ?, ?, ?, ?, "active", NOW())'
    );
    $stmt->execute([$name, $email, $hash, $role, $did]);
    $userId = $db->lastInsertId();

    // Log DID to dids table
    $stmt = $db->prepare(
        'INSERT INTO dids (did, owner_id, owner_name, method, status, verified, created_at)
         VALUES (?, ?, ?, "nexus-v1", "Active", 0, NOW())'
    );
    $stmt->execute([$did, $userId, $name]);

    // Audit log
    auditLog($userId, $name, $role, 'REGISTER', 'users', 'Low', 'Success');

    $token = jwtEncode(['sub' => $userId, 'name' => $name, 'email' => $email, 'role' => $role]);
    respond(['token' => $token, 'user' => compact('userId', 'name', 'email', 'role', 'did')], 201);
}

function handleLogin(): void {
    if ($_SERVER['REQUEST_METHOD'] !== 'POST') respondError('Method not allowed', 405);
    $body = getBody();

    $email    = sanitize($body['email']    ?? '');
    $password = $body['password'] ?? '';

    if (!$email || !$password) respondError('Email and password are required');

    $db   = getDB();
    $stmt = $db->prepare('SELECT * FROM users WHERE email = ? AND status = "active"');
    $stmt->execute([$email]);
    $user = $stmt->fetch();

    if (!$user || !password_verify($password, $user['password_hash'])) {
        auditLog(null, $email, 'N/A', 'FAILED_LOGIN', 'Auth System', 'High', 'Failed');
        respondError('Invalid credentials', 401);
    }

    auditLog($user['id'], $user['name'], $user['role'], 'LOGIN', 'Auth System', 'Low', 'Success');

    $token = jwtEncode([
        'sub'   => $user['id'],
        'name'  => $user['name'],
        'email' => $user['email'],
        'role'  => $user['role'],
        'did'   => $user['did'],
    ]);

    respond([
        'token' => $token,
        'user'  => [
            'id'     => $user['id'],
            'name'   => $user['name'],
            'email'  => $user['email'],
            'role'   => $user['role'],
            'did'    => $user['did'],
            'avatar' => implode('', array_map(fn($w) => strtoupper($w[0]), array_slice(explode(' ', $user['name']), 0, 2))),
        ]
    ]);
}

function handleLogout(): void {
    $user = requireAuth();
    auditLog($user['sub'], $user['name'], $user['role'], 'LOGOUT', 'Auth System', 'Low', 'Success');
    respond(['message' => 'Logged out successfully']);
}

function handleMe(): void {
    $user = requireAuth();
    $db   = getDB();
    $stmt = $db->prepare('SELECT id, name, email, role, did, status, created_at FROM users WHERE id = ?');
    $stmt->execute([$user['sub']]);
    $u = $stmt->fetch();
    if (!$u) respondError('User not found', 404);
    respond($u);
}

function auditLog(?int $userId, string $user, string $role, string $action, string $resource, string $risk, string $status): void {
    try {
        $db   = getDB();
        $ip   = $_SERVER['REMOTE_ADDR'] ?? '127.0.0.1';
        $stmt = $db->prepare(
            'INSERT INTO audit_logs (user_id, user_name, role, action, resource, risk, status, ip, created_at)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, NOW())'
        );
        $stmt->execute([$userId, $user, $role, $action, $resource, $risk, $status, $ip]);
    } catch (\Exception $e) {
        // Silently fail audit log — don't break main request
    }
}
