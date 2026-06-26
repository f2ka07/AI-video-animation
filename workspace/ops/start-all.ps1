# Start Remotion Studio (3000) + GUI Server (3001) on the host
# Does NOT start Docker app/remotion containers (avoids port conflicts).
# For Docker-only mode, use launch.ps1 instead.
# Gentle (word timings) optional: docker-compose up -d gentle

$RepoRoot = Resolve-Path (Join-Path $PSScriptRoot '..\..')
Set-Location $RepoRoot
$projectRoot = $RepoRoot

Write-Host "Starting My Slides (host mode)..." -ForegroundColor Cyan

function Test-PortInUse($port) {
    $match = netstat -ano | findstr ":$port " | findstr "LISTENING"
    return [bool]$match
}

if (Test-PortInUse 3001) {
    Write-Host "WARNING: Port 3001 is already in use." -ForegroundColor Yellow
    Write-Host "  http://localhost:3001 should be the GUI (Skilleo AI), not Remotion." -ForegroundColor Yellow
    Write-Host "  If you see Remotion there, kill the process and restart:" -ForegroundColor Yellow
    Write-Host "    netstat -ano | findstr "":3001""" -ForegroundColor Gray
    Write-Host "    taskkill /PID <pid> /F" -ForegroundColor Gray
    Write-Host ""
}

if (Test-PortInUse 3000) {
    Write-Host "NOTE: Port 3000 is already in use (Remotion may already be running)." -ForegroundColor Yellow
    Write-Host ""
}

# Gentle (word timings) + optional MFA via Docker; GUI/Remotion run on the host.
if (Get-Command docker -ErrorAction SilentlyContinue) {
    try {
        docker info 2>$null | Out-Null
        Write-Host "Pulling / starting Gentle (localhost:8765)..." -ForegroundColor Yellow
        docker compose pull gentle 2>$null
        docker compose up -d gentle 2>&1 | ForEach-Object { Write-Host $_ }
        if ($LASTEXITCODE -ne 0) {
            Write-Host "Gentle failed — port 8765 may already be in use:" -ForegroundColor Yellow
            Write-Host "  docker ps --filter publish=8765" -ForegroundColor Gray
            Write-Host "  docker stop <name>  OR set GENTLE_HOST_PORT=8766 in .env" -ForegroundColor Gray
        }
    } catch {
        Write-Host "Docker not running - skipping Gentle (use MFA or fix Docker for Step 4)" -ForegroundColor Gray
    }
}

Write-Host "Starting GUI Server on http://localhost:3001 ..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$projectRoot'; npm run gui" -WindowStyle Minimized

Start-Sleep -Seconds 2

Write-Host "Starting Remotion Studio on http://localhost:3000 ..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$projectRoot'; npm start" -WindowStyle Minimized

Write-Host ""
Write-Host "Services starting..." -ForegroundColor Green
Write-Host "  GUI (Skilleo AI):  http://localhost:3001" -ForegroundColor Cyan
Write-Host "  Remotion Studio:   http://localhost:3000" -ForegroundColor Cyan
Write-Host ""
Write-Host "Verify GUI: http://localhost:3001/api/health should show service=skilleo-gui" -ForegroundColor Gray
Write-Host ""

Start-Sleep -Seconds 3
Start-Process "http://localhost:3001"

Write-Host "Close the two PowerShell windows to stop the services." -ForegroundColor Gray
Write-Host "Or run: .\stop.ps1" -ForegroundColor Gray
