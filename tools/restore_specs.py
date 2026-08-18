#!/usr/bin/env python3
"""Возвращает в карточки характеристики, вынесенные в data/specs-extra.json.

    python3 tools/restore_specs.py                 # вернуть всё
    python3 tools/restore_specs.py "Кол-во цилиндров" "Два стартера"
                                                   # вернуть только эти параметры

Возвращённые значения дописываются после 11 пунктов шаблона и удаляются из
specs-extra.json, чтобы файл всегда показывал, что именно сейчас спрятано.
"""
import json
import os
import sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))


def main(argv):
    only = set(argv[1:])
    motors_path = os.path.join(ROOT, "data", "motors.json")
    extra_path = os.path.join(ROOT, "data", "specs-extra.json")

    motors = json.load(open(motors_path, encoding="utf-8"))
    payload = json.load(open(extra_path, encoding="utf-8"))
    items = payload.get("items", {})

    by_title = {m["title"]: m for m in motors}
    restored = 0
    left = {}
    for title, pairs in items.items():
        motor = by_title.get(title)
        keep = []
        for key, value in pairs:
            if motor is None or (only and key not in only):
                keep.append([key, value])
                continue
            existing = {k for k, _ in motor.get("specs") or []}
            if key not in existing:
                motor.setdefault("specs", []).append([key, value])
            restored += 1
        if keep:
            left[title] = keep

    payload["items"] = left
    json.dump(motors, open(motors_path, "w", encoding="utf-8"), ensure_ascii=False, indent=2)
    open(motors_path, "a", encoding="utf-8").write("\n")
    json.dump(payload, open(extra_path, "w", encoding="utf-8"), ensure_ascii=False, indent=2)
    open(extra_path, "a", encoding="utf-8").write("\n")

    print("возвращено значений:", restored, "| осталось спрятано у позиций:", len(left))
    print("не забудь обновить резервную копию в catalog.html: python3 tools/sync_fallback.py")


if __name__ == "__main__":
    sys.exit(main(sys.argv))
