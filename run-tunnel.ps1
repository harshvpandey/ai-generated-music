Write-Host "Starting Cloudflare Tunnel for Localhost:8000..." -ForegroundColor Cyan
Write-Host "This will generate a public URL for your local backend." -ForegroundColor Yellow
Write-Host "You can share this URL with anyone to access the 'word-submit.html'." -ForegroundColor Yellow

# Check if cloudflared exists
if (-not (Test-Path ".\cloudflared.exe")) {
    Write-Error "cloudflared.exe not found! Please download it first."
    exit 1
}

# Run the tunnel
.\cloudflared.exe tunnel --url http://localhost:8000
