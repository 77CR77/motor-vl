<?php
// Общая часть бэкенда: настройки, ответы, чтение и запись файлов с данными.

declare(strict_types=1);

const ROOT_DIR = __DIR__ . '/..';
const DATA_DIR = ROOT_DIR . '/data';
// Заявки клиентов лежат отдельно от каталога: каталог браузер читает открыто,
// а заявки — личные данные, им в публичной папке не место.
const PRIVATE_DIR = ROOT_DIR . '/private';

function config(): array
{
    static $config = null;
    if ($config !== null) {
        return $config;
    }
    $local = __DIR__ . '/config.local.php';
    $config = is_file($local) ? require $local : [];
    if (!is_array($config)) {
        $config = [];
    }
    return $config;
}

function config_value(string $key, string $default = ''): string
{
    $config = config();
    $value = $config[$key] ?? $default;
    return is_string($value) ? trim($value) : (string) $value;
}

function json_out(int $status, array $body): void
{
    http_response_code($status);
    header('Content-Type: application/json; charset=utf-8');
    // Заявки и каталог меняются часто — кешировать ответы нельзя.
    header('Cache-Control: no-store');
    echo json_encode($body, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
    exit;
}

function read_json_body(): array
{
    $raw = file_get_contents('php://input');
    if ($raw === false || $raw === '') {
        return [];
    }
    $data = json_decode($raw, true);
    return is_array($data) ? $data : [];
}

function check_password($password): bool
{
    $expected = config_value('admin_password');
    if ($expected === '' || !is_string($password) || $password === '') {
        return false;
    }
    // hash_equals — сравнение без утечки времени, чтобы пароль нельзя было подобрать по задержке ответа.
    return hash_equals($expected, $password);
}

// Помечаем браузер сотрудника: его заходы на сайт не должны попадать
// в статистику посещений. Метка ставится сама при входе в панель и живёт
// год — специально ничего нажимать не нужно.
function mark_staff(): void
{
    if (headers_sent()) {
        return;
    }
    setcookie('mvl_staff', '1', [
        'expires' => time() + 365 * 24 * 3600,
        'path' => '/',
        'secure' => (($_SERVER['HTTPS'] ?? '') === 'on'),
        'httponly' => true,
        'samesite' => 'Lax',
    ]);
}

function is_staff(): bool
{
    if (($_COOKIE['mvl_staff'] ?? '') === '1') {
        return true;
    }
    // Запасной путь: постоянный адрес офиса можно указать в настройках,
    // тогда метка в браузере не понадобится вовсе.
    $config = config();
    $ignore = $config['ignore_ips'] ?? [];
    if (!is_array($ignore) || !$ignore) {
        return false;
    }
    foreach (['HTTP_X_REAL_IP', 'HTTP_X_FORWARDED_FOR', 'REMOTE_ADDR'] as $key) {
        $value = (string) ($_SERVER[$key] ?? '');
        if ($value === '') {
            continue;
        }
        $ip = trim(explode(',', $value)[0]);
        if (in_array($ip, $ignore, true)) {
            return true;
        }
    }
    return false;
}

function require_admin($password): void
{
    if (!check_password($password)) {
        json_out(401, ['error' => 'Неверный пароль']);
    }
    mark_staff();
}

function load_json_file(string $path, array $fallback = []): array
{
    if (!is_file($path)) {
        return $fallback;
    }
    $raw = file_get_contents($path);
    if ($raw === false) {
        return $fallback;
    }
    $data = json_decode($raw, true);
    return is_array($data) ? $data : $fallback;
}

// Запись через временный файл: если хостинг оборвёт скрипт на середине,
// каталог не останется обрезанным наполовину.
function save_json_file(string $path, array $data): bool
{
    $dir = dirname($path);
    if (!is_dir($dir) && !mkdir($dir, 0755, true) && !is_dir($dir)) {
        return false;
    }
    $json = json_encode($data, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
    if ($json === false) {
        return false;
    }
    $tmp = $path . '.tmp';
    if (file_put_contents($tmp, $json . "\n", LOCK_EX) === false) {
        return false;
    }
    return rename($tmp, $path);
}
