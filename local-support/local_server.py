#!/usr/bin/env python3
"""
Local development server for the static website.
Serves the repo on localhost. Refresh the browser yourself after edits.
"""

import http.server
import os
import socketserver
import sys
import webbrowser
from pathlib import Path


class LocalHandler(http.server.SimpleHTTPRequestHandler):
    def do_GET(self):
        if self.path == '/' or self.path == '':
            self.path = '/index.html'
        super().do_GET()


def main():
    port = 8080
    directory = "."

    print("Starting local development server...")
    print(f"Serving directory: {os.path.abspath(directory)}")
    print(f"Server: http://localhost:{port}")
    print("\nAvailable pages:")

    html_files = list(Path(directory).glob("*.html"))
    for html_file in sorted(html_files):
        print(f"   http://localhost:{port}/{html_file.name}")

    print(f"\nMain site: http://localhost:{port}/index.html")
    print("Press Ctrl+C to stop the server\n")

    os.chdir(directory)

    try:
        with socketserver.TCPServer(("", port), LocalHandler) as httpd:
            print("Server started successfully.")
            try:
                webbrowser.open(f"http://localhost:{port}/index.html")
                print("Opening browser...")
            except Exception:
                print("Open your browser manually to view the site.")
            httpd.serve_forever()

    except KeyboardInterrupt:
        print("\n\nServer stopped.")
        sys.exit(0)
    except OSError as e:
        if e.errno in (48, 98, 10048):
            print(f"Error: Port {port} is already in use.")
            print("Stop the other server or use a different port.")
        else:
            print(f"Error starting server: {e}")
        sys.exit(1)
    except Exception as e:
        print(f"Unexpected error: {e}")
        sys.exit(1)


if __name__ == "__main__":
    main()
