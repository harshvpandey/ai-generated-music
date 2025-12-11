@echo off
TITLE JioAIMusic - Cloudflare Public Sharing
CLS

ECHO ========================================================
ECHO         JioAIMusic Cloudflare Sharing (Robust)
ECHO ========================================================
ECHO.
ECHO This uses Cloudflare's massive network to tunnel your app.
ECHO.
ECHO 1. Wait for the lines to appear below.
ECHO 2. Look for the URL ending in ".trycloudflare.com".
ECHO    (It will be inside a box or next to "your quick Tunnel is created")
ECHO 3. Copy that URL and share it!
ECHO.
ECHO Starting tunnel...
ECHO.

.\cloudflared.exe tunnel --url http://localhost:8000
PAUSE
