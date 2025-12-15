# SongCreater Backend

FastAPI backend for interfacing with the Suno AI API.

## Setup

1. **Install Dependencies**
   ```bash
   pip install -r requirements.txt
   ```

2. **Environment Variables**
   Copy `.env.example` to `.env` and fill in your details:
   ```bash
   cp .env.example .env
   ```
   * `SUNO_BASE_URL`: The URL of the Suno API provider (e.g., specific proxy or official if available).
   * `SUNO_API_KEY`: Your API Key.
   * `PUBLIC_URL`: (Optional) Your Tunnel URL (e.g., https://...serveo.net) for fast generation (2-3s). Leave empty for slow polling.

3. **Fast Mode Setup (Recommended)**
   To get songs in 2-3 seconds instead of polling every 2s:
   1. Open a new terminal.
   2. Run: `ssh -R 80:localhost:8000 serveo.net`
   3. Copy the URL (https://...)
   4. Add it to `PUBLIC_URL` in `.env`
   5. Restart the backend.

## Running

```bash
uvicorn main:app --reload
```
Server will start at `http://localhost:8000`.

## API Endpoints

* `POST /api/generate`: Generate music.
  * Body: `customMode`, `prompt`, `style`, `title`, `instrumental`, `model`.
