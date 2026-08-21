<?php
// Каталог моторов для панели /admin.
//
// В отличие от прежней схемы, файл data/motors.json лежит здесь же на хостинге
// и правится напрямую. GitHub-токен больше не нужен: сохранение — это запись
// файла, а не коммит в репозиторий.
//
// Фотографии из админки складываются в media/motors/<id>/.

declare(strict_types=1);

require __DIR__ . '/lib.php';

const MOTORS_FILE = DATA_DIR . '/motors.json';
const MEDIA_SUBDIR = 'media/motors';

const BRAND_LABELS = [
    'yamaha' => 'Yamaha',
    'honda' => 'Honda',
    'suzuki' => 'Suzuki',
    'tohatsu' => 'Tohatsu / Mercury',
    'parts' => 'Запчасти',
];

// Разрешаем только настоящие картинки: расширение из белого списка плюс
// проверка, что файл действительно изображение, а не переименованный скрипт.
const ALLOWED_EXT = ['jpg' => 'jpg', 'jpeg' => 'jpg', 'png' => 'png', 'webp' => 'webp'];

function decode_photo(string $base64): ?string
{
    // Из браузера может прийти как «data:image/jpeg;base64,...», так и чистая база.
    if (str_contains($base64, ',')) {
        $base64 = substr($base64, strpos($base64, ',') + 1);
    }
    $binary = base64_decode($base64, true);
    return $binary === false ? null : $binary;
}

function looks_like_image(string $binary): bool
{
    $info = @getimagesizefromstring($binary);
    return is_array($info) && !empty($info[0]);
}

function store_photo(string $motorId, string $filename, string $base64, int $seq): ?string
{
    $binary = decode_photo($base64);
    if ($binary === null || !looks_like_image($binary)) {
        return null;
    }
    $ext = strtolower(pathinfo($filename, PATHINFO_EXTENSION));
    $ext = ALLOWED_EXT[$ext] ?? 'jpg';

    $safeId = preg_replace('/[^A-Za-z0-9_-]/', '', $motorId) ?: 'motor';
    $dir = ROOT_DIR . '/' . MEDIA_SUBDIR . '/' . $safeId;
    if (!is_dir($dir) && !mkdir($dir, 0755, true) && !is_dir($dir)) {
        return null;
    }
    $name = 'photo' . $seq . '.' . $ext;
    if (file_put_contents($dir . '/' . $name, $binary) === false) {
        return null;
    }
    return '/' . MEDIA_SUBDIR . '/' . $safeId . '/' . $name;
}

function delete_photos(string $motorId): void
{
    $safeId = preg_replace('/[^A-Za-z0-9_-]/', '', $motorId) ?: '';
    if ($safeId === '') {
        return;
    }
    $dir = ROOT_DIR . '/' . MEDIA_SUBDIR . '/' . $safeId;
    if (!is_dir($dir)) {
        return;
    }
    foreach (glob($dir . '/*') ?: [] as $file) {
        if (is_file($file)) {
            unlink($file);
        }
    }
    @rmdir($dir);
}

$method = $_SERVER['REQUEST_METHOD'] ?? 'GET';

if ($method === 'GET') {
    require_admin($_SERVER['HTTP_X_ADMIN_PASSWORD'] ?? null);
    json_out(200, ['motors' => load_json_file(MOTORS_FILE)]);
}

if ($method !== 'POST') {
    json_out(405, ['error' => 'Метод не поддерживается']);
}

$payload = read_json_body();
require_admin($payload['password'] ?? null);

$motors = load_json_file(MOTORS_FILE);
$action = (string) ($payload['action'] ?? '');

if ($action === 'delete') {
    $id = (string) ($payload['id'] ?? '');
    $before = count($motors);
    $motors = array_values(array_filter($motors, static fn($m): bool => ($m['id'] ?? '') !== $id));
    if (count($motors) === $before) {
        json_out(404, ['error' => 'Мотор не найден']);
    }
    if (!save_json_file(MOTORS_FILE, $motors)) {
        json_out(500, ['error' => 'Не удалось записать data/motors.json — проверьте права на запись']);
    }
    delete_photos($id);
    json_out(200, ['motors' => $motors]);
}

if ($action === 'save') {
    $input = is_array($payload['motor'] ?? null) ? $payload['motor'] : [];
    $id = trim((string) ($input['id'] ?? ''));
    if ($id === '') {
        $id = 'm' . time();
    }

    $photoUrls = [];
    $mainUrl = '';
    $seq = 1;
    foreach (is_array($input['photos'] ?? null) ? $input['photos'] : [] as $photo) {
        if (!is_array($photo)) {
            continue;
        }
        if (($photo['type'] ?? '') === 'new') {
            $url = store_photo($id, (string) ($photo['filename'] ?? 'photo.jpg'), (string) ($photo['dataBase64'] ?? ''), $seq);
            if ($url === null) {
                json_out(400, ['error' => 'Не удалось сохранить фотографию — принимаются только JPG, PNG и WebP']);
            }
            $seq++;
        } else {
            $url = (string) ($photo['url'] ?? '');
        }
        if ($url === '') {
            continue;
        }
        $photoUrls[] = $url;
        if (!empty($photo['isMain'])) {
            $mainUrl = $url;
        }
    }
    if ($mainUrl === '' && $photoUrls !== []) {
        $mainUrl = $photoUrls[0];
    }

    $brand = (string) ($input['brand'] ?? '');
    $record = [
        'id' => $id,
        'brand' => $brand,
        'brandLabel' => BRAND_LABELS[$brand] ?? $brand,
        'title' => trim((string) ($input['title'] ?? '')),
        'price' => (int) ($input['price'] ?? 0),
        'img' => $mainUrl,
        'photos' => $photoUrls,
        'videos' => is_array($input['videos'] ?? null) ? $input['videos'] : [],
        'specs' => is_array($input['specs'] ?? null) ? $input['specs'] : [],
    ];
    if (!empty($input['badge'])) {
        $record['badge'] = (string) $input['badge'];
    }
    if ($record['title'] === '') {
        json_out(400, ['error' => 'Не заполнено название мотора']);
    }

    $replaced = false;
    foreach ($motors as $i => $motor) {
        if (($motor['id'] ?? '') === $id) {
            $motors[$i] = $record;
            $replaced = true;
            break;
        }
    }
    if (!$replaced) {
        $motors[] = $record;
    }

    if (!save_json_file(MOTORS_FILE, $motors)) {
        json_out(500, ['error' => 'Не удалось записать data/motors.json — проверьте права на запись']);
    }
    json_out(200, ['motors' => $motors, 'saved' => $record]);
}

json_out(400, ['error' => 'Неизвестное действие']);
