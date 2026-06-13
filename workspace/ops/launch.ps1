# Desktop Launcher for My Slides (Windows)
# This script starts the Docker containers and opens the app in your browser

$RepoRoot = Resolve-Path (Join-Path $PSScriptRoot '..\..')
Set-Location $RepoRoot

Write-Host "Starting My Slides Desktop Application..." -ForegroundColor Cyan
Write-Host ""

# Check if Docker is running
if (-not (Get-Command docker -ErrorAction SilentlyContinue)) {
    Write-Host "ERROR: Docker is not installed or not in PATH" -ForegroundColor Red
    Write-Host "Please install Docker Desktop from https://www.docker.com/products/docker-desktop" -ForegroundColor Yellow
    pause
    exit 1
}

# Check if Docker daemon is running
try {
    docker info | Out-Null
} catch {
    Write-Host "ERROR: Docker Desktop is not running" -ForegroundColor Red
    Write-Host "Please start Docker Desktop and try again" -ForegroundColor Yellow
    pause
    exit 1
}

Write-Host "Docker is running. Starting containers..." -ForegroundColor Green

# Remove old network if it exists and has issues
docker network rm my-slides_slides-network 2>$null

# Start containers
docker-compose up -d

if ($LASTEXITCODE -ne 0) {
    Write-Host "Network recreation needed, cleaning up..." -ForegroundColor Yellow
    docker-compose down 2>$null
    docker network rm my-slides_slides-network 2>$null
    Write-Host "Retrying..." -ForegroundColor Yellow
    docker-compose up -d
    
    if ($LASTEXITCODE -ne 0) {
        Write-Host "ERROR: Failed to start containers" -ForegroundColor Red
        pause
        exit 1
    }
}

Write-Host ""
Write-Host "Waiting for application to be ready..." -ForegroundColor Yellow

# Wait for the app to be ready (check if port 3000 is responding)
$maxAttempts = 30
$attempt = 0
$ready = $false

while ($attempt -lt $maxAttempts -and -not $ready) {
    Start-Sleep -Seconds 2
    $attempt++
    
    try {
        $response = Invoke-WebRequest -Uri "http://localhost:3000" -TimeoutSec 2 -UseBasicParsing -ErrorAction Stop
        if ($response.StatusCode -eq 200) {
            $ready = $true
        }
    } catch {
        # Still waiting
    }
    
    Write-Host "." -NoNewline -ForegroundColor Gray
}

Write-Host ""

if ($ready) {
    Write-Host "Application is ready!" -ForegroundColor Green
    Write-Host ""
    Write-Host "Opening in your default browser..." -ForegroundColor Cyan
    Write-Host "GUI: http://localhost:3001 (Video Creator)" -ForegroundColor Yellow
    Write-Host "Remotion Studio: http://localhost:3000 (Preview)" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "To stop the application, press Ctrl+C or run: docker-compose down" -ForegroundColor Gray
    Write-Host ""
    
    # Open browser to GUI
    Start-Sleep -Seconds 2
    Start-Process "http://localhost:3001"
    
    # Keep script running and show logs
    Write-Host "Application is running. Press Ctrl+C to stop..." -ForegroundColor Cyan
    docker-compose logs -f app
} else {
    Write-Host ""
    Write-Host "WARNING: Application did not become ready in time" -ForegroundColor Yellow
    Write-Host "You can check the status with: docker-compose ps" -ForegroundColor Gray
    Write-Host "Or view logs with: docker-compose logs app" -ForegroundColor Gray
    Write-Host ""
    Write-Host "Trying to open browser anyway..." -ForegroundColor Yellow
    Start-Process "http://localhost:3000"
    pause
}
