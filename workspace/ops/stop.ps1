# Stop My Slides - Docker containers + host processes on 3000/3001

$RepoRoot = Resolve-Path (Join-Path $PSScriptRoot '..\..')
Set-Location $RepoRoot

Write-Host "Stopping My Slides..." -ForegroundColor Cyan
Write-Host ""

function Stop-Port($port) {
    $lines = netstat -ano | findstr ":$port " | findstr "LISTENING"
    if (-not $lines) {
        Write-Host "  Port ${port}: nothing listening" -ForegroundColor Gray
        return
    }
    $pids = @()
    foreach ($line in $lines) {
        $parts = ($line -split '\s+') | Where-Object { $_ -ne '' }
        if ($parts.Count -ge 1) {
            $pid = $parts[-1]
            if ($pid -match '^\d+$' -and $pid -ne '0') {
                $pids += [int]$pid
            }
        }
    }
    $pids = $pids | Select-Object -Unique
    foreach ($pid in $pids) {
        try {
            Stop-Process -Id $pid -Force -ErrorAction Stop
            Write-Host "  Port ${port}: stopped PID $pid" -ForegroundColor Green
        } catch {
            Write-Host "  Port ${port}: could not stop PID $pid" -ForegroundColor Yellow
        }
    }
}

Write-Host "Stopping host processes..." -ForegroundColor Yellow
Stop-Port 3001
Stop-Port 3000

Write-Host ""
Write-Host "Stopping Docker containers..." -ForegroundColor Yellow
if (Get-Command docker -ErrorAction SilentlyContinue) {
    docker-compose down 2>$null
    if ($LASTEXITCODE -eq 0) {
        Write-Host "  Docker containers stopped" -ForegroundColor Green
    } else {
        Write-Host "  Docker not running or already stopped" -ForegroundColor Gray
    }
} else {
    Write-Host "  Docker not installed" -ForegroundColor Gray
}

Write-Host ""
Write-Host "Done. Ports 3000 (Remotion) and 3001 (GUI) should be free." -ForegroundColor Green
