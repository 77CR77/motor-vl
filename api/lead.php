<?php
// Заявки с формы «Оставить заявку».
//
// Публично доступно только одно действие — отправка заявки. Она уходит
// менеджерам в Telegram и параллельно ложится в private/leads.json,
// чтобы был архив, если сообщение в чате потеряется.
//
// Остальные действия (список, отметка о просмотре, удаление) требуют пароль
// администратора и используются панелью /admin.

declare(strict_types=1);

require __DIR__ . '/lib.php';

const LEADS_FILE = PRIVATE_DIR . '/leads.json';

function telegram_text(array $lead): string
{
    $esc = static fn($value): string => htmlspecialchars((string) $value, ENT_NOQUOTES, 'UTF-8');

    $lines = ['🛥 <b>Новая заявка с сайта</b>', ''];
    $lines[] = '👤 <b>' . $esc($lead['name']) . '</b>';
    // Телефон отдельной строкой без разметки: в мобильном Telegram он сам
    // становится ссылкой, по которой можно позвонить одним касанием.
    $lines[] = '📞 ' . $esc($lead['phone']);
    if (!empty($lead['messengers'])) {
        $lines[] = '💬 ' . $esc(implode(', ', $lead['messengers']));
    }

    if (!empty($lead['spec'])) {
        $lines[] = '';
        $lines[] = '<b>Что ищет:</b>';
        foreach ($lead['spec'] as $key => $value) {
            $shown = is_array($value) ? implode(', ', $value) : $value;
            $lines[] = '• ' . $esc($key) . ': ' . $esc($shown);
        }
    }

    if ($lead['message'] !== '') {
        $lines[] = '';
        $lines[] = '<b>Комментарий:</b>';
        $lines[] = $esc($lead['message']);
    }

    $time = new DateTimeImmutable($lead['createdAt']);
    $lines[] = '';
    $lines[] = '🕒 ' . $time->setTimezone(new DateTimeZone('Asia/Vladivostok'))->format('d.m.Y, H:i') . ' (Владивосток)';

    return implode("\n", $lines);
}

// Возвращает true, если сообщение ушло. Ошибки не выбрасывает: заявка важнее
// уведомления, и клиент не должен видеть сбой из-за недоступного Telegram.
function notify_telegram(array $lead): bool
{
    $token = config_value('telegram_token');
    $chatId = config_value('telegram_chat_id');
    if ($token === '' || $chatId === '') {
        return false;
    }

    $payload = json_encode([
        'chat_id' => $chatId,
        'text' => telegram_text($lead),
        'parse_mode' => 'HTML',
        'disable_web_page_preview' => true,
    ], JSON_UNESCAPED_UNICODE);

    $url = 'https://api.telegram.org/bot' . $token . '/sendMessage';

    if (function_exists('curl_init')) {
        $ch = curl_init($url);
        curl_setopt_array($ch, [
            CURLOPT_POST => true,
            CURLOPT_POSTFIELDS => $payload,
            CURLOPT_HTTPHEADER => ['Content-Type: application/json'],
            CURLOPT_RETURNTRANSFER => true,
            CURLOPT_TIMEOUT => 10,
        ]);
        $response = curl_exec($ch);
        $code = (int) curl_getinfo($ch, CURLINFO_HTTP_CODE);
        $error = curl_error($ch);
        curl_close($ch);
        if ($code !== 200) {
            error_log('Telegram: код ' . $code . ' ' . $error . ' ' . (string) $response);
            return false;
        }
        return true;
    }

    // Хостинг без curl — пробуем обычным потоком.
    $context = stream_context_create(['http' => [
        'method' => 'POST',
        'header' => "Content-Type: application/json\r\n",
        'content' => $payload,
        'timeout' => 10,
        'ignore_errors' => true,
    ]]);
    $response = file_get_contents($url, false, $context);
    if ($response === false) {
        error_log('Telegram: запрос не удался');
        return false;
    }
    return true;
}

$method = $_SERVER['REQUEST_METHOD'] ?? 'GET';

if ($method === 'POST') {
    $payload = read_json_body();
    $action = (string) ($payload['action'] ?? '');

    if ($action === 'submit') {
        $name = trim((string) ($payload['name'] ?? ''));
        $phone = trim((string) ($payload['phone'] ?? ''));
        if ($name === '' || $phone === '') {
            json_out(400, ['error' => 'Не заполнены обязательные поля']);
        }

        $spec = $payload['spec'] ?? [];
        $lead = [
            'id' => 'l' . time() . random_int(100, 999),
            'name' => mb_substr($name, 0, 200),
            'phone' => mb_substr($phone, 0, 50),
            'messengers' => array_values(array_filter(
                is_array($payload['messengers'] ?? null) ? $payload['messengers'] : [],
                'is_string'
            )),
            'motor' => mb_substr(trim((string) ($payload['motor'] ?? '')), 0, 500),
            'spec' => is_array($spec) ? $spec : [],
            'message' => mb_substr(trim((string) ($payload['message'] ?? '')), 0, 2000),
            'createdAt' => gmdate('c'),
            'viewed' => false,
        ];

        $leads = load_json_file(LEADS_FILE);
        array_unshift($leads, $lead);
        // Сохраняем первым делом: уведомление вторично.
        $saved = save_json_file(LEADS_FILE, $leads);
        $sent = notify_telegram($lead);

        if (!$saved && !$sent) {
            json_out(500, ['error' => 'Не удалось принять заявку']);
        }
        json_out(200, ['ok' => true]);
    }

    require_admin($payload['password'] ?? null);
    $leads = load_json_file(LEADS_FILE);

    if ($action === 'markViewed') {
        $id = (string) ($payload['id'] ?? '');
        $found = false;
        foreach ($leads as &$lead) {
            if (($lead['id'] ?? '') === $id) {
                $lead['viewed'] = !empty($payload['viewed']);
                $found = true;
                break;
            }
        }
        unset($lead);
        if (!$found) {
            json_out(404, ['error' => 'Заявка не найдена']);
        }
        save_json_file(LEADS_FILE, $leads);
        json_out(200, ['leads' => $leads]);
    }

    if ($action === 'delete') {
        $id = (string) ($payload['id'] ?? '');
        $before = count($leads);
        $leads = array_values(array_filter($leads, static fn($l): bool => ($l['id'] ?? '') !== $id));
        if (count($leads) === $before) {
            json_out(404, ['error' => 'Заявка не найдена']);
        }
        save_json_file(LEADS_FILE, $leads);
        json_out(200, ['leads' => $leads]);
    }

    json_out(400, ['error' => 'Неизвестное действие']);
}

if ($method === 'GET') {
    require_admin($_SERVER['HTTP_X_ADMIN_PASSWORD'] ?? null);
    json_out(200, ['leads' => load_json_file(LEADS_FILE)]);
}

json_out(405, ['error' => 'Метод не поддерживается']);
