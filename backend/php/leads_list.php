<?php
// GET leads_list.php?key=Ttshop2026&limit=500&search=&status=
require_once __DIR__ . '/config.php';
require_method('GET', 'POST');

const PANEL_KEY = 'Ttshop2026';
$key = $_GET['key'] ?? (json_input()['key'] ?? '');
if (!hash_equals(PANEL_KEY, (string)$key)) fail('Unauthorized', 401);

$limit  = min(2000, max(1, (int)($_GET['limit'] ?? 500)));
$search = s($_GET['search'] ?? null, 120);
$status = s($_GET['status'] ?? null, 20);

$where = [];
$args  = [];
if ($search !== null) {
    $where[] = '(leads_name LIKE :q OR leads_first_name LIKE :q OR leads_phone LIKE :q OR leads_cin LIKE :q OR leads_governorate LIKE :q)';
    $args[':q'] = '%' . $search . '%';
}
if ($status !== null && $status !== 'all') {
    $where[] = 'leads_status = :st';
    $args[':st'] = $status;
}
$sql = 'SELECT * FROM leads' . ($where ? ' WHERE ' . implode(' AND ', $where) : '')
     . ' ORDER BY leads_created_at DESC LIMIT ' . $limit;
$st = db()->prepare($sql);
$st->execute($args);
$rows = $st->fetchAll();

$stats = db()->query(
    "SELECT COUNT(*) total,
            SUM(leads_created_at >= CURDATE()) today,
            SUM(leads_created_at >= DATE_SUB(NOW(), INTERVAL 7 DAY)) week,
            SUM(leads_existing_client = 1) existing
     FROM leads"
)->fetch();

$byGov = db()->query(
    'SELECT leads_governorate gov, COUNT(*) c FROM leads
     WHERE leads_governorate IS NOT NULL GROUP BY gov ORDER BY c DESC LIMIT 12'
)->fetchAll();

ok(['rows' => $rows, 'stats' => $stats, 'byGovernorate' => $byGov]);