# PowerShell script to clean Remotion cache and assets
# Run with: .\scripts\cleanRemotionCache.ps1

Write-Host "Cleaning Remotion cache and assets..." -ForegroundColor Yellow

# Remove .remotion directory if it exists
if (Test-Path ".remotion") {
    Remove-Item -Recurse -Force ".remotion"
    Write-Host "✓ Removed .remotion directory" -ForegroundColor Green
} else {
    Write-Host "  .remotion directory not found" -ForegroundColor Gray
}

# Remove node_modules cache
if (Test-Path "node_modules/.cache") {
    Remove-Item -Recurse -Force "node_modules/.cache"
    Write-Host "✓ Removed node_modules/.cache" -ForegroundColor Green
} else {
    Write-Host "  node_modules/.cache not found" -ForegroundColor Gray
}

# Remove any Remotion build artifacts
if (Test-Path "build") {
    Remove-Item -Recurse -Force "build"
    Write-Host "✓ Removed build directory" -ForegroundColor Green
}

# Clear browser cache location (if accessible)
$browserCache = "$env:LOCALAPPDATA\Remotion\Cache"
if (Test-Path $browserCache) {
    Remove-Item -Recurse -Force $browserCache
    Write-Host "✓ Removed Remotion browser cache" -ForegroundColor Green
}

Write-Host "`nCache cleanup complete! Restart Remotion Studio to see changes." -ForegroundColor Cyan
