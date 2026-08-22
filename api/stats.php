<?php
// Сводка посещений для панели управления.
//
// Читает помесячные файлы счётчика и отдаёт готовые числа: сколько заходов
// и посетителей по дням, откуда пришли, какие страницы смотрят. Считает
// заодно заявки из private/leads.json — по ним видно, во что превращаются
// посещения.

declare(strict_types=1);

require __DIR__ . '/lib.php';

const STATS_DIR = PRIVATE_DIR . '/stats';
const LEADS_FILE = PRIVATE_DIR . '/leads.json';

require_admin($_SERVER['HTTP_X_ADMIN_PASSWORD'] ?? ($_GET['password'] ?? null));

$days = (int) ($_GET['days'] ?? 30);
$days = max(7, min(90, $days));

$zone = new DateTimeZone('Asia/Vladivostok');
$today = new DateTimeImmutable('now', $zone);

// Собираем нужные месяцы: период может начинаться в прошлом.
$months = [];
for ($i = 0; $i < $days; $i++) {
    $months[$today->modify("-$i day")->format('Y-m')] = true;
}

$raw = [];
foreach (array_keys($months) as $month) {
    $file = STATS_DIR . '/' . $month . '.json';
    $data = load_json_file($file);
    foreach (($data['days'] ?? []) as $day => $info) {
        $raw[$day] = $info;
    }
}

$series = [];
$totalViews = 0;
$totalVisitors = 0;
$pages = [];
$sources = [];
$hours = array_fill(0, 24, 0);

for ($i = $days - 1; $i >= 0; $i--) {
    $day = $today->modify("-$i day")->format('Y-m-d');
    $info = $raw[$day] ?? null;
    $views = (int) ($info['views'] ?? 0);
    $visitors = is_array($info['visitors'] ?? null) ? count($info['visitors']) : 0;
    $series[] = ['date' => $day, 'views' => $views, 'visitors' => $visitors];
    $totalViews += $views;
    $totalVisitors += $visitors;

    foreach (($info['pages'] ?? []) as $page => $count) {
        $pages[$page] = ($pages[$page] ?? 0) + (int) $count;
    }
    foreach (($info['sources'] ?? []) as $source => $count) {
        $sources[$source] = ($sources[$source] ?? 0) + (int) $count;
    }
    foreach (($info['hours'] ?? []) as $hour => $count) {
        $hours[(int) $hour] += (int) $count;
    }
}

arsort($pages);
arsort($sources);

// Заявки за тот же период — чтобы видеть отдачу от посещений.
$leadsAll = load_json_file(LEADS_FILE);
$since = $today->modify('-' . ($days - 1) . ' day')->format('Y-m-d');
$leadsInPeriod = 0;
foreach ($leadsAll as $lead) {
    $created = substr((string) ($lead['createdAt'] ?? ''), 0, 10);
    if ($created !== '' && $created >= $since) {
        $leadsInPeriod++;
    }
}

json_out(200, [
    'days' => $days,
    'series' => $series,
    'totals' => [
        'views' => $totalViews,
        'visitors' => $totalVisitors,
        'leads' => $leadsInPeriod,
        // Во сколько заходов обходится одна заявка — понятнее, чем проценты.
        'perLead' => $leadsInPeriod > 0 ? (int) round($totalVisitors / $leadsInPeriod) : 0,
    ],
    'pages' => array_slice($pages, 0, 8, true),
    'sources' => array_slice($sources, 0, 8, true),
    'hours' => $hours,
]);
