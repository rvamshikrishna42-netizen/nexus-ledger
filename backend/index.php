<?php

$path = trim(parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH), '/');

if ($path === 'api/auth/login') {
    $_GET['action'] = 'login';
    require __DIR__ . '/auth.php';
}

if ($path === 'api/auth/register') {
    $_GET['action'] = 'register';
    require __DIR__ . '/auth.php';
}

if ($path === 'api/auth/logout') {
    $_GET['action'] = 'logout';
    require __DIR__ . '/auth.php';
}

if ($path === 'api/auth/me') {
    $_GET['action'] = 'me';
    require __DIR__ . '/auth.php';
}

if ($path === 'api/assets') {
    require __DIR__ . '/assets.php';
}

if ($path === 'api/certificates') {
    require __DIR__ . '/certificates.php';
}

if ($path === 'api/audit') {
    require __DIR__ . '/audit.php';
}

if ($path === 'api/dids') {
    require __DIR__ . '/dids.php';
}

http_response_code(404);
header('Content-Type: application/json');
echo json_encode([
    'error' => 'API endpoint not found'
]);