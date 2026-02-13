# Test RunPod API directly with a URL (matching the curl example)

$AUDIO_URL = "https://d1q70pf5vjeyhc.cloudfront.net/predictions/f981a3dca8204b14ab24151fa0532c26/1.mp3"
$API_URL = "https://api.runpod.ai/v2/whisper-v3-large/run"

# Read API key from .env
if (Test-Path .env) {
    $envContent = Get-Content .env
    $apiKeyLine = $envContent | Select-String -Pattern "^WHISPER_API_KEY=(.+?)$"
    if ($apiKeyLine) {
        $WHISPER_API_KEY = $apiKeyLine.Matches[0].Groups[1].Value
    }
}

# Test RunPod API - exact format from your curl example
$headers = @{
    "Content-Type" = "application/json"
    "Authorization" = "Bearer $WHISPER_API_KEY"
}

$body = @{
    input = @{
        prompt = ""
        audio = $AUDIO_URL
    }
} | ConvertTo-Json -Depth 3

Write-Host "Testing RunPod API with URL: $AUDIO_URL"
Write-Host "Payload: $body"
Write-Host ""

try {
    $response = Invoke-RestMethod -Uri $API_URL -Method POST -Headers $headers -Body $body -ContentType "application/json"
    Write-Host "Response:"
    $response | ConvertTo-Json -Depth 10
} catch {
    Write-Host "Error: $($_.Exception.Message)"
    Write-Host "Status: $($_.Exception.Response.StatusCode.value__)"
}
