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
            $procId = $parts[-1]
            if ($procId -match '^\d+$' -and $procId -ne '0') {
                $pids += [int]$procId
            }
        }
    }
    $pids = $pids | Select-Object -Unique
    foreach ($procId in $pids) {
        try {
            Stop-Process -Id $procId -Force -ErrorAction Stop
            Write-Host "  Port ${port}: stopped PID $procId" -ForegroundColor Green
        } catch {
            Write-Host "  Port ${port}: could not stop PID $procId ($($_.Exception.Message))" -ForegroundColor Yellow
        }
    }
}

Write-Host "Stopping host processes..." -ForegroundColor Yellow
Stop-Port 3001
Stop-Port 3000

Write-Host ""
Write-Host "Stopping Docker containers..." -ForegroundColor Yellow

function Invoke-ComposeDown {
    $files = @('-f', 'docker-compose.yml')
    if (Test-Path 'docker-compose.cloud.yml') {
        $files += @('-f', 'docker-compose.cloud.yml')
    }
    if ($env:USE_HOST_NETWORK -eq '1' -and (Test-Path 'docker-compose.runpod.yml')) {
        $files += @('-f', 'docker-compose.runpod.yml')
    }
    if ($env:SLIDES_IMAGE -and (Test-Path 'docker-compose.prod.yml')) {
        $files = @('-f', 'docker-compose.prod.yml', '-f', 'docker-compose.cloud.yml')
        if ($env:USE_HOST_NETWORK -eq '1' -and (Test-Path 'docker-compose.runpod.yml')) {
            $files += @('-f', 'docker-compose.runpod.yml')
        }
    }

    $composeV2 = Get-Command docker -ErrorAction SilentlyContinue
    if ($composeV2) {
        & docker compose @files down --remove-orphans 2>$null
        if ($LASTEXITCODE -eq 0) { return $true }
    }
    $composeV1 = Get-Command docker-compose -ErrorAction SilentlyContinue
    if ($composeV1) {
        & docker-compose @files down --remove-orphans 2>$null
        if ($LASTEXITCODE -eq 0) { return $true }
    }
    return $false
}

if (Test-Path '.env') {
    Get-Content '.env' | ForEach-Object {
        if ($_ -match '^\s*([^#=]+)=(.*)$') {
            $name = $matches[1].Trim()
            $value = $matches[2].Trim()
            Set-Item -Path "env:$name" -Value $value
        }
    }
}

if (Get-Command docker -ErrorAction SilentlyContinue) {
    if (Invoke-ComposeDown) {
        Write-Host "  Docker containers stopped" -ForegroundColor Green
    } else {
        Write-Host "  Docker not running or already stopped" -ForegroundColor Gray
    }
} else {
    Write-Host "  Docker not installed" -ForegroundColor Gray
}

Write-Host ""
Write-Host "Done. Ports 3000 (Remotion) and 3001 (GUI) should be free." -ForegroundColor Green
