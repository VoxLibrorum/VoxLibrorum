import os
import shutil
import datetime
import re
import sys

# Configuration
INBOX_DIR = "scans_inbox"
ARTIFACT_IMG_DIR = "public/img/artifacts"
DB_FILE = "public/js/db.js"

def clear_screen():
    os.system('cls' if os.name == 'nt' else 'clear')

def print_header():
    print("\033[93m" + "="*60)
    print(" VOX LIBRORUM | ARTIFACT INGESTION TERMINAL")
    print("="*60 + "\033[0m")

def get_files_in_inbox():
    if not os.path.exists(INBOX_DIR):
        os.makedirs(INBOX_DIR)
    
    files = [f for f in os.listdir(INBOX_DIR) if f.lower().endswith(('.jpg', '.jpeg', '.png', '.webp'))]
    return files

def prompt_metadata(filename):
    print(f"\nProcessing File: \033[96m{filename}\033[0m")
    
    # Auto-generate basic ID attempt from filename or random
    suggested_id = filename.split('.')[0].upper()
    
    id_val = input(f"Artifact ID [{suggested_id}]: ").strip() or suggested_id
    title = input("Title: ").strip()
    
    print("\nTypes: [1] Manuscript  [2] Map  [3] Oddity  [4] Ephemera")
    type_map = {"1": "Manuscript", "2": "Cartography", "3": "Oddities", "4": "Ephemera"}
    type_choice = input("Type [1]: ").strip() or "1"
    type_val = type_map.get(type_choice, "Manuscript")
    
    summary = input("Short Summary (Card view): ").strip()
    desc = input("Full Description (Detail view): ").strip()
    origin = input("Origin/Location: ").strip()
    
    # Custom fields for the "Embers" philosophy
    condition = input("Condition (e.g., 'Pristine Vellum', 'Water Damaged'): ").strip()
    resonance = input("Resonance/Spark (The hidden truth/feeling): ").strip()
    
    return {
        "id": id_val,
        "title": title,
        "type": type_val,
        "summary": summary,
        "desc": desc,
        "origin": origin,
        "condition": condition,
        "resonance": resonance,
        "filename": filename
    }

def update_database(meta, new_filename):
    try:
        with open(DB_FILE, 'r') as f:
            content = f.read()

        # Create the JS object string
        # We manually format it to look nice in the file
        new_entry = f"""
        {{
            id: "{meta['id']}",
            title: "{meta['title']}",
            type: "{meta['type']}",
            status: "verified",
            icon: "{'map' if meta['type'] == 'Cartography' else 'book'}", 
            summary: "{meta['summary']}",
            desc: "{meta['desc']}",
            origin: "{meta['origin']}",
            date: "Digitized {datetime.date.today()}",
            hazard: "{meta['resonance'] or 'None'}", 
            material: "{meta['condition'] or 'Digital Scan'}",
            img: "{new_filename}" 
        }},"""

        # Regex to find the start of the artifacts array
        # We look for "artifacts: [" and insert immediately after it
        # This puts the new item at the TOP of the list
        pattern = re.compile(r'(artifacts:\s*\[)')
        
        if pattern.search(content):
            new_content = pattern.sub(r'\1' + new_entry, content)
            
            with open(DB_FILE, 'w') as f:
                f.write(new_content)
            return True
        else:
            print("\033[91mError: Could not locate 'artifacts' array in db.js\033[0m")
            return False

    except Exception as e:
        print(f"\033[91mError updating database: {e}\033[0m")
        return False

def main():
    clear_screen()
    print_header()
    
    files = get_files_in_inbox()
    
    if not files:
        print(f"\n\033[90mNo images found in '{INBOX_DIR}'.\033[0m")
        print(f"Drop .jpg or .png files there to begin ingestion.")
        return

    print(f"\nFound {len(files)} pending scan(s).")
    
    for i, f in enumerate(files):
        print(f"[{i+1}] {f}")
        
    choice = input("\nSelect file number to ingest (or 'q' to quit): ")
    if choice.lower() == 'q':
        sys.exit()
        
    try:
        idx = int(choice) - 1
        if 0 <= idx < len(files):
            target_file = files[idx]
            
            # 1. Get Metadata
            meta = prompt_metadata(target_file)
            
            # 2. Move & Rename Image
            ext = os.path.splitext(target_file)[1]
            new_filename = f"{meta['id']}{ext}".lower()
            src_path = os.path.join(INBOX_DIR, target_file)
            dest_path = os.path.join(ARTIFACT_IMG_DIR, new_filename)
            
            shutil.move(src_path, dest_path)
            print(f"\n\033[92m✔ Image secured in vault: {new_filename}\033[0m")
            
            # 3. Update DB
            if update_database(meta, new_filename):
                print(f"\033[92m✔ Database record injected successfully.\033[0m")
                print("\nTransformation Complete.")
            else:
                # Rollback image move if DB fails? 
                # For now, just warn.
                print("Warning: Image moved but DB update failed.")
                
        else:
            print("Invalid selection.")
    except ValueError:
        print("Invalid input.")

if __name__ == "__main__":
    main()
