@echo off
TITLE JioAIMusic Launcher
echo ==================================================
echo      JioAIMusic Project Automated Launcher
echo ==================================================
echo.

echo [1/3] Cleaning up old processes...
taskkill /F /IM python.exe >nul 2>&1
taskkill /F /IM node.exe >nul 2>&1
taskkill /F /IM cloudflared.exe >nul 2>&1
echo Done.
echo.

echo [2/3] Launching Backend, Frontend & Static Server...
start "Services" powershell -NoExit -ExecutionPolicy Bypass -File "run-dev.ps1"
echo Services launched in new window.
echo.

echo [3/3] Launching Cloudflare Tunnel...
echo Waiting 5 seconds for backend to initialize...
timeout /t 5 /nobreak >nul
start "Tunnel" powershell -NoExit -ExecutionPolicy Bypass -File "run-tunnel.ps1"
echo Tunnel launched in new window.
echo.

echo [4/4] Opening Webpages...
timeout /t 3 /nobreak >nul
start "" "http://localhost:5173"
start "" "http://localhost:8080/public/admin-dashboard.html"
start "" "http://localhost:8080/public/qr-display-option2.html"
start "" "http://localhost:8080/public/word-submit.html"

echo ==================================================
echo               SETUP COMPLETE
echo ==================================================
echo 1. Check the 'Tunnel' window for your public Cloudflare URL.
echo 2. Update the QR Code with that URL.
echo.
pause
