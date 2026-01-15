# Test Gentle with curl (PowerShell)
# This helps verify if the issue is with our Node.js code or Gentle itself

$audioPath = "public\audio\module1-title.wav"
$script = "If you deploy on AWS and you're still clicking around in the console, you're wasting time and introducing risk."
$gentleUrl = "http://localhost:8765"

Write-Host "Testing Gentle with curl..."
Write-Host "Audio: $audioPath"
Write-Host "Script: $script"
Write-Host ""

# Test with curl
curl.exe -F "audio=@$audioPath" -F "transcript=$script" "$gentleUrl/transcriptions?async=false"
