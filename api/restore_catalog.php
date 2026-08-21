<?php
// Возврат каталога из резервной копии.
//
// Копии складывает api/motors.php перед каждой записью — по одной на каждое
// сохранение из панели, последние тридцать. Эта страница показывает список
// и позволяет вернуть любую.
//
//     https://домен/api/restore_catalog.php?password=ПАРОЛЬ
//     https://домен/api/restore_catalog.php?password=ПАРОЛЬ&restore=motors-2026-08-21_101500.json

declare(strict_types=1);

require __DIR__ . '/lib.php';

require_admin($_GET['password'] ?? null);

const BACKUP_DIR = PRIVATE_DIR . '/catalog-backups';
const MOTORS_FILE = DATA_DIR . '/motors.json';

$files = glob(BACKUP_DIR . '/motors-*.json') ?: [];
rsort($files);

$message = '';
$restore = (string) ($_GET['restore'] ?? '');
if ($restore !== '') {
    // Имя берём только из списка: чужие пути сюда не пройдут.
    $target = BACKUP_DIR . '/' . basename($restore);
    if (!in_array($target, $files, true)) {
        $message = 'Такой копии нет';
    } else {
        $data = load_json_file($target);
        if (!$data) {
            $message = 'Копия пустая или испорчена';
        } else {
            @copy(MOTORS_FILE, BACKUP_DIR . '/motors-' . gmdate('Y-m-d_His') . '-before-restore.json');
            $message = save_json_file(MOTORS_FILE, $data)
                ? 'Каталог возвращён: ' . count($data) . ' позиций'
                : 'Не удалось записать каталог';
            $files = glob(BACKUP_DIR . '/motors-*.json') ?: [];
            rsort($files);
        }
    }
}

$password = (string) ($_GET['password'] ?? '');
header('Content-Type: text/html; charset=utf-8');
echo '<!doctype html><meta charset="utf-8"><title>Копии каталога</title>';
echo '<style>body{font:16px/1.6 -apple-system,system-ui,sans-serif;max-width:760px;margin:40px auto;padding:0 20px}'
   . 'li{margin-bottom:8px}small{color:#666}h1{font-size:22px}.msg{padding:10px 14px;background:#f4efe0;border-radius:8px}</style>';
echo '<h1>Резервные копии каталога</h1>';
if ($message !== '') {
    echo '<p class="msg">' . htmlspecialchars($message, ENT_QUOTES, 'UTF-8') . '</p>';
}
if (!$files) {
    echo '<p>Копий пока нет — они появляются при каждом сохранении мотора в панели.</p>';
} else {
    echo '<p>Нажмите на дату, чтобы вернуть каталог к этому состоянию. Текущая версия при этом тоже сохранится копией.</p><ul>';
    foreach ($files as $file) {
        $name = basename($file);
        $count = count(load_json_file($file));
        $when = date('d.m.Y H:i', (int) filemtime($file));
        echo '<li><a href="?password=' . rawurlencode($password) . '&restore=' . rawurlencode($name) . '">'
           . htmlspecialchars($when, ENT_QUOTES, 'UTF-8') . '</a> — позиций: ' . $count
           . ' <small>' . htmlspecialchars($name, ENT_QUOTES, 'UTF-8') . '</small></li>';
    }
    echo '</ul>';
}
