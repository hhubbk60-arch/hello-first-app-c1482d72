<?php
// POST https://ttshop.pro/backend/leads_insert.php
// Body (JSON): { name, firstName, phone, cin, governorate, need, ... }
require_once __DIR__ . '/config.php';
require_method('POST');

$in = json_input();

$name  = s($in['name'] ?? $in['nom'] ?? null, 120);
$phone = digits($in['phone'] ?? $in['telephone'] ?? null, 20);
if (!$name)  fail('Le nom est obligatoire.', 422, ['field' => 'name']);
if (!$phone || strlen($phone) < 8) fail('Numéro de téléphone invalide.', 422, ['field' => 'phone']);

$ip  = client_ip();
$geo = geo_lookup($ip);
$ua  = s($_SERVER['HTTP_USER_AGENT'] ?? null, 500);
$dev = parse_ua($ua);

$uuid = sprintf(
    '%04x%04x-%04x-4%03x-%04x-%04x%04x%04x',
    random_int(0, 0xffff), random_int(0, 0xffff), random_int(0, 0xffff),
    random_int(0, 0x0fff), random_int(0, 0x3fff) | 0x8000,
    random_int(0, 0xffff), random_int(0, 0xffff), random_int(0, 0xffff)
);

$row = [
    'leads_uuid'            => $uuid,
    'leads_name'            => $name,
    'leads_first_name'      => s($in['firstName'] ?? $in['prenom'] ?? null, 120),
    'leads_phone'           => $phone,
    'leads_phone2'          => digits($in['phone2'] ?? null, 20),
    'leads_email'           => s($in['email'] ?? null, 190),
    'leads_cin'             => digits($in['cin'] ?? null, 20),
    'leads_governorate'     => s($in['governorate'] ?? $in['gouvernorat'] ?? null, 80),
    'leads_delegation'      => s($in['delegation'] ?? null, 80),
    'leads_address'         => s($in['address'] ?? null, 255),
    'leads_postal_code'     => s($in['postalCode'] ?? null, 10),
    'leads_need'            => s($in['need'] ?? null, 120),
    'leads_offer'           => s($in['offer'] ?? null, 120),
    'leads_message'         => s($in['message'] ?? null, 2000),
    'leads_lang'            => s($in['lang'] ?? 'fr', 5) ?: 'fr',
    'leads_existing_client' => !empty($in['existingClient']) ? 1 : 0,
    'leads_source'          => s($in['source'] ?? 'landing', 80) ?: 'landing',
    'leads_utm_source'      => s($in['utm_source'] ?? null, 120),
    'leads_utm_medium'      => s($in['utm_medium'] ?? null, 120),
    'leads_utm_campaign'    => s($in['utm_campaign'] ?? null, 160),
    'leads_utm_content'     => s($in['utm_content'] ?? null, 160),
    'leads_utm_term'        => s($in['utm_term'] ?? null, 160),
    'leads_gclid'           => s($in['gclid'] ?? null, 190),
    'leads_fbclid'          => s($in['fbclid'] ?? null, 190),
    'leads_referrer'        => s($in['referrer'] ?? null, 500),
    'leads_landing_page'    => s($in['page'] ?? null, 500),
    'leads_form_id'         => s($in['formId'] ?? null, 80),
    'leads_visitor_id'      => s($in['visitorId'] ?? null, 36),
    'leads_ip'              => $ip,
    'leads_country'         => $geo['country'],
    'leads_region'          => $geo['region'],
    'leads_city'            => $geo['city'],
    'leads_user_agent'      => $ua,
    'leads_device'          => $dev['device'],
];

$pdo = db();

// Doublon éventuel (même CIN ou même téléphone) — on enregistre quand même.
// NB: chaque placeholder n'est utilisé qu'une seule fois (PDO sans émulation).
$dupStmt = $pdo->prepare(
    'SELECT leads_id FROM leads WHERE leads_phone = :p OR (:c1 IS NOT NULL AND leads_cin = :c2) LIMIT 1'
);
$dupStmt->execute([
    ':p'  => $row['leads_phone'],
    ':c1' => $row['leads_cin'],
    ':c2' => $row['leads_cin'],
]);
$duplicate = (bool)$dupStmt->fetchColumn();

$cols = array_keys($row);
$sql  = 'INSERT INTO leads (' . implode(', ', $cols) . ') VALUES (:' . implode(', :', $cols) . ')';
$stmt = $pdo->prepare($sql);
foreach ($row as $k => $v) $stmt->bindValue(':' . $k, $v);
$stmt->execute();

if (!empty($row['leads_visitor_id'])) {
    $pdo->prepare('UPDATE visitors SET visitors_is_lead = 1 WHERE visitors_visitor_id = :v')
        ->execute([':v' => $row['leads_visitor_id']]);
}

ok([
    'id'        => (int)$pdo->lastInsertId(),
    'uuid'      => $uuid,
    'duplicate' => $duplicate,
    'message'   => 'Lead enregistré',
]);