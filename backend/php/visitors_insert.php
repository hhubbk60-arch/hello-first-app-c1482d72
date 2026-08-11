<?php
// POST https://erp.ttshop.pro/code_source/backend/php/visitors_insert.php
// Body (JSON): { visitorId, sessionId, page, pageTitle, referrer, lang,
//                screen, timezone, timeOnPage, scrollDepth, utm_* }
// Appelé une fois à l'arrivée, puis à la sortie (upsert par visitor+session+page).
require_once __DIR__ . '/config.php';
require_method('POST');

$in = json_input();

$visitorId = s($in['visitorId'] ?? null, 36);
if (!$visitorId) fail('visitorId manquant.', 422, ['field' => 'visitorId']);

$sessionId = s($in['sessionId'] ?? null, 36);
$page      = s($in['page'] ?? null, 500) ?: '/';
$time      = max(0, (int)($in['timeOnPage'] ?? 0));
$scroll    = min(100, max(0, (int)($in['scrollDepth'] ?? 0)));

$pdo = db();

// Ligne existante pour ce visiteur / session / page ?
// NB: chaque placeholder n'est utilisé qu'une seule fois (PDO sans émulation).
$find = $pdo->prepare(
    'SELECT visitors_id FROM visitors
      WHERE visitors_visitor_id = :v
        AND (:s1 IS NULL OR visitors_session_id = :s2)
        AND visitors_page = :p
      ORDER BY visitors_id DESC LIMIT 1'
);
$find->execute([
    ':v'  => $visitorId,
    ':s1' => $sessionId,
    ':s2' => $sessionId,
    ':p'  => $page,
]);
$existingId = $find->fetchColumn();

if ($existingId) {
    $upd = $pdo->prepare(
        'UPDATE visitors
            SET visitors_time_on_page = GREATEST(visitors_time_on_page, :t),
                visitors_scroll_depth = GREATEST(visitors_scroll_depth, :d),
                visitors_last_seen_at = NOW()
          WHERE visitors_id = :id'
    );
    $upd->execute([':t' => $time, ':d' => $scroll, ':id' => $existingId]);
    ok(['id' => (int)$existingId, 'updated' => true]);
}

$ip  = client_ip();
$geo = geo_lookup($ip);
$ua  = s($_SERVER['HTTP_USER_AGENT'] ?? null, 500);
$dev = parse_ua($ua);

$row = [
    'visitors_visitor_id'   => $visitorId,
    'visitors_session_id'   => $sessionId,
    'visitors_ip'           => $ip,
    'visitors_country'      => $geo['country'],
    'visitors_country_name' => $geo['country_name'],
    'visitors_region'       => $geo['region'],
    'visitors_city'         => $geo['city'],
    'visitors_latitude'     => $geo['latitude'],
    'visitors_longitude'    => $geo['longitude'],
    'visitors_isp'          => $geo['isp'],
    'visitors_page'         => $page,
    'visitors_page_title'   => s($in['pageTitle'] ?? null, 255),
    'visitors_referrer'     => s($in['referrer'] ?? null, 500),
    'visitors_utm_source'   => s($in['utm_source'] ?? null, 120),
    'visitors_utm_medium'   => s($in['utm_medium'] ?? null, 120),
    'visitors_utm_campaign' => s($in['utm_campaign'] ?? null, 160),
    'visitors_utm_content'  => s($in['utm_content'] ?? null, 160),
    'visitors_utm_term'     => s($in['utm_term'] ?? null, 160),
    'visitors_gclid'        => s($in['gclid'] ?? null, 190),
    'visitors_fbclid'       => s($in['fbclid'] ?? null, 190),
    'visitors_lang'         => s($in['lang'] ?? null, 10),
    'visitors_user_agent'   => $ua,
    'visitors_device'       => $dev['device'],
    'visitors_browser'      => $dev['browser'],
    'visitors_os'           => $dev['os'],
    'visitors_screen'       => s($in['screen'] ?? null, 20),
    'visitors_timezone'     => s($in['timezone'] ?? null, 60),
    'visitors_time_on_page' => $time,
    'visitors_scroll_depth' => $scroll,
];

$cols = array_keys($row);
$stmt = $pdo->prepare('INSERT INTO visitors (' . implode(', ', $cols) . ') VALUES (:' . implode(', :', $cols) . ')');
foreach ($row as $k => $v) $stmt->bindValue(':' . $k, $v);
$stmt->execute();

ok(['id' => (int)$pdo->lastInsertId(), 'created' => true]);