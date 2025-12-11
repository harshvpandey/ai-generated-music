@echo off
TITLE JioAIMusic - Backend Server
CLS

ECHO ========================================================
ECHO             JioAIMusic Server
ECHO ========================================================
ECHO.
ECHO Starting server on http://0.0.0.0:8000 ...
ECHO.
ECHO Access the app at: http://localhost:8000
ECHO.

cd backend
uvicorn main:app --host 0.0.0.0 --port 8000 --reload
PAUSE
