import sys
import time
import os
import json
import logging
import requests
from watchdog.observers import Observer
from watchdog.events import FileSystemEventHandler

# Configuration
# =============================================================================
# Load API Key from .env file or use variable
# You can stick your key here directly if you prefer not to use .env
API_KEY = os.getenv("SUPERNOTES_API_KEY", "SgnNXn_Oc8uUMlprQXkDqshgU_py7_XkrDXRwlgEebo")

# Folder to watch (relative to this script)
WATCH_DIR = os.path.join(os.getcwd(), "content")

# File to store the mapping between Local Path <-> Supernotes Card ID
MAP_FILE = "supernotes_map.json"

# Logging setup
logging.basicConfig(level=logging.INFO,
                    format='%(asctime)s - %(message)s',
                    datefmt='%Y-%m-%d %H:%M:%S')

# Supernotes API Client
# =============================================================================
class SupernotesClient:
    BASE_URL = "https://api.supernotes.app/v1"

    def __init__(self, api_key):
        self.api_key = api_key
        self.headers = {
            "Api-Key": self.api_key,
            "Content-Type": "application/json"
        }

    def create_card(self, name, markup, tags=None):
        """Creates a new card using the Simple endpoint."""
        url = f"{self.BASE_URL}/cards/simple"
        payload = {
            "name": name,
            "markup": markup,
            "tags": tags or []
        }
        try:
            response = requests.post(url, json=payload, headers=self.headers)
            response.raise_for_status()
            data = response.json()
            logging.info(f"API Response (Create): {data}")
            
            # Handle list response (some endpoints return [card])
            if isinstance(data, list):
                if data and "id" in data[0]:
                    return data[0]["id"]
                elif data and "data" in data[0] and "id" in data[0]["data"]:
                     return data[0]["data"]["id"]
            
            # Handle dict response
            if isinstance(data, dict):
                 if "id" in data:
                     return data["id"]
                 if "data" in data and "id" in data["data"]:
                     return data["data"]["id"]
            
            logging.error(f"Could not find ID in response: {data}")
            return None

        except requests.exceptions.RequestException as e:
            logging.error(f"Failed to create card: {e}")
            # variable 'response' might not be defined if requests.post failed immediately
            pass
            return None

    def update_card(self, card_id, name, markup, tags=None):
        """Updates an existing card."""
        url = f"{self.BASE_URL}/cards/{card_id}"
        payload = {
            "name": name,
            "markup": markup,
        }
        if tags:
             payload["tags"] = tags

        try:
            response = requests.patch(url, json=payload, headers=self.headers)
            response.raise_for_status()
            return True
        except requests.exceptions.RequestException as e:
            logging.error(f"Failed to update card {card_id}: {e}")
            try:
                if response.status_code == 404:
                    logging.warning("Card not found (404). It might have been deleted.")
                    return "NOT_FOUND"
            except UnboundLocalError:
                pass # response was not assigned
            except AttributeError:
                pass # response might be None if we initialized it so
            return False

# Sync Logic
# =============================================================================
class SyncHandler(FileSystemEventHandler):
    def __init__(self, client, map_file):
        self.client = client
        self.map_file = map_file
        self.sync_map = self.load_map()

    def load_map(self):
        if os.path.exists(self.map_file):
            try:
                with open(self.map_file, 'r') as f:
                    return json.load(f)
            except:
                return {}
        return {}

    def save_map(self):
        with open(self.map_file, 'w') as f:
            json.dump(self.sync_map, f, indent=2)

    def get_card_id(self, file_path):
        return self.sync_map.get(file_path)

    def set_card_id(self, file_path, card_id):
        self.sync_map[file_path] = card_id
        self.save_map()

    def process_file(self, file_path):
        """Reads local file and pushes to Supernotes."""
        # Only process .md files
        if not file_path.endswith(".md"):
            return

        logging.info(f"Processing: {file_path}")

        try:
            with open(file_path, 'r', encoding='utf-8') as f:
                content = f.read()
        except Exception as e:
            logging.error(f"Could not read file {file_path}: {e}")
            return

        # Extract title (filename without extension, or parsed from frontmatter?)
        # For simplicity, let's use the filename as the card title
        filename = os.path.basename(file_path)
        title = os.path.splitext(filename)[0]

        # Extract tags from path (optional, handy feature)
        # e.g. content/aquas-field/reading-notes -> ["aquas-field", "reading-notes"]
        rel_path = os.path.relpath(file_path, WATCH_DIR)
        path_parts = os.path.dirname(rel_path).split(os.sep)
        tags = [p for p in path_parts if p and p != '.']

        card_id = self.get_card_id(file_path)

        if card_id:
            # Update existing
            logging.info(f"Updating existing card: {card_id}")
            result = self.client.update_card(card_id, title, content, tags)
            if result == "NOT_FOUND":
                # Card was deleted on server, recreate it?
                logging.info("Card missing on server. Re-creating.")
                new_id = self.client.create_card(title, content, tags)
                if new_id:
                    self.set_card_id(file_path, new_id)
                    logging.info(f"Re-created as {new_id}")
        else:
            # Create new
            logging.info("Creating new card...")
            new_id = self.client.create_card(title, content, tags)
            if new_id:
                self.set_card_id(file_path, new_id)
                logging.info(f"Created card: {new_id}")

    def on_modified(self, event):
        if not event.is_directory:
            self.process_file(event.src_path)

    def on_created(self, event):
        if not event.is_directory:
            self.process_file(event.src_path)

# Main Loop
# =============================================================================
if __name__ == "__main__":
    if not API_KEY:
        print("Error: SUPERNOTES_API_KEY not found. Set it in .env or edit the script.")
        sys.exit(1)
    
    if not os.path.exists(WATCH_DIR):
        print(f"Error: Watch directory '{WATCH_DIR}' does not exist.")
        sys.exit(1)

    print(f"--- Supernotes Sync Started ---")
    print(f"Watching: {WATCH_DIR}")
    print(f"Press Ctrl+C to stop.")

    client = SupernotesClient(API_KEY)
    event_handler = SyncHandler(client, MAP_FILE)
    observer = Observer()
    observer.schedule(event_handler, WATCH_DIR, recursive=True)
    observer.start()

    try:
        while True:
            time.sleep(1)
    except KeyboardInterrupt:
        observer.stop()
    observer.join()
