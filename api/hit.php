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
// Отдельный журнал последних заходов: сводка отвечает «сколько», а он —
// «когда и откуда». Держим ограниченное число записей, чтобы файл не рос.
const VISITS_FILE = PRIVATE_DIR . '/stats/visits.json';
const VISITS_KEEP = 300;
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

// Свои заходы не считаем: иначе статистика показывает работу менеджеров,
// а не интерес покупателей.
if (is_staff()) {
    json_out(200, ['ok' => true, 'skipped' => 'staff']);
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

// Часовой пояс -> понятная область. Точного города так не узнать, зато
// не приходится отправлять адрес посетителя в чужой сервис геолокации.
function region_from_tz(string $tz): string
{
    static $map = [
        'Asia/Vladivostok' => 'Владивосток и Приморье',
        'Asia/Ust-Nera' => 'Якутия (восток)',
        'Asia/Magadan' => 'Магадан, Сахалин',
        'Asia/Sakhalin' => 'Сахалин',
        'Asia/Srednekolymsk' => 'Колыма',
        'Asia/Kamchatka' => 'Камчатка',
        'Asia/Anadyr' => 'Чукотка',
        'Asia/Yakutsk' => 'Якутия',
        'Asia/Khandyga' => 'Якутия',
        'Asia/Chita' => 'Забайкалье',
        'Asia/Irkutsk' => 'Иркутск, Бурятия',
        'Asia/Krasnoyarsk' => 'Красноярск',
        'Asia/Novosibirsk' => 'Новосибирск',
        'Asia/Novokuznetsk' => 'Кузбасс',
        'Asia/Barnaul' => 'Алтай',
        'Asia/Tomsk' => 'Томск',
        'Asia/Omsk' => 'Омск',
        'Asia/Yekaterinburg' => 'Урал',
        'Europe/Samara' => 'Самара',
        'Europe/Saratov' => 'Саратов',
        'Europe/Volgograd' => 'Волгоград',
        'Europe/Astrakhan' => 'Астрахань',
        'Europe/Ulyanovsk' => 'Ульяновск',
        'Europe/Moscow' => 'Москва и центр России',
        'Europe/Kirov' => 'Киров',
        'Europe/Kaliningrad' => 'Калининград',
        'Asia/Almaty' => 'Казахстан',
        'Asia/Aqtobe' => 'Казахстан',
        'Asia/Atyrau' => 'Казахстан',
        'Asia/Qostanay' => 'Казахстан',
        'Europe/Minsk' => 'Беларусь',
        'Asia/Tashkent' => 'Узбекистан',
        'Asia/Bishkek' => 'Киргизия',
        'Asia/Tokyo' => 'Япония',
        'Asia/Seoul' => 'Корея',
        'Asia/Shanghai' => 'Китай',
    ];
    $tz = trim($tz);
    if ($tz === '') {
        return 'не определено';
    }
    if (isset($map[$tz])) {
        return $map[$tz];
    }
    // Незнакомый пояс: показываем хотя бы часть света, чтобы не плодить строки.
    $part = explode('/', $tz)[0];
    $parts = ['Europe' => 'Европа', 'Asia' => 'Азия', 'America' => 'Америка',
              'Africa' => 'Африка', 'Australia' => 'Австралия', 'Pacific' => 'Океания'];
    return $parts[$part] ?? 'другие страны';
}

$region = region_from_tz((string) ($payload['tz'] ?? ''));

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
$today = $stats['days'][$day] ?? ['views' => 0, 'visitors' => [], 'pages' => [], 'sources' => [], 'hours' => [], 'regions' => []];
$today['regions'] = $today['regions'] ?? [];

$today['views']++;
$hash = visitor_hash($ip, $agent, $day);
$today['pages'][$page] = ($today['pages'][$page] ?? 0) + 1;
$today['sources'][$source] = ($today['sources'][$source] ?? 0) + 1;
// Область считаем по людям, а не по просмотрам: иначе один посетитель,
// открывший десять карточек, выглядит как десять человек из своего города.
$isNewVisitor = !isset($today['visitors'][$hash]);
if ($isNewVisitor) {
    $today['regions'][$region] = ($today['regions'][$region] ?? 0) + 1;
}
$today['visitors'][$hash] = 1;
$hour = $now->format('H');
$today['hours'][$hour] = ($today['hours'][$hour] ?? 0) + 1;

// Списки подрезаем, чтобы файл не разрастался от случайных адресов.
foreach (['pages', 'sources', 'regions'] as $key) {
    if (count($today[$key]) > TOP_KEEP) {
        arsort($today[$key]);
        $today[$key] = array_slice($today[$key], 0, TOP_KEEP, true);
    }
}

$stats['days'][$day] = $today;
save_json_file($file, $stats);

// В журнал попадает сам факт визита — один раз на человека за день, без
// указания страниц: сколько какую страницу смотрели, видно в сводке выше,
// а прослеживать маршрут конкретного посетителя незачем.
if ($isNewVisitor) {
    $visits = load_json_file(VISITS_FILE);
    array_unshift($visits, [
        'at' => $now->format('c'),
        'source' => $source,
        'region' => $region,
    ]);
    save_json_file(VISITS_FILE, array_slice($visits, 0, VISITS_KEEP));
}

json_out(200, ['ok' => true]);
