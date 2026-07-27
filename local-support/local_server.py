#!/usr/bin/env python3
"""
Local development server for static website
Serves the current directory on localhost for testing before deployment
Features:
- Auto-refresh when HTML files are modified
- Force refresh (Ctrl+Shift+F5 equivalent)
"""

import http.server
import socketserver
import webbrowser
import os
import sys
import threading
import time
from pathlib import Path

# Try to import watchdog, fall back gracefully if not available
try:
    from watchdog.observers import Observer
    from watchdog.events import FileSystemEventHandler
    WATCHDOG_AVAILABLE = True
except ImportError:
    WATCHDOG_AVAILABLE = False
    print("⚠️  Warning: watchdog not installed. File change detection disabled.")
    print("   Install with: pip install watchdog")

class AutoRefreshHandler(http.server.SimpleHTTPRequestHandler):
    """Custom handler that injects auto-refresh JavaScript into HTML responses"""
    
    def do_GET(self):
        # Handle root path
        if self.path == '/' or self.path == '':
            self.path = '/index.html'
        
        # Check if this is an HTML file
        is_html = self.path.endswith('.html')
        
        if is_html:
            # Set headers to prevent caching
            self.send_response(200)
            self.send_header('Content-Type', 'text/html; charset=utf-8')
            self.send_header('Cache-Control', 'no-cache, no-store, must-revalidate')
            self.send_header('Pragma', 'no-cache')
            self.send_header('Expires', '0')
            self.end_headers()
            
            # Read the HTML file
            try:
                file_path = os.path.join(os.getcwd(), self.path[1:])  # Remove leading slash
                with open(file_path, 'r', encoding='utf-8') as f:
                    content = f.read()
                
                # Inject auto-refresh JavaScript before closing </body> tag
                refresh_script = '''
<script>
// Auto-refresh functionality (file change detection only)
(function() {
    let lastModified = '';
    
    // Function to perform a hard refresh (equivalent to Ctrl+Shift+F5)
    function hardRefresh() {
        // Clear all caches and reload
        if ('caches' in window) {
            caches.keys().then(function(names) {
                names.forEach(function(name) {
                    caches.delete(name);
                });
            });
        }
        
        // Force reload from server
        window.location.reload(true);
    }
    
    // Function to check for file changes
    function checkForChanges() {
        fetch(window.location.href, {method: 'HEAD'})
            .then(response => {
                const lastModifiedHeader = response.headers.get('Last-Modified');
                if (lastModifiedHeader && lastModifiedHeader !== lastModified) {
                    if (lastModified !== '') {
                        console.log('🔄 File changed, refreshing...');
                        hardRefresh();
                    }
                    lastModified = lastModifiedHeader;
                }
            })
            .catch(error => {
                console.log('Error checking for changes:', error);
            });
    }
    
    // Start file change monitoring
    function startFileMonitoring() {
        // Check for changes every 2 seconds
        setInterval(checkForChanges, 2000);
    }
    
    // Initialize auto-refresh features
    function initAutoRefresh() {
        console.log('🚀 Auto-refresh enabled:');
        console.log('   • File change detection only');
        console.log('   • Hard refresh (Ctrl+Shift+F5 equivalent)');
        
        startFileMonitoring();
        
        // Show refresh indicator
        const indicator = document.createElement('div');
        indicator.innerHTML = '🔄 File watching active';
        indicator.style.cssText = `
            position: fixed;
            top: 10px;
            right: 10px;
            background: #4CAF50;
            color: white;
            padding: 5px 10px;
            border-radius: 5px;
            font-size: 12px;
            z-index: 10000;
            font-family: monospace;
        `;
        document.body.appendChild(indicator);
        
        // Hide indicator after 3 seconds
        setTimeout(() => {
            indicator.style.opacity = '0.7';
        }, 3000);
    }
    
    // Start when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initAutoRefresh);
    } else {
        initAutoRefresh();
    }
})();
</script>
'''
                
                # Inject script before </body> tag
                if '</body>' in content:
                    content = content.replace('</body>', refresh_script + '</body>')
                else:
                    # If no body tag, append at the end
                    content += refresh_script
                
                # Send the modified content
                self.wfile.write(content.encode('utf-8'))
                
            except FileNotFoundError:
                self.send_error(404, "File not found")
            except Exception as e:
                self.send_error(500, f"Error reading file: {e}")
        else:
            # For non-HTML files, use the default handler
            super().do_GET()

if WATCHDOG_AVAILABLE:
    class FileChangeHandler(FileSystemEventHandler):
        """Handler for file system events"""
        
        def __init__(self, server_instance):
            self.server = server_instance
            self.last_modified = {}
        
        def on_modified(self, event):
            if not event.is_directory and event.src_path.endswith('.html'):
                print(f"📝 HTML file modified: {os.path.basename(event.src_path)}")
                # The JavaScript will handle the actual refresh
else:
    # Dummy class when watchdog is not available
    class FileChangeHandler:
        def __init__(self, server_instance):
            pass

def main():
    # Configuration
    PORT = 8080
    DIRECTORY = "."
    
    print("🚀 Starting local development server with auto-refresh...")
    print(f"📁 Serving directory: {os.path.abspath(DIRECTORY)}")
    print(f"🌐 Server will run on: http://localhost:{PORT}")
    print("\n🔄 Auto-refresh features:")
    print("   • File change detection (refreshes when HTML files are modified)")
    print("   • Hard refresh (Ctrl+Shift+F5 equivalent)")
    print("\n📄 Available pages:")
    
    # List HTML files in the directory
    html_files = list(Path(DIRECTORY).glob("*.html"))
    for html_file in sorted(html_files):
        print(f"   • http://localhost:{PORT}/{html_file.name}")
    
    print(f"\n🏠 Main site: http://localhost:{PORT}/index.html")
    print("\n⚡ Press Ctrl+C to stop the server\n")
    
    # Change to the directory we want to serve
    os.chdir(DIRECTORY)
    
    # Create the server with our custom handler
    Handler = AutoRefreshHandler
    
    try:
        with socketserver.TCPServer(("", PORT), Handler) as httpd:
            print(f"✅ Server started successfully!")
            
            # Set up file watching (if watchdog is available)
            observer = None
            if WATCHDOG_AVAILABLE:
                event_handler = FileChangeHandler(httpd)
                observer = Observer()
                observer.schedule(event_handler, DIRECTORY, recursive=False)
                observer.start()
                print("👀 File watching enabled for HTML changes")
            else:
                print("👀 File watching disabled (watchdog not available)")
            
            # Optionally open the browser automatically
            try:
                webbrowser.open(f"http://localhost:{PORT}/index.html")
                print("🌐 Opening browser automatically...")
            except:
                print("💡 Open your browser manually to view the site")
            
            # Start serving
            httpd.serve_forever()
            
    except KeyboardInterrupt:
        print("\n\n🛑 Server stopped by user")
        if observer:
            try:
                observer.stop()
                observer.join()
            except:
                pass
        sys.exit(0)
    except OSError as e:
        if e.errno == 48:  # Address already in use
            print(f"❌ Error: Port {PORT} is already in use!")
            print(f"💡 Try a different port or stop the other server first")
        else:
            print(f"❌ Error starting server: {e}")
        sys.exit(1)
    except Exception as e:
        print(f"❌ Unexpected error: {e}")
        sys.exit(1)

if __name__ == "__main__":
    main() 