# Vox Librorum: Nomenclature & Archival Protocols

## Overview
This document outlines the cataloging system ("Nomenclature") for the Vox Librorum archive. As we digitize physical assets—scanning books page by page—this naming convention ensures consistency across the database and the "Conduit" AI system.

## 1. ID Naming Schema
We use a "Ghost Town" approach to numbering. IDs do not need to be sequential. Gaps in numbers imply lost or redacted history, adding to the atmosphere.

| Prefix | Category | Example | Notes |
| :--- | :--- | :--- | :--- |
| **MS** | Manuscript | `MS-902` | Journals, books, letters, written follies. |
| **OBJ** | Object / Oddity | `OBJ-11` | Physical artifacts, keys, vials, compasses. |
| **MAP** | Cartography | `MAP-04` | Maps, star charts, floor plans. |
| **REC** | Oral Record | `REC-892` | Audio tapes, transcripts of vigils. |
| **PFL** | Profile | `PFL-EV` | Personnel dossiers (Initials often used). |

---

## 2. "Uploading" via Ingestion Terminal (Recommended)
We have deployed a Python automation to handle the heavy lifting.

1.  **Drop your Scans**: Place your raw `.jpg` or `.png` files into the `scans_inbox` folder.
2.  **Run the Terminal**:
    ```bash
    python3 ingest_scan.py
    ```
3.  **Follow the Prompts**: The terminal will ask for the Title, Type, and Description.
4.  **Done**: The script automatically moves the image to the vault and updates `db.js`.

### Validating the Upload
After running the script, refresh the Archive page. Your new artifact should appear at the top of the grid.

---

### Manual Fallback (JSON Data)
If you prefer to edit the code directly, you can still modify `public/js/db.js`.
Add a new block to the `artifacts` array:

```javascript
{
    id: "MS-404",
    // ...
}
```

---

## 3. Future AI Integration
As you scan books by hand, we plan to implement an AI workflows to assist:

1.  **OCR Ingestion**: You drop the raw scan image into a folder.
2.  **Auto-Tagging**: The AI reads the text, extracts keywords (e.g., "Fog," "Lighthouse"), and suggests tags.
3.  **Summary Generation**: The AI writes the `desc` field automatically based on the scan contents.
4.  **Anomaly Detection**: The AI flags "redacted" or "strange" passages for the Project Desk.

## 4. Current Workflow
1. **Scan** the physical item.
2. **Name** the file using the Schema (e.g., `MS-404_scan.jpg`).
3. **Edit** the `public/js/db.js` file to add the metadata entry.
4. **Commit** changes.
