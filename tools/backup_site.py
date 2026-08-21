#!/usr/bin/env python3
"""Снимает локальную копию публичной части сайта motor-vl.ru.

Это страховка перед заменой сайта: сохраняет все страницы, стили, скрипты
и картинки шаблона так, как их видит посетитель.

    python3 tools/backup_site.py ~/motor-vl-backup

Чего копия НЕ содержит (и не может):
  * серверный код и настройки CMS — их отдают только по FTP;
  * базу данных — выгружается из панели хостинга;
  * видео и полные фото моторов — это гигабайты, и они уже лежат
    в ~/Desktop/motor-vl-photos.
"""
import os
import re
import subprocess
import sys
import time
from urllib.parse import urljoin, urlparse

HOST = "www.motor-vl.ru"
BASE = "https://" + HOST + "/"
# Медиа моторов пропускаем: это гигабайты, уже скачанные отдельно.
SKIP = re.compile(r"^/media/\d+/(?:video|images)/", re.I)
ASSET_RE = re.compile(r'(?:href|src)="([^"#]+)"', re.I)
MAX_PAGES = 600


def fetch(url):
    result = subprocess.run(
        ["curl", "-sSL", "--max-time", "30", "-A", "Mozilla/5.0", "--write-out", "%{http_code}", url],
        capture_output=True,
    )
    body = result.stdout
    if len(body) < 3:
        return None, 0
    code = body[-3:].decode("ascii", "ignore")
    try:
        code = int(code)
    except ValueError:
        return None, 0
    return body[:-3], code


def local_path(root, url):
    path = urlparse(url).path
    if path.endswith("/") or path == "":
        path += "index.html"
    # Страницы вида /category/item?id=38 сохраняем под понятным именем.
    query = urlparse(url).query
    if query:
        path = path.rstrip("/") + "__" + re.sub(r"[^A-Za-z0-9=_-]", "_", query) + ".html"
    return os.path.join(root, path.lstrip("/"))


def save(path, data):
    os.makedirs(os.path.dirname(path), exist_ok=True)
    with open(path, "wb") as f:
        f.write(data)


def main():
    root = os.path.expanduser(sys.argv[1] if len(sys.argv) > 1 else "~/motor-vl-backup")
    os.makedirs(root, exist_ok=True)

    queue = [BASE]
    seen = set()
    pages = assets = failed = 0
    total_bytes = 0

    while queue and pages < MAX_PAGES:
        url = queue.pop(0)
        if url in seen:
            continue
        seen.add(url)

        body, code = fetch(url)
        if body is None or code != 200:
            failed += 1
            print("  не скачалось (%s): %s" % (code, url), flush=True)
            continue

        path = local_path(root, url)
        save(path, body)
        total_bytes += len(body)
        is_html = path.endswith((".html", ".htm"))
        if is_html:
            pages += 1
            print("страница %d: %s" % (pages, url), flush=True)
        else:
            assets += 1

        if not is_html:
            continue

        text = body.decode("utf-8", "replace")
        for raw in ASSET_RE.findall(text):
            if raw.startswith(("mailto:", "tel:", "javascript:", "#", "data:")):
                continue
            absolute = urljoin(url, raw)
            parsed = urlparse(absolute)
            if parsed.netloc not in (HOST, "motor-vl.ru"):
                continue
            if SKIP.match(parsed.path):
                continue
            normalized = parsed._replace(netloc=HOST, scheme="https", fragment="").geturl()
            if normalized not in seen:
                queue.append(normalized)
        time.sleep(0.15)

    print("\nГотово. Страниц: %d, файлов: %d, не скачалось: %d, объём: %.1f МБ"
          % (pages, assets, failed, total_bytes / 1e6))
    print("Копия лежит в:", root)


if __name__ == "__main__":
    sys.exit(main())
