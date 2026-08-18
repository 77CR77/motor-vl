#!/usr/bin/env python3
"""Локальный сервер для просмотра сайта.

Отличается от `python -m http.server` поддержкой Range-запросов: без них браузер
не умеет перематывать видео и тянет весь файл целиком (а ролики тут до 50 МБ).

    python3 tools/serve.py [порт]
"""
import os
import sys
from functools import partial
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))


class RangeHandler(SimpleHTTPRequestHandler):
    def send_head(self):
        rng = self.headers.get("Range")
        if not rng:
            return super().send_head()

        path = self.translate_path(self.path)
        if os.path.isdir(path) or not os.path.isfile(path):
            return super().send_head()

        try:
            units, _, spec = rng.partition("=")
            start_s, _, end_s = spec.partition("-")
            if units.strip() != "bytes":
                return super().send_head()
            size = os.path.getsize(path)
            start = int(start_s) if start_s else 0
            end = int(end_s) if end_s else size - 1
            end = min(end, size - 1)
            if start > end:
                raise ValueError
        except ValueError:
            self.send_error(416, "Requested Range Not Satisfiable")
            return None

        f = open(path, "rb")
        f.seek(start)
        self.send_response(206)
        self.send_header("Content-Type", self.guess_type(path))
        self.send_header("Content-Length", str(end - start + 1))
        self.send_header("Content-Range", "bytes %d-%d/%d" % (start, end, size))
        self.end_headers()
        # Отдаём только запрошенный кусок — дальше copyfile прочитал бы файл до конца.
        self.wfile.write(f.read(end - start + 1))
        f.close()
        return None

    def end_headers(self):
        self.send_header("Accept-Ranges", "bytes")
        self.send_header("Cache-Control", "no-store")
        super().end_headers()

    def log_message(self, fmt, *args):
        sys.stderr.write("%s - %s\n" % (self.address_string(), fmt % args))


if __name__ == "__main__":
    port = int(sys.argv[1]) if len(sys.argv) > 1 else 8900
    handler = partial(RangeHandler, directory=ROOT)
    print("Сайт: http://localhost:%d/index.html  (Ctrl+C — остановить)" % port)
    ThreadingHTTPServer(("127.0.0.1", port), handler).serve_forever()
