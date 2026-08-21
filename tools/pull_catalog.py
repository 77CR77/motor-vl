#!/usr/bin/env python3
"""Забирает каталог с боевого сайта в репозиторий.

Каталог правится через панель /admin прямо на хостинге, и коммитов при этом
не создаётся. Поэтому файл в репозитории со временем отстаёт от того, что
на сайте. Этот скрипт подтягивает свежую версию — чтобы в git был бэкап
и чтобы локальные правки делались поверх настоящих данных, а не устаревших.

    python3 tools/pull_catalog.py

Данные открытые (сайт сам их читает из браузера), пароль не нужен.
"""
import json
import os
import subprocess
import sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SOURCES = [
    ("https://motor-vl.ru/data/motors.json", "data/motors.json"),
    ("https://motor-vl.ru/data/brands.json", "data/brands.json"),
]


def main():
    changed = 0
    for url, rel in SOURCES:
        result = subprocess.run(["curl", "-sSL", "--max-time", "30", url], capture_output=True)
        raw = result.stdout.decode("utf-8", "replace")
        try:
            data = json.loads(raw)
        except ValueError:
            print("не похоже на JSON:", url, raw[:120], file=sys.stderr)
            return 1

        path = os.path.join(ROOT, rel)
        before = open(path, encoding="utf-8").read() if os.path.isfile(path) else ""
        text = json.dumps(data, ensure_ascii=False, indent=2) + "\n"
        if text == before:
            print("без изменений:", rel)
            continue
        open(path, "w", encoding="utf-8").write(text)
        count = len(data) if isinstance(data, list) else "?"
        print("обновлено:", rel, "— записей:", count)
        changed += 1

    if changed:
        print("\nПроверьте изменения (git diff) и закоммитьте — это бэкап каталога.")
        print("Не забудьте про резервную копию в catalog.html: python3 tools/sync_fallback.py")
    return 0


if __name__ == "__main__":
    sys.exit(main())
