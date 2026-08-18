#!/usr/bin/env python3
"""Делает обложки для видео технического состояния.

Кадр берётся штатным macOS-ным qlmanage (ffmpeg в системе нет) и пережимается
в JPEG — обложка весит десятки килобайт, поэтому, в отличие от самих роликов,
она попадает в git и живёт на опубликованном сайте.

    media/38/video/DSVC8zj1.mp4  ->  media/38/video/poster/DSVC8zj1.jpg

Длительность берётся из метаданных Spotlight (mdls) и пишется в
data/video-meta.json — из него каталог подставляет время на плитку.
"""
import json
import os
import re
import shutil
import subprocess
import sys
import tempfile

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))


def duration(path):
    out = subprocess.run(["mdls", "-name", "kMDItemDurationSeconds", "-raw", path],
                         capture_output=True, text=True).stdout.strip()
    try:
        return round(float(out))
    except ValueError:
        return None


def poster(src, dst, tmpdir):
    subprocess.run(["qlmanage", "-t", "-s", "640", "-o", tmpdir, src],
                   capture_output=True)
    made = os.path.join(tmpdir, os.path.basename(src) + ".png")
    if not os.path.exists(made):
        return False
    subprocess.run(["sips", "-s", "format", "jpeg", "-s", "formatOptions", "72",
                    made, "--out", dst], capture_output=True, check=True)
    os.remove(made)
    return True


def main():
    motors = json.load(open(os.path.join(ROOT, "data", "motors.json"), encoding="utf-8"))
    meta_path = os.path.join(ROOT, "data", "video-meta.json")
    meta = {}
    if os.path.exists(meta_path):
        meta = json.load(open(meta_path, encoding="utf-8")).get("items", {})

    urls = []
    for motor in motors:
        for video in motor.get("videos") or []:
            url = video.get("url") if isinstance(video, dict) else ""
            if url and url.startswith("/media/"):
                urls.append(url)

    made = skipped = failed = 0
    tmpdir = tempfile.mkdtemp()
    try:
        for url in urls:
            src = os.path.join(ROOT, url.lstrip("/"))
            rel_poster = re.sub(r"([^/]+)\.mp4$", r"poster/\1.jpg", url.lstrip("/"), flags=re.I)
            dst = os.path.join(ROOT, rel_poster)
            os.makedirs(os.path.dirname(dst), exist_ok=True)
            if not os.path.exists(src):
                failed += 1
                continue
            if os.path.exists(dst):
                skipped += 1
            elif poster(src, dst, tmpdir):
                made += 1
            else:
                failed += 1
                continue
            entry = meta.setdefault(url, {})
            entry["poster"] = "/" + rel_poster
            if entry.get("duration") is None:
                entry["duration"] = duration(src)
            print(made + skipped, "/", len(urls), rel_poster, flush=True)
    finally:
        shutil.rmtree(tmpdir, ignore_errors=True)

    payload = {
        "_comment": "Обложки и длительность видео. Обложки лежат в media/<id>/video/poster/ "
                    "и в git идут (сами ролики — нет). Пересоздать: python3 tools/make_posters.py",
        "items": meta,
    }
    json.dump(payload, open(meta_path, "w", encoding="utf-8"), ensure_ascii=False, indent=2)
    open(meta_path, "a", encoding="utf-8").write("\n")
    print("готово: сделано %d, уже было %d, не получилось %d" % (made, skipped, failed))


if __name__ == "__main__":
    sys.exit(main())
