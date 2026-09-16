<?php
// ============================================================
// NEXUS LEDGER — Backend Config
// ============================================================

define('DB_HOST', 'mysql');
define('DB_NAME', 'nexus_ledger');
define('DB_USER', 'root');
define('DB_PASS', 'root');
define('DB_CHARSET', 'utf8mb4');

define('JWT_SECRET', 'nexus_ledger_sih_2024_secret_key_bel');
define('JWT_EXPIRY', 86400); // 24 hours

// CORS
header('Access-Control-Allow-Origin: http://localhost:5173');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');
header('Content-Type: application/json; charset=utf-8');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// Database connection
function getDB(): PDO {
    static $pdo = null;
    if ($pdo === null) {
        try {
            $dsn = "mysql:host=" . DB_HOST . ";dbname=" . DB_NAME . ";charset=" . DB_CHARSET;
            $pdo = new PDO($dsn, DB_USER, DB_PASS, [
                PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
                PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
                PDO::ATTR_EMULATE_PREPARES   => false,
            ]);
        } catch (PDOException $e) {
            http_response_code(503);
            echo json_encode(['error' => 'Database unavailable — running in demo mode']);
            exit();
        }
    }
    return $pdo;
}

// JSON response helpers
function respond(array $data, int $code = 200): void {
    http_response_code($code);
    echo json_encode($data);
    exit();
}

function respondError(string $message, int $code = 400): void {
    respond(['error' => $message], $code);
}

// Simple JWT implementation
function jwtEncode(array $payload): string {
    $header  = base64_encode(json_encode(['alg' => 'HS256', 'typ' => 'JWT']));
    $payload['exp'] = time() + JWT_EXPIRY;
    $body    = base64_encode(json_encode($payload));
    $sig     = base64_encode(hash_hmac('sha256', "$header.$body", JWT_SECRET, true));
    return "$header.$body.$sig";
}

function jwtDecode(string $token): ?array {
    $parts = explode('.', $token);
    if (count($parts) !== 3) return null;
    [$header, $body, $sig] = $parts;
    $expectedSig = base64_encode(hash_hmac('sha256', "$header.$body", JWT_SECRET, true));
    if (!hash_equals($expectedSig, $sig)) return null;
    $payload = json_decode(base64_decode($body), true);
    if (!$payload || $payload['exp'] < time()) return null;
    return $payload;
}

function requireAuth(): array {
    $auth = $_SERVER['HTTP_AUTHORIZATION'] ?? '';
    if (!str_starts_with($auth, 'Bearer ')) {
        respondError('Unauthorized', 401);
    }
    $token = substr($auth, 7);
    $user  = jwtDecode($token);
    if (!$user) respondError('Token invalid or expired', 401);
    return $user;
}

function sanitize(string $input): string {
    return htmlspecialchars(trim($input), ENT_QUOTES, 'UTF-8');
}

function getBody(): array {
    $raw = file_get_contents('php://input');
    return json_decode($raw, true) ?? [];
}
