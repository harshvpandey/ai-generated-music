import os
import requests
from dotenv import load_dotenv

load_dotenv()

BASE_URL = os.getenv("SUNO_BASE_URL", "https://api.sunoapi.org")
API_KEY = os.getenv("SUNO_API_KEY")

import urllib3
urllib3.disable_warnings(urllib3.exceptions.InsecureRequestWarning)

def generate_music(data: dict):
    if not API_KEY:
        raise Exception("SUNO_API_KEY is not set in environment variables.")

    url = f"{BASE_URL}/api/v1/generate"
    
    # Determine callback URL
    public_url = os.getenv("PUBLIC_URL")
    if public_url:
        public_url = public_url.strip() # Remove potential leading/trailing spaces
        callback_url = f"{public_url.rstrip('/')}/api/callback"
        print(f"CONFIG: Callback Mode Enabled. Public URL: {public_url}")
        print(f"Using callback URL: {callback_url}")
    else:
        # Fallback to dummy for polling
        callback_url = "https://example.com/callback"
        print("CONFIG: Polling Mode Active. (Add PUBLIC_URL to .env for Fast Mode)")
    
    # Map our schema fields to the exact fields expected by Suno API
    
    payload = {
        "customMode": data.get("customMode"),
        "instrumental": data.get("instrumental"),
        "prompt": data.get("prompt"),
        "style": data.get("style"),
        "title": data.get("title"),
        "model": data.get("model", "V5"),
        "callBackUrl": callback_url
    }
    
    # Remove None values
    payload = {k: v for k, v in payload.items() if v is not None}

    headers = {
        "Content-Type": "application/json",
        "Authorization": f"Bearer {API_KEY}"
    }
    
    try:
        # verify=False is used to bypass SSL errors in some environments
        response = requests.post(url, json=payload, headers=headers, verify=False)
        response.raise_for_status()
        return response.json()
    except requests.exceptions.HTTPError as e:
        if e.response is not None:
             raise Exception(f"Upstream API Error: {e.response.text}")
        raise e
    except Exception as e:
        raise e

def get_music_status(task_id: str):
    """Poll the Suno API to get the status of a music generation task"""
    if not API_KEY:
        raise Exception("SUNO_API_KEY is not set in environment variables.")
    
    url = f"{BASE_URL}/api/v1/generate/record-info"
    
    headers = {
        "Authorization": f"Bearer {API_KEY}"
    }
    
    params = {
        "taskId": task_id
    }
    
    try:
        response = requests.get(url, headers=headers, params=params, verify=False)
        response.raise_for_status()
        return response.json()
    except requests.exceptions.HTTPError as e:
        if e.response is not None:
            raise Exception(f"Upstream API Error: {e.response.text}")
        raise e
    except Exception as e:
        raise e
