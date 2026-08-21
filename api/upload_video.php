<?php
// Приём видеофайла из панели управления.
//
// Ролики весят десятки мегабайт, поэтому они НЕ идут вместе с остальной формой
// в JSON: браузер отправляет файл отдельным запросом (multipart), как это делают
// обычные формы загрузки. Иначе base64 раздул бы запрос на треть, и хостинг
// отказался бы его принимать.
//
// Обложку кадром из ролика делает браузер и присылает сюда картинкой —
// на общем хостинге нет ffmpeg, а без обложки плитка видео выглядит пустой.

declare(strict_types=1);

require __DIR__ . '/lib.php';

const VIDEO_SUBDIR = 'media/motors';
const MAX_VIDEO_BYTES = 200 * 1024 * 1024;

function fail(int $code, string $message): void
{
    json_out($code, ['error' => $message]);
}

if (($_SERVER['REQUEST_METHOD'] ?? 'GET') !== 'POST') {
    fail(405, 'Метод не поддерживается');
}

require_admin($_POST['password'] ?? null);

$motorId = preg_replace('/[^A-Za-z0-9_-]/', '', (string) ($_POST['motorId'] ?? '')) ?: '';
if ($motorId === '') {
    fail(400, 'Не указан мотор');
}

// Обложку можно прислать отдельно: браузер не всегда успевает снять кадр
// до отправки файла (например, MOV декодируется только после загрузки).
if (($_POST['action'] ?? '') === 'poster') {
    $name = preg_replace('/[^A-Za-z0-9_.-]/', '', (string) ($_POST['name'] ?? ''));
    $name = pathinfo($name, PATHINFO_FILENAME);
    if ($name === '') {
        fail(400, 'Не указан ролик');
    }
    $posterDir = ROOT_DIR . '/' . VIDEO_SUBDIR . '/' . $motorId . '/video/poster';
    if (!is_dir($posterDir) && !mkdir($posterDir, 0755, true) && !is_dir($posterDir)) {
        fail(500, 'Не удалось создать папку для обложек');
    }
    $data = (string) ($_POST['poster'] ?? '');
    if (str_contains($data, ',')) {
        $data = substr($data, strpos($data, ',') + 1);
    }
    $binary = base64_decode($data, true);
    if ($binary === false || !@getimagesizefromstring($binary)) {
        fail(400, 'Обложка не распознана');
    }
    if (file_put_contents($posterDir . '/' . $name . '.jpg', $binary) === false) {
        fail(500, 'Не удалось сохранить обложку');
    }
    json_out(200, ['poster' => '/' . VIDEO_SUBDIR . '/' . $motorId . '/video/poster/' . $name . '.jpg']);
}

$file = $_FILES['video'] ?? null;
if (!is_array($file) || ($file['error'] ?? UPLOAD_ERR_NO_FILE) !== UPLOAD_ERR_OK) {
    // Самая частая причина — файл больше, чем разрешает хостинг.
    $code = is_array($file) ? (int) $file['error'] : UPLOAD_ERR_NO_FILE;
    $hint = in_array($code, [UPLOAD_ERR_INI_SIZE, UPLOAD_ERR_FORM_SIZE], true)
        ? 'Файл слишком большой для хостинга (предел ' . ini_get('upload_max_filesize') . ')'
        : 'Файл не загрузился (код ' . $code . ')';
    fail(400, $hint);
}

if ($file['size'] > MAX_VIDEO_BYTES) {
    fail(400, 'Ролик больше 200 МБ — сожмите его перед загрузкой');
}

// Проверяем, что это действительно видео, а не переименованный файл.
$mime = '';
if (function_exists('finfo_open')) {
    $finfo = finfo_open(FILEINFO_MIME_TYPE);
    $mime = (string) finfo_file($finfo, $file['tmp_name']);
    finfo_close($finfo);
}
if ($mime !== '' && !str_starts_with($mime, 'video/')) {
    fail(400, 'Это не видеофайл (' . $mime . ')');
}

$dir = ROOT_DIR . '/' . VIDEO_SUBDIR . '/' . $motorId . '/video';
$posterDir = $dir . '/poster';
foreach ([$dir, $posterDir] as $needed) {
    if (!is_dir($needed) && !mkdir($needed, 0755, true) && !is_dir($needed)) {
        fail(500, 'Не удалось создать папку для видео — проверьте права на media/');
    }
}

// Имя делаем своё: в исходном могут быть пробелы, кириллица и что угодно ещё.
$name = 'v' . date('Ymd') . '_' . bin2hex(random_bytes(4));
$videoPath = $dir . '/' . $name . '.mp4';
if (!move_uploaded_file($file['tmp_name'], $videoPath)) {
    fail(500, 'Не удалось сохранить видео на сервере');
}

$posterUrl = '';
$posterData = (string) ($_POST['poster'] ?? '');
if ($posterData !== '') {
    if (str_contains($posterData, ',')) {
        $posterData = substr($posterData, strpos($posterData, ',') + 1);
    }
    $binary = base64_decode($posterData, true);
    if ($binary !== false && @getimagesizefromstring($binary)) {
        if (file_put_contents($posterDir . '/' . $name . '.jpg', $binary) !== false) {
            $posterUrl = '/' . VIDEO_SUBDIR . '/' . $motorId . '/video/poster/' . $name . '.jpg';
        }
    }
}

json_out(200, [
    'ok' => true,
    'url' => '/' . VIDEO_SUBDIR . '/' . $motorId . '/video/' . $name . '.mp4',
    'poster' => $posterUrl,
    'size' => $file['size'],
]);
