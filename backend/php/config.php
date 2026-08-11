<?php
// =====================================================================
// TTshop Pro — Landing backend bootstrap (CORS + DB + helpers)
// Deploy to: https://erp.ttshop.pro/code_source/backend/php/
// Every endpoint in this folder includes this file first.
// =====================================================================

error_reporting(E_ALL);
ini_set('display_errors', 0);
ini_set('log_errors', 1);

// ---------- FATAL -> JSON --------------------------------------------
set_exception_handler(function ($e) {
    if (!headers_sent()) {
        http_response_code(500);
        header('Content-Type: application/json; charset=UTF-8');
    }
    echo json_encode([
        'success' => false,
        'message' => 'Server exception: ' . $e->getMessage(),
        'where'   => basename($e->getFile()) . ':' . $e->getLine(),
    ]);
    exit;
});
register_shutdown_function(function () {
    $e = error_get_last();
    if ($e && in_array($e['type'], [E_ERROR, E_PARSE, E_CORE_ERROR, E_COMPILE_ERROR, E_USER_ERROR], true)) {
        if (!headers_sent()) {
            http_response_code(500);
            header('Content-Type: application/json; charset=UTF-8');
        }
        echo json_encode([
            'success' => false,
            'message' => 'PHP fatal: ' . $e['message'],
            'where'   => basename($e['file']) . ':' . $e['line'],
        ]);
    }
});

// ---------- CORS ------------------------------------------------------
// Wildcard origin (no cookies/credentials are used anywhere), echoing back the
// exact headers the browser asks for so no preflight can ever fail.
$origin = $_SERVER['HTTP_ORIGIN'] ?? '*';
header("Access-Control-Allow-Origin: *");
header("Vary: Origin, Access-Control-Request-Headers, Access-Control-Request-Method");
header("Access-Control-Allow-Methods: GET, POST, PUT, PATCH, DELETE, HEAD, OPTIONS");
$reqHeaders = $_SERVER['HTTP_ACCESS_CONTROL_REQUEST_HEADERS']
    ?? 'Content-Type, Authorization, X-Requested-With, X-Auth-Token, X-Access-Key, X-Request-ID, Accept, Origin, Cache-Control, Pragma';
header("Access-Control-Allow-Headers: $reqHeaders");
header("Access-Control-Expose-Headers: Content-Type, Content-Length");
header("Access-Control-Max-Age: 86400");
header("Content-Type: application/json; charset=UTF-8");
header("Cache-Control: no-store, no-cache, must-revalidate");
header("Pragma: no-cache");

if (($_SERVER['REQUEST_METHOD'] ?? '') === 'OPTIONS') {
    http_response_code(204);
    exit;
}

// ---------- DATABASE --------------------------------------------------
class Database {
    private $host = "ttshopmuser.mysql.db";
    private $username = "ttshopmuser";
    private $password = "Ttshop2026";
    private $database = "ttshopmuser";
    public $conn;

    public function getConnection() {
        $this->conn = null;
        try {
            $this->conn = new PDO(
                "mysql:host=" . $this->host . ";dbname=" . $this->database . ";charset=utf8mb4",
                $this->username,
                $this->password,
                [
                    PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
                    PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
                    PDO::ATTR_EMULATE_PREPARES   => false,
                ]
            );
        } catch (PDOException $e) {
            http_response_code(500);
            echo json_encode(['success' => false, 'message' => 'Connection error: ' . $e->getMessage()]);
            exit;
        }
        return $this->conn;
    }
}

function db(): PDO {
    static $pdo = null;
    if ($pdo === null) $pdo = (new Database())->getConnection();
    return $pdo;
}

// ---------- HELPERS ---------------------------------------------------
function json_input(): array {
    $raw = file_get_contents('php://input');
    if (!$raw) return $_POST ?: [];
    $data = json_decode($raw, true);
    return is_array($data) ? $data : ($_POST ?: []);
}

function ok($data = [], int $code = 200): void {
    http_response_code($code);
    echo json_encode(['success' => true] + (is_array($data) ? $data : ['data' => $data]));
    exit;
}

function fail(string $message, int $code = 400, array $extra = []): void {
    http_response_code($code);
    echo json_encode(['success' => false, 'message' => $message] + $extra);
    exit;
}

function require_method(string ...$methods): void {
    if (!in_array($_SERVER['REQUEST_METHOD'] ?? '', $methods, true)) {
        fail('Method not allowed', 405);
    }
}

