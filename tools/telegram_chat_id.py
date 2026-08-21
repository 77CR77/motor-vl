#!/usr/bin/env python3
"""Показывает id чатов, в которые добавлен бот, — его нужно вписать в TELEGRAM_CHAT_ID.

Токен скрипт берёт из переменной окружения, чтобы он не попал ни в историю команд,
ни в репозиторий:

    export TELEGRAM_BOT_TOKEN='токен от @BotFather'
    python3 tools/telegram_chat_id.py

Перед запуском напишите в группе любое сообщение — Telegram отдаёт только те чаты,
где недавно была активность.
"""
import json
import os
import subprocess
import sys


def main():
    token = os.environ.get("TELEGRAM_BOT_TOKEN", "").strip()
    if not token:
        print("Не задан TELEGRAM_BOT_TOKEN.\n"
              "Выполните:  export TELEGRAM_BOT_TOKEN='токен от @BotFather'", file=sys.stderr)
        return 1

    url = "https://api.telegram.org/bot%s/getUpdates" % token
    raw = subprocess.run(["curl", "-s", "--max-time", "20", url],
                         capture_output=True, text=True).stdout
    try:
        data = json.loads(raw)
    except ValueError:
        print("Телеграм ответил не тем, чего мы ждали:", raw[:200], file=sys.stderr)
        return 1

    if not data.get("ok"):
        print("Ошибка от Telegram:", data.get("description"), file=sys.stderr)
        return 1

    chats = {}
    for update in data.get("result", []):
        message = update.get("message") or update.get("channel_post") or {}
        chat = message.get("chat")
        if chat:
            chats[chat["id"]] = chat

    if not chats:
        print("Чатов не видно. Добавьте бота в группу, напишите там любое сообщение\n"
              "и запустите скрипт снова.")
        return 0

    print("Найденные чаты:\n")
    for chat_id, chat in chats.items():
        title = chat.get("title") or chat.get("username") or chat.get("first_name") or "—"
        print("  %-16s %s (%s)" % (chat_id, title, chat.get("type")))
    print("\nНужный id (у групп он отрицательный) впишите в переменную TELEGRAM_CHAT_ID "
          "в настройках Netlify.")
    return 0


if __name__ == "__main__":
    sys.exit(main())
