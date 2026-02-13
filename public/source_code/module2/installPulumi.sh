// Install Pulumi CLI
// This is a code snippet from Module 2
// Note: This file may reference variables from other slides
// For a complete, runnable version, see index.ts in this directory

# macOS / Linux
curl -fsSL https://get.pulumi.com | sh

# Windows (PowerShell)
(New-Object Net.WebClient).DownloadFile(
  "https://get.pulumi.com/install.ps1",
  "$env:USERPROFILE\install-pulumi.ps1"
)
& "$env:USERPROFILE\install-pulumi.ps1"

# Verify installation
pulumi version