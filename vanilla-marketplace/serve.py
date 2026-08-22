#!/usr/bin/env python3
"""Servidor estatico con fallback SPA para la demo vanilla.

Uso:  python3 serve.py [puerto]     (por defecto 3003)

Cualquier ruta sin archivo correspondiente (/vehiculos/..., /marcas/..., etc.)
sirve index.html para que el router del cliente (History API) la resuelva.
"""
import http.server
import os
import sys

ROOT = os.path.dirname(os.path.abspath(__file__))
PORT = int(sys.argv[1]) if len(sys.argv) > 1 else 3003


class SPAHandler(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=ROOT, **kwargs)

    def send_head(self):
        if not os.path.exists(self.translate_path(self.path)):
            self.path = "/index.html"
        return super().send_head()


if __name__ == "__main__":
    print(f"Sirviendo {ROOT} en http://localhost:{PORT}")
    http.server.ThreadingHTTPServer(("127.0.0.1", PORT), SPAHandler).serve_forever()
