# Stop script for My Slides Desktop Application (Windows)

Write-Host "Stopping My Slides Desktop Application..." -ForegroundColor Cyan
Write-Host ""

docker-compose down

if ($LASTEXITCODE -eq 0) {
    Write-Host "Application stopped successfully" -ForegroundColor Green
} else {
    Write-Host "Error stopping application" -ForegroundColor Red
}
