# Start Docker helper services (Gentle / optional MFA / optional Remotion Studio)
# and the GUI on the Windows host. Does NOT run slides-app in Docker.

$RepoRoot = Resolve-Path (Join-Path $PSScriptRoot '..\..')
Set-Location $RepoRoot

Write-Host "Starting My Slides (host GUI + Docker helpers)..." -ForegroundColor Cyan
Write-Host ""

if (-not (Get-Command docker -ErrorAction SilentlyContinue)) {
    Write-Host "ERROR: Docker is not installed or not in PATH" -ForegroundColor Red
    Write-Host "Install Docker Desktop, or run without Docker: npm run gui && npm start" -ForegroundColor Yellow
    pause
    exit 1
}

try {
    docker info 2>$null | Out-Null
} catch {
    Write-Host "ERROR: Docker engine is not running (docker version must show Client AND Server)" -ForegroundColor Red
    Write-Host "Start Docker Desktop and wait until the engine is ready." -ForegroundColor Yellow
    pause
    exit 1
}

Write-Host "Pulling Gentle image..." -ForegroundColor Yellow
docker compose pull gentle 2>$null

Write-Host "Starting Gentle (localhost:8765)..." -ForegroundColor Yellow
docker compose up -d gentle

if ($LASTEXITCODE -ne 0) {
    Write-Host "ERROR: Failed to start Gentle" -ForegroundColor Red
    pause
    exit 1
}

Write-Host ""
Write-Host "Starting GUI on host http://localhost:3001 ..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$RepoRoot'; npm run gui" -WindowStyle Minimized

Start-Sleep -Seconds 2

Write-Host "Starting Remotion Studio on host http://localhost:3000 ..." -ForegroundColor Yellow
Write-Host "(Optional Docker preview: docker compose --profile studio up -d --build remotion)" -ForegroundColor Gray
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$RepoRoot'; npm start" -WindowStyle Minimized

Write-Host ""
Write-Host "Ready:" -ForegroundColor Green
Write-Host "  GUI:             http://localhost:3001" -ForegroundColor Cyan
Write-Host "  Remotion Studio: http://localhost:3000" -ForegroundColor Cyan
Write-Host "  Gentle timings:  http://localhost:8765" -ForegroundColor Cyan
Write-Host ""
Write-Host "Stop Docker helpers: docker compose down" -ForegroundColor Gray
Write-Host ""

Start-Sleep -Seconds 2
Start-Process "http://localhost:3001"
