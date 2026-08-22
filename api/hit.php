<?php
// Счётчик посещений.
//
// Считаем сами, без Яндекс.Метрики и Google Analytics: данные остаются на
// своём хостинге и никуда не уходят. IP-адрес не сохраняется — из него, даты
// и браузера делается необратимый отпечаток, по которому посетитель за день
// считается один раз. Восстановить по нему человека нельзя.
//
// Данные складываются помесячно: private/stats/2026-08.json. Файл маленький —
// это счётчики по дням, а не журнал каждого захода.

declare(strict_types=1);

require __DIR__ . '/lib.php';

const STATS_DIR = PRIVATE_DIR . '/stats';
// Столько страниц и источников держим в списке, остальное — в «прочее».
const TOP_KEEP = 40;

// Заходы поисковых роботов в статистику не попадают: иначе цифры врут.
function looks_like_bot(string $agent): bool
{
    if ($agent === '') {
        return true;
    }
    return (bool) preg_match(
        '/bot|crawler|spider|crawl|slurp|yandex(?!browser)|google|bing|baidu|duckduck|facebookexternalhit|semrush|ahrefs|mj12|dotbot|petal|headless|python-requests|curl|wget/i',
        $agent
    );
}

function visitor_hash(string $ip, string $agent, string $day): string
{
    // Соль привязана к дню: один и тот же человек завтра получит другой
    // отпечаток, следить за ним между днями по этим данным невозможно.
    return substr(hash('sha256', $day . '|' . $ip . '|' . $agent), 0, 16);
}

$method = $_SERVER['REQUEST_METHOD'] ?? 'GET';
if ($method !== 'POST') {
    json_out(405, ['error' => 'Метод не поддерживается']);
}

$agent = (string) ($_SERVER['HTTP_USER_AGENT'] ?? '');
if (looks_like_bot($agent)) {
    json_out(200, ['ok' => true, 'skipped' => 'bot']);
}

$payload = read_json_body();
$page = trim((string) ($payload['page'] ?? ''));
// Пишем только путь в пределах сайта — ни доменов, ни параметров.
$page = parse_url($page, PHP_URL_PATH) ?: '/';
$page = '/' . ltrim(substr($page, 0, 120), '/');

$ref = trim((string) ($payload['ref'] ?? ''));
$refHost = $ref !== '' ? (parse_url($ref, PHP_URL_HOST) ?: '') : '';
if ($refHost !== '' && str_contains($refHost, 'motor-vl.ru')) {
    $refHost = '';
}
$source = $refHost !== '' ? mb_substr($refHost, 0, 60) : 'прямые заходы';

$ip = '';
foreach (['HTTP_X_REAL_IP', 'HTTP_X_FORWARDED_FOR', 'REMOTE_ADDR'] as $key) {
    $value = (string) ($_SERVER[$key] ?? '');
    if ($value !== '') {
        $candidate = trim(explode(',', $value)[0]);
        if (filter_var($candidate, FILTER_VALIDATE_IP)) {
            $ip = $candidate;
            break;
        }
    }
}

$now = new DateTimeImmutable('now', new DateTimeZone('Asia/Vladivostok'));
$day = $now->format('Y-m-d');
$file = STATS_DIR . '/' . $now->format('Y-m') . '.json';

if (!is_dir(STATS_DIR) && !mkdir(STATS_DIR, 0755, true) && !is_dir(STATS_DIR)) {
    json_out(200, ['ok' => true, 'skipped' => 'no-dir']);
}

$stats = load_json_file($file);
$stats['days'] = $stats['days'] ?? [];
$today = $stats['days'][$day] ?? ['views' => 0, 'visitors' => [], 'pages' => [], 'sources' => [], 'hours' => []];

$today['views']++;
$hash = visitor_hash($ip, $agent, $day);
$today['visitors'][$hash] = 1;
$today['pages'][$page] = ($today['pages'][$page] ?? 0) + 1;
$today['sources'][$source] = ($today['sources'][$source] ?? 0) + 1;
$hour = $now->format('H');
$today['hours'][$hour] = ($today['hours'][$hour] ?? 0) + 1;

// Списки подрезаем, чтобы файл не разрастался от случайных адресов.
foreach (['pages', 'sources'] as $key) {
    if (count($today[$key]) > TOP_KEEP) {
        arsort($today[$key]);
        $today[$key] = array_slice($today[$key], 0, TOP_KEEP, true);
    }
}

$stats['days'][$day] = $today;
save_json_file($file, $stats);

json_out(200, ['ok' => true]);
