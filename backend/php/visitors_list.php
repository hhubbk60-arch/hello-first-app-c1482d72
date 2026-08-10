<?php
// GET visitors_list.php?key=Ttshop2026&limit=500&search=
require_once __DIR__ . '/config.php';
require_method('GET', 'POST');

const PANEL_KEY = 'Ttshop2026';
$key = $_GET['key'] ?? (json_input()['key'] ?? '');
if (!hash_equals(PANEL_KEY, (string)$key)) fail('Unauthorized', 401);

$limit  = min(2000, max(1, (int)($_GET['limit'] ?? 500)));
$search = s($_GET['search'] ?? null, 120);

$sql = 'SELECT * FROM visitors';
$args = [];
if ($search !== null) {
    $sql .= ' WHERE (visitors_ip LIKE :q OR visitors_city LIKE :q OR visitors_country_name LIKE :q
                     OR visitors_region LIKE :q OR visitors_page LIKE :q OR visitors_isp LIKE :q)';
    $args[':q'] = '%' . $search . '%';
}
$sql .= ' ORDER BY visitors_last_seen_at DESC LIMIT ' . $limit;
$st = db()->prepare($sql);
$st->execute($args);
$rows = $st->fetchAll();

$stats = db()->query(
    "SELECT COUNT(*) views,
            COUNT(DISTINCT visitors_visitor_id) uniques,
            COUNT(DISTINCT visitors_session_id) sessions,
            ROUND(AVG(visitors_time_on_page)) avg_time,
            ROUND(AVG(visitors_scroll_depth)) avg_scroll,
            SUM(visitors_last_seen_at >= DATE_SUB(NOW(), INTERVAL 5 MINUTE)) online
     FROM visitors"
)->fetch();

$byCountry = db()->query(
    'SELECT visitors_country code, visitors_country_name name, COUNT(*) c,
            COUNT(DISTINCT visitors_visitor_id) u
     FROM visitors GROUP BY code, name ORDER BY c DESC LIMIT 15'
)->fetchAll();

$byDevice = db()->query(
    'SELECT visitors_device device, COUNT(*) c FROM visitors GROUP BY device ORDER BY c DESC'
)->fetchAll();

$byPage = db()->query(
    'SELECT visitors_page page, COUNT(*) c FROM visitors GROUP BY page ORDER BY c DESC LIMIT 10'
)->fetchAll();

$timeline = db()->query(
    "SELECT DATE(visitors_entered_at) d, COUNT(*) c
     FROM visitors WHERE visitors_entered_at >= DATE_SUB(CURDATE(), INTERVAL 13 DAY)
     GROUP BY d ORDER BY d"
)->fetchAll();

ok([
    'rows'       => $rows,
    'stats'      => $stats,
    'byCountry'  => $byCountry,
    'byDevice'   => $byDevice,
    'byPage'     => $byPage,
    'timeline'   => $timeline,
]);