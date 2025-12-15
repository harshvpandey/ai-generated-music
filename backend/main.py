from fastapi import FastAPI, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from schemas import GenerateRequest, GenerateResponse
from service import generate_music, get_music_status
from pydantic import BaseModel
import os

app = FastAPI(title="SongCreater Backend")

# In-memory storage for job results (in production, use Redis or a database)
job_storage = {}

# In-memory storage for collected words
collected_words = []

class WordSubmission(BaseModel):
    word: str
    browser_id: str = None  # Optional for backward compatibility

# In-memory storage for unique participants
unique_participants = set()

# CORS
origins = [
    "http://localhost:5173",  # Vite default
    "http://localhost:3000",
    "http://localhost:8080",  # HTML pages server
    "https://spiffy-sunflower-7bee1a.netlify.app", # Production Frontend
    "*"  # Allow all for testing
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/health")
def health_check():
    return {"status": "ok"}

# Mount static files (frontend/public) to serve directly
# Mount static files (frontend/public) to serve directly
from fastapi.staticfiles import StaticFiles
from pathlib import Path
import sys

# Robust path resolution
current_file = Path(__file__).resolve()
backend_dir = current_file.parent
project_root = backend_dir.parent

# Candidate paths to checking
candidates = [
    project_root / "frontend" / "public",
    backend_dir / "../frontend/public",
    Path("E:/Kirtikumar/Projects/AI_music_local/ai-generated-music/frontend/public"), # Hardcoded fallback
    Path("./frontend/public").resolve()
]

static_path = None
for candidate in candidates:
    resolved = candidate.resolve()
    print(f"DEBUG: Checking path: {resolved}", flush=True)
    if resolved.exists() and resolved.is_dir():
        static_path = resolved
        print(f"DEBUG: FOUND static path at: {resolved}", flush=True)
        break

if static_path:
    app.mount("/public", StaticFiles(directory=str(static_path)), name="public")
else:
    print("CRITICAL WARNING: Could not find 'frontend/public' directory! Static files will 404.", flush=True)
    print(f"Searched in: {[str(c) for c in candidates]}", flush=True)

@app.get("/api/debug-config")
def debug_config():
    return {
        "status": "debug",
        "static_path_resolved": str(static_path) if static_path else None,
        "is_mounted": (static_path is not None),
        "current_working_dir": os.getcwd(),
        "file_location": str(current_file),
        "candidates_checked": [str(c) for c in candidates]
    }

# Redirect root to word-submit
from fastapi.responses import RedirectResponse
@app.get("/")
async def root():
    return RedirectResponse(url="/public/word-submit.html")

@app.post("/api/submit-word")
async def submit_word(submission: WordSubmission):
    """Submit a word from a leader"""
    try:
        raw_word = submission.word.strip()
        if not raw_word:
            raise HTTPException(status_code=400, detail="Word cannot be empty")
        
        if len(raw_word) > 500:
            raise HTTPException(status_code=400, detail="Submission too long (max 500 characters)")
        
        # Split by comma and add each word separately
        new_words = [w.strip() for w in raw_word.split(',') if w.strip()]
        
        if not new_words:
            raise HTTPException(status_code=400, detail="No valid words found in submission")
            
        # Track unique participant
        if submission.browser_id:
            unique_participants.add(submission.browser_id)
        
        collected_words.extend(new_words)
        print(f"Received words: {new_words} from {submission.browser_id}")
        return {"status": "success", "message": "Words added", "count": len(collected_words), "participants": len(unique_participants)}
    except Exception as e:
        print(f"Error submitting word: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/words")
def get_words():
    """Get all collected words"""
    return {
        "words": collected_words,
        "count": len(collected_words),
        "participants": len(unique_participants)
    }

@app.delete("/api/words")
def clear_words():
    """Clear all collected words"""
    collected_words.clear()
    unique_participants.clear()
    return {"status": "success", "message": "All words cleared"}

@app.delete("/api/words/{index}")
def remove_word(index: int):
    """Remove a specific word by index"""
    global collected_words
    try:
        if 0 <= index < len(collected_words):
            removed_word = collected_words.pop(index)
            return {"status": "success", "message": f"Removed '{removed_word}'", "remaining": len(collected_words)}
        else:
            raise HTTPException(status_code=404, detail="Word index out of range")
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@app.post("/api/generate", response_model=GenerateResponse)
def generate_song(request: GenerateRequest):
    try:
        # Convert Pydantic model to dict
        data = request.model_dump()
        result = generate_music(data)
        
        # Store initial job info
        if result and "data" in result:
            job_data = result.get("data")
            if isinstance(job_data, dict) and "id" in job_data:
                job_storage[job_data["id"]] = {"status": "pending", "initial": job_data}
                print(f"SONG ID : {job_data['id']}", flush=True)
        
        return GenerateResponse(status="success", data=result)
    except Exception as e:
        print(f"Error generating music: {e}")
        raise HTTPException(status_code=400, detail=str(e))

@app.post("/api/callback")
async def handle_callback(request: Request):
    """Handle webhook callback from Suno API"""
    try:
        data = await request.json()
        print(f"Callback received: {data}")
        
        # Parse based on provided documentation:
        # { code: 200, msg: "...", data: { task_id: "...", data: [songs...] } }
        
        code = data.get("code")
        callback_data = data.get("data", {})
        task_id = callback_data.get("task_id")
        
        if task_id:
            # Map API status code to Frontend expected string
            status_text = "SUCCESS" if code == 200 else "FAILED"
            
            # Extract songs list
            songs = callback_data.get("data", [])
            
            # CHECK: Does the callback actually contain audio?
            # If not, we should treat it as 'pending' so the 'get_status' fallback pulses the API
            has_audio = False
            for s in songs:
                if s.get("audio_url") or s.get("audioUrl") or s.get("streamAudioUrl"):
                    has_audio = True
                    break
            
            final_status = "completed" if (status_text == "SUCCESS" and has_audio) else "pending"
            if not has_audio and status_text == "SUCCESS":
                print(f"Callback has NO AUDIO. Forcing status to 'pending' to continue polling.")

            # Normalize structure for Frontend (which expects 'sunoData')
            normalized_data = {
                "id": task_id,
                "status": status_text,
                "sunoData": songs, # CRITICAL: Map 'data' list to 'sunoData'
                "original_data": data
            }

            # Update storage
            job_storage[task_id] = {
                "status": final_status, 
                "data": normalized_data
            }
            print(f"Callback processed for {task_id}. Status: {status_text}")
            
        return {"status": "received"}
    except Exception as e:
        print(f"Callback error: {e}")
        return {"status": "error", "message": str(e)}

@app.get("/api/status/{task_id}")
def get_status(task_id: str):
    try:
        # Check local cache first (populated by callback)
        if task_id in job_storage:
            stored_job = job_storage[task_id]
            # If we have a completed/advanced state from callback, return it
            # We assume callback data is fresher or at least valid
            if "data" in stored_job and stored_job.get("status") == "completed": 
                print(f"Returning cached status for {task_id}")
                # We need to match the return structure expected by get_music_status/frontend
                # The frontend expects { ... }
                # The get_music_status returns the raw JSON from Suno. 
                # Our stored 'data' IS that raw JSON from the callback.
                # return stored_job["data"]
                return {"code": 200, "status": "success", "data": stored_job["data"]}

        # Fallback to polling if no callback data or incomplete
        poll_result = get_music_status(task_id)
        # status = poll_result.get("status") if poll_result else "Unknown"
        print(f"DEBUG: Full Polling Result for {task_id}: {poll_result}")
        return poll_result
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
