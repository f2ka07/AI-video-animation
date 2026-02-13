# Start both Remotion Studio and GUI Server (Windows)

Write-Host "Starting My Slides Application..." -ForegroundColor Cyan
Write-Host ""

# Check if Docker is running
if (-not (Get-Command docker -ErrorAction SilentlyContinue)) {
    Write-Host "ERROR: Docker is not installed or not in PATH" -ForegroundColor Red
    exit 1
}

# Start Docker containers
Write-Host "Starting Docker containers..." -ForegroundColor Yellow

# Remove old network if it exists and has issues
docker network rm my-slides_slides-network 2>$null

# Try to start containers
docker-compose up -d

if ($LASTEXITCODE -ne 0) {
    Write-Host "Network recreation needed, cleaning up..." -ForegroundColor Yellow
    docker-compose down 2>$null
    docker network rm my-slides_slides-network 2>$null
    Write-Host "Retrying..." -ForegroundColor Yellow
    docker-compose up -d
    
    if ($LASTEXITCODE -ne 0) {
        Write-Host "ERROR: Failed to start containers" -ForegroundColor Red
        exit 1
    }
}

Write-Host "Waiting for services to be ready..." -ForegroundColor Yellow
Start-Sleep -Seconds 5

# Start Remotion Studio in background
Write-Host "Starting Remotion Studio..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$PWD'; npm start" -WindowStyle Minimized

# Start GUI Server in background
Write-Host "Starting GUI Server..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$PWD'; npm run gui" -WindowStyle Minimized

Write-Host ""
Write-Host "Services starting..." -ForegroundColor Green
Write-Host "GUI: http://localhost:3001" -ForegroundColor Cyan
Write-Host "Remotion Studio: http://localhost:3000" -ForegroundColor Cyan
Write-Host ""
Write-Host "Opening GUI in browser..." -ForegroundColor Yellow

Start-Sleep -Seconds 3
Start-Process "http://localhost:3001"

Write-Host ""
Write-Host "Both services are running in separate windows." -ForegroundColor Green
Write-Host "Close those windows to stop the services." -ForegroundColor Gray
