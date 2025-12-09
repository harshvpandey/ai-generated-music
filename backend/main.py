from fastapi import FastAPI, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware
from schemas import GenerateRequest, GenerateResponse
from service import generate_music, get_music_status
import os

app = FastAPI(title="SongCreater Backend")

# In-memory storage for job results (in production, use Redis or a database)
job_storage = {}

# CORS
origins = [
    "http://localhost:5173",  # Vite default
    "http://localhost:3000",
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

@app.post("/api/callback")
async def receive_callback(request: Request):
    """Receive callbacks from Suno API when generation is complete"""
    try:
        data = await request.json()
        print(f"Received callback: {data}")
        
        # Store the result by job ID or other identifier
        if "id" in data or "task_id" in data:
            job_id = data.get("id") or data.get("task_id")
            job_storage[job_id] = data
        
        return {"status": "received"}
    except Exception as e:
        print(f"Callback error: {e}")
        return {"status": "error", "message": str(e)}

@app.get("/api/status/{task_id}")
def poll_task_status(task_id: str):
    """Poll Suno API for task status"""
    try:
        result = get_music_status(task_id)
        return {"status": "success", "data": result}
    except Exception as e:
        print(f"Error polling status: {e}")
        raise HTTPException(status_code=400, detail=str(e))

@app.get("/api/job/{job_id}")
def get_job_status(job_id: str):
    """Get the status of a generation job"""
    if job_id in job_storage:
        return {"status": "success", "data": job_storage[job_id]}
    return {"status": "pending", "message": "Job not yet complete"}

@app.post("/api/generate", response_model=GenerateResponse)
def generate_song(request: GenerateRequest):
    try:
        # Convert Pydantic model to dict
        data = request.dict()
        result = generate_music(data)
        
        # Store initial job info
        if result and "data" in result:
            job_data = result.get("data")
            if isinstance(job_data, dict) and "id" in job_data:
                job_storage[job_data["id"]] = {"status": "pending", "initial": job_data}
        
        return GenerateResponse(status="success", data=result)
    except Exception as e:
        print(f"Error generating music: {e}")
        raise HTTPException(status_code=400, detail=str(e))

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
