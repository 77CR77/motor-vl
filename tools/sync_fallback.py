#!/usr/bin/env python3
"""Обновляет резервную копию каталога, вшитую в catalog.html.

Она используется, только если страницу открыли двойным кликом, без сервера,
и fetch(data/*.json) не работает. После правки data/*.json запускать здесь.
"""
import json
import os
import re

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

motors = json.load(open(os.path.join(ROOT, "data", "motors.json"), encoding="utf-8"))
brands = json.load(open(os.path.join(ROOT, "data", "brands.json"), encoding="utf-8"))
page = os.path.join(ROOT, "catalog.html")
html = open(page, encoding="utf-8").read()

for name, data in (("__MOTORS_FALLBACK__", motors), ("__BRANDS_FALLBACK__", brands)):
    line = "  window.%s = %s;" % (name, json.dumps(data, ensure_ascii=False))
    html, n = re.subn(r"^  window\.%s = .*$" % name, lambda m: line, html, count=1, flags=re.M)
    if not n:
        raise SystemExit("не найдена строка с " + name)

open(page, "w", encoding="utf-8").write(html)
print("резервная копия в catalog.html обновлена")
