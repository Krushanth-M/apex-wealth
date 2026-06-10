import http.server
import socketserver
import webbrowser
import threading
import sys
import os

PORT = 8000

class Handler(http.server.SimpleHTTPRequestHandler):
    def log_message(self, format, *args):
        # Keep the console output clean
        pass

def open_browser():
    try:
        webbrowser.open(f"http://localhost:{PORT}")
    except Exception as e:
        print(f"Could not open browser automatically: {e}")

def main():
    # Make sure we serve from the directory containing this script
    os.chdir(os.path.dirname(os.path.abspath(__file__)))
    
    socketserver.TCPServer.allow_reuse_address = True
    
    try:
        with socketserver.TCPServer(("", PORT), http.server.SimpleHTTPRequestHandler) as httpd:
            print("==================================================")
            print("      PERSONAL FINANCE MASTER TOOLKIT SERVER       ")
            print("==================================================")
            print(f" Server running at: http://localhost:{PORT}")
            print(" Close this window or press Ctrl+C to stop.")
            print("==================================================")
            
            # Start a thread to open the browser
            threading.Thread(target=open_browser, daemon=True).start()
            
            httpd.serve_forever()
    except KeyboardInterrupt:
        print("\nStopping server... Goodbye!")
        sys.exit(0)
    except Exception as e:
        print(f"Error: {e}")
        sys.exit(1)

if __name__ == "__main__":
    main()
