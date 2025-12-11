@echo off
TITLE JioAIMusic - Public Sharing
CLS

ECHO ========================================================
ECHO          JioAIMusic Public Sharing Utility
ECHO ========================================================
ECHO.
ECHO This script creates a temporary public URL for your local server.
ECHO Usage:
ECHO 1. Keep this window open.
ECHO 2. Look for the URL starting with "https://" and ending in ".pinggy.io" (or similar).
ECHO 3. Send that URL to your audience.
ECHO 4. They can open it on their phones (no setup required).
ECHO.
ECHO NOTE: If asked "Are you sure you want to continue connecting?", type 'yes' and press Enter.
ECHO.
ECHO Connecting to public relay...
ECHO.

:: Run SSH tunnel using Pinggy.io (Free, no account needed)
ssh -p 443 -R0:localhost:8000 a.pinggy.io

PAUSE
