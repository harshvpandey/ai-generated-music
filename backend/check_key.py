from dotenv import load_dotenv
import os

load_dotenv()
key = os.getenv("SUNO_API_KEY")
base = os.getenv("SUNO_BASE_URL", "Default")

print(f"Key Present: {bool(key)}")
if key:
    print(f"Key Length: {len(key)}")
    print(f"Key Prefix: {key[:4]}...")
print(f"Base URL: {base}")
