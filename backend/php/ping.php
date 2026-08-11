<?php
// GET https://erp.ttshop.pro/code_source/backend/php/ping.php
// Vérifie que PHP, la base et les tables répondent.
require_once __DIR__ . '/config.php';
require_method('GET', 'POST');

$pdo = db();
$tables = [];
foreach (['leads', 'visitors'] as $t) {
    $st = $pdo->prepare('SELECT COUNT(*) FROM information_schema.tables WHERE table_schema = DATABASE() AND table_name = :t');
    $st->execute([':t' => $t]);
    $tables[$t] = (bool)$st->fetchColumn();
}
ok([
    'php'     => PHP_VERSION,
    'db'      => true,
    'tables'  => $tables,
    'curl'    => function_exists('curl_init'),
    'time'    => date('c'),
]);
