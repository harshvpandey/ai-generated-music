$BackendPath = "backend"
$FrontendPath = "frontend"

Write-Host "Starting JioAIMusic Ecosystem..." -ForegroundColor Cyan

# 1. Start Backend
Write-Host "Launching Backend (Port 8000)..." -ForegroundColor Green
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd $BackendPath; if (Test-Path venv) { .\venv\Scripts\activate } else { Write-Warning 'Venv not found!' }; python main.py"

# 2. Start Frontend (React)
Write-Host "Launching Frontend (Port 5173)..." -ForegroundColor Green
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd $FrontendPath; npm run dev"

# 3. Start Static Server (Port 8080)
Write-Host "Launching Static HTML Server (Port 8080)..." -ForegroundColor Green
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd $FrontendPath; python -m http.server 8080"

Write-Host "All services attempted to start!" -ForegroundColor Cyan
Write-Host "Backend: http://localhost:8000"
Write-Host "Frontend: http://localhost:5173"
Write-Host "Static: http://localhost:8080"