function s($v, int $max = 255): ?string {
    if ($v === null) return null;
    $v = trim(preg_replace('/\s+/u', ' ', (string)$v));
    if ($v === '') return null;
    return mb_substr($v, 0, $max);
}

function digits($v, int $max = 20): ?string {
    if ($v === null) return null;
    $v = preg_replace('/\D/', '', (string)$v);
    return $v === '' ? null : substr($v, 0, $max);
}

/** Best-effort real client IP behind proxies / CDN. */
function client_ip(): ?string {
    $keys = ['HTTP_CF_CONNECTING_IP', 'HTTP_X_FORWARDED_FOR', 'HTTP_X_REAL_IP', 'REMOTE_ADDR'];
    foreach ($keys as $k) {
        if (empty($_SERVER[$k])) continue;
        foreach (explode(',', (string)$_SERVER[$k]) as $candidate) {
            $candidate = trim($candidate);
            if (filter_var($candidate, FILTER_VALIDATE_IP)) return $candidate;
        }
    }
    return null;
}

/** Country / region / city lookup. Uses CDN headers first, then a free GeoIP. */
function geo_lookup(?string $ip): array {
    $out = [
        'country'      => s($_SERVER['HTTP_CF_IPCOUNTRY'] ?? null, 2),
        'country_name' => null,
        'region'       => null,
        'city'         => null,
        'latitude'     => null,
        'longitude'    => null,
        'isp'          => null,
    ];
    if (!$ip || filter_var($ip, FILTER_VALIDATE_IP, FILTER_FLAG_NO_PRIV_RANGE | FILTER_FLAG_NO_RES_RANGE) === false) {
        return $out;
    }
    $url = "http://ip-api.com/json/{$ip}?fields=status,country,countryCode,regionName,city,lat,lon,isp";
    $raw = http_get($url);
    if ($raw) {
        $j = json_decode($raw, true);
        if (is_array($j) && ($j['status'] ?? '') === 'success') {
            $out['country']      = s($j['countryCode'] ?? null, 2) ?: $out['country'];
            $out['country_name'] = s($j['country'] ?? null, 100);
            $out['region']       = s($j['regionName'] ?? null, 100);
            $out['city']         = s($j['city'] ?? null, 100);
            $out['latitude']     = isset($j['lat']) ? (float)$j['lat'] : null;
            $out['longitude']    = isset($j['lon']) ? (float)$j['lon'] : null;
            $out['isp']          = s($j['isp'] ?? null, 150);
        }
    }
    return $out;
}

/** Petit GET HTTP tolérant : cURL si dispo, sinon file_get_contents. */
function http_get(string $url, int $timeout = 2): ?string {
    if (function_exists('curl_init')) {
        $ch = curl_init($url);
        curl_setopt_array($ch, [
            CURLOPT_RETURNTRANSFER => true,
            CURLOPT_TIMEOUT        => $timeout,
            CURLOPT_CONNECTTIMEOUT => $timeout,
            CURLOPT_FOLLOWLOCATION => true,
        ]);
        $res = curl_exec($ch);
        curl_close($ch);
        if (is_string($res) && $res !== '') return $res;
        return null;
    }
    if (!ini_get('allow_url_fopen')) return null;
    $ctx = stream_context_create(['http' => ['timeout' => $timeout, 'ignore_errors' => true]]);
    $res = @file_get_contents($url, false, $ctx);
    return is_string($res) && $res !== '' ? $res : null;
}

/** Very small UA parser — enough for reporting. */
function parse_ua(?string $ua): array {
    $ua = (string)$ua;
    $device = preg_match('/Mobile|Android|iPhone|iPod/i', $ua) ? 'mobile'
        : (preg_match('/iPad|Tablet/i', $ua) ? 'tablet' : 'desktop');
    $browser = 'other';
    foreach ([['Edg', 'Edge'], ['OPR', 'Opera'], ['Chrome', 'Chrome'], ['Safari', 'Safari'], ['Firefox', 'Firefox']] as [$needle, $name]) {
        if (stripos($ua, $needle) !== false) { $browser = $name; break; }
    }
    $os = 'other';
    foreach ([['Windows', 'Windows'], ['Android', 'Android'], ['iPhone', 'iOS'], ['iPad', 'iOS'], ['Mac OS', 'macOS'], ['Linux', 'Linux']] as [$needle, $name]) {
        if (stripos($ua, $needle) !== false) { $os = $name; break; }
    }
    return ['device' => $device, 'browser' => $browser, 'os' => $os];
}