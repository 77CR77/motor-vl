#!/usr/bin/env python3
"""Приводит характеристики моторов к единому шаблону из 11 пунктов.

Всё, что в шаблон не входит, не удаляется, а переносится в data/specs-extra.json —
оттуда его можно вернуть скриптом tools/restore_specs.py.

Запчасти (brand == "parts") не трогаем: у них свои характеристики, шаблон мотора
к транцевому узлу или винту неприменим.
"""
import json
import os
import re
import sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
TEMPLATE = [
    "Год",
    "Состояние",
    "Тактность",
    "Длина ноги",
    "Подъем",
    "Компрессия",
    "Наработка",
    "Управление",
    "Комплект",
    "Возможность увеличения мощности",
]
# Откуда брать значение для пункта шаблона: старые названия того же параметра.
SOURCES = {
    "Год": ["Год"],
    "Состояние": ["Состояние"],
    "Тактность": ["Тактность"],
    "Длина ноги": ["Длина ноги", "Нога"],
    "Подъем": ["Система подъема мотора", "Подъем"],
    "Компрессия": ["Компрессия"],
    "Наработка": ["Наработка"],
    "Управление": ["Управление"],
    "Комплект": ["Комплект", "Комплектация", "В комплекте"],
    "Возможность увеличения мощности": ["Возможность увеличения мощности"],
}


def norm_leg(v):
    v = v.strip()
    v = re.sub(r"(\d)мм", r"\1 мм", v)
    if v in ("S", "L", "X"):
        return {"S": "S (381 мм)", "L": "L (508 мм)", "X": "X (635 мм)"}[v]
    return v


def norm_stroke(v):
    return "4-тактный" if re.search(r"4", v) else v.strip()


def norm_lift(v):
    v = v.strip().lower()
    if v.startswith("гидравл"):
        return "гидравлический"
    m = re.match(r"ручная\s*(\(.*\))?", v)
    if m:
        return ("ручной " + m.group(1)).strip() if m.group(1) else "ручной"
    return v


def norm_control(v):
    v = v.strip().lower()
    if v.startswith("дистанц"):
        return "дистанционное"
    if v.startswith("румпел"):
        return "румпельное"
    if v.startswith("ручн"):
        return "ручное"
    return v


def norm_condition(v, motor):
    """новый / б/у — иначе исходный текст уйдёт в extra, а значение возьмём из названия."""
    low = v.strip().lower()
    if "нов" in low:
        return "новый", None
    if low in ("б/у", "бу", "б.у."):
        return "б/у", None
    return None, v.strip()


def condition_from_title(motor):
    hay = (motor.get("title", "") + " " + (motor.get("badge") or "")).lower()
    return "новый" if "нов" in hay else "б/у"


NORMALIZERS = {
    "Длина ноги": norm_leg,
    "Тактность": norm_stroke,
    "Подъем": norm_lift,
    "Управление": norm_control,
}


def main():
    path = os.path.join(ROOT, "data", "motors.json")
    motors = json.load(open(path, encoding="utf-8"))
    extra = {}
    report = {"motors": 0, "parts": 0, "filled": 0, "empty": 0, "moved": 0, "guessed_condition": 0}

    for motor in motors:
        if motor.get("brand") == "parts":
            report["parts"] += 1
            continue
        report["motors"] += 1
        old = list(motor.get("specs") or [])
        # Собираем все значения по старым названиям; порядок исходного списка сохраняем,
        # чтобы при восстановлении характеристики встали как были.
        pool = {}
        for key, value in old:
            pool.setdefault(key, []).append(value)

        used = set()
        leftovers = []
        new_specs = []
        for field in TEMPLATE:
            value = ""
            for src in SOURCES[field]:
                if pool.get(src):
                    value = pool[src][0]
                    used.add((src, value))
                    break
            if value:
                if field == "Состояние":
                    norm, rest = norm_condition(value, motor)
                    if norm is None:
                        leftovers.append(["Состояние", rest])
                        value = condition_from_title(motor)
                        report["guessed_condition"] += 1
                    else:
                        value = norm
                elif field in NORMALIZERS:
                    value = NORMALIZERS[field](value)
            elif field == "Состояние":
                value = condition_from_title(motor)
                report["guessed_condition"] += 1
            new_specs.append([field, value])
            report["filled" if value else "empty"] += 1

        for key, value in old:
            if (key, value) not in used:
                leftovers.append([key, value])
        # Убираем возможные дубли, сохраняя порядок.
        seen = set()
        leftovers = [x for x in leftovers if not (tuple(x) in seen or seen.add(tuple(x)))]

        motor["specs"] = new_specs
        if leftovers:
            extra[motor["title"]] = leftovers
            report["moved"] += len(leftovers)

    json.dump(motors, open(path, "w", encoding="utf-8"), ensure_ascii=False, indent=2)
    open(path, "a", encoding="utf-8").write("\n")

    extra_path = os.path.join(ROOT, "data", "specs-extra.json")
    payload = {
        "_comment": (
            "Характеристики, не входящие в шаблон из 11 пунктов. Убраны из карточек, "
            "но не потеряны: tools/restore_specs.py вернёт их обратно. Ключ — название мотора."
        ),
        "items": extra,
    }
    json.dump(payload, open(extra_path, "w", encoding="utf-8"), ensure_ascii=False, indent=2)
    open(extra_path, "a", encoding="utf-8").write("\n")

    print("моторов обработано:", report["motors"], "| запчасти без изменений:", report["parts"])
    print("заполнено полей:", report["filled"], "| пустых:", report["empty"])
    print("вынесено в specs-extra.json:", report["moved"], "значений у", len(extra), "позиций")
    print("состояние определено по названию:", report["guessed_condition"])


if __name__ == "__main__":
    sys.exit(main())
