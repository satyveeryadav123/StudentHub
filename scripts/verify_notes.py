import os
from pypdf import PdfReader

notes_dir = "public/notes/engineering-chemistry"
files = sorted([f for f in os.listdir(notes_dir) if f.endswith(".pdf")])

print(f"Found {len(files)} PDF files in {notes_dir}:\n")

for f in files:
    path = os.path.join(notes_dir, f)
    reader = PdfReader(path)
    print(f"=== File: {f} ===")
    print(f"Total Pages: {len(reader.pages)}")
    for i, page in enumerate(reader.pages):
        text = page.extract_text().strip()
        print(f"--- Page {i+1} (Length: {len(text)} chars) ---")
        lines = text.split("\n")
        print("First 3 lines:", lines[:3])
        print("Last 2 lines:", lines[-2:])
    print()
