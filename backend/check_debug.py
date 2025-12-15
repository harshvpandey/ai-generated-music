import os

# Replicate main.py logic
try:
    BASE_DIR = os.path.dirname(os.path.abspath(__file__))
    PARENT_DIR = os.path.dirname(BASE_DIR)
    static_path = os.path.join(PARENT_DIR, "frontend", "public")

    print(f"File: {__file__}")
    print(f"Abs File: {os.path.abspath(__file__)}")
    print(f"BASE_DIR: {BASE_DIR}")
    print(f"PARENT_DIR: {PARENT_DIR}")
    print(f"Target static_path: {static_path}")
    print(f"Exists? {os.path.exists(static_path)}")

    if os.path.exists(static_path):
        print(f"Contents: {os.listdir(static_path)}")
    else:
        print("DIRECTORY NOT FOUND!")

except Exception as e:
    print(f"Error: {e}")
