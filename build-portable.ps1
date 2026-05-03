#!/usr/bin/env pwsh

# KaraFun Queue Display - Portable Build Script
# This script builds a standalone .exe executable

Write-Host ""
Write-Host "============================================" -ForegroundColor Cyan
Write-Host "  KaraFun Queue Display - Build Portable EXE" -ForegroundColor Cyan
Write-Host "============================================" -ForegroundColor Cyan
Write-Host ""

# Check if Node.js is installed
$nodeCheck = Get-Command node -ErrorAction SilentlyContinue
if (-not $nodeCheck) {
    Write-Host "[!] ERROR: Node.js is not installed!" -ForegroundColor Red
    Write-Host ""
    Write-Host "This script can download Node.js LTS and launch the installer now." -ForegroundColor Yellow
    Write-Host ""

    $installNow = Read-Host "Download and launch Node.js installer now? [Y/N]"
    if ($installNow -notmatch '^(y|yes)$') {
        Write-Host "Install cancelled. Please install manually from: https://nodejs.org/" -ForegroundColor Yellow
        Write-Host "Then run this script again." -ForegroundColor Yellow
        Read-Host "Press Enter to exit"
        exit 1
    }

    try {
        Write-Host "Downloading latest Node.js LTS installer..." -ForegroundColor Yellow
        $index = Invoke-RestMethod -Uri "https://nodejs.org/dist/index.json"
        $ltsRelease = $index | Where-Object { $_.lts -ne $false } | Select-Object -First 1
        if (-not $ltsRelease) {
            throw "No LTS release found."
        }

        $msiName = "node-$($ltsRelease.version)-x64.msi"
        $msiUrl = "https://nodejs.org/dist/$($ltsRelease.version)/$msiName"
        $msiPath = Join-Path $env:TEMP $msiName

        # Some environments download an HTML error page instead of an MSI.
        # Force TLS 1.2 and validate MSI signature before launching.
        [Net.ServicePointManager]::SecurityProtocol = [Net.SecurityProtocolType]::Tls12

        $downloadPath = "$msiPath.download"
        if (Test-Path $downloadPath) { Remove-Item -Force $downloadPath }

        Invoke-WebRequest -Uri $msiUrl -OutFile $downloadPath -MaximumRedirection 5 -UseBasicParsing

        if (-not (Test-Path $downloadPath)) {
            throw "Download failed: installer file was not created."
        }

        $file = Get-Item $downloadPath
        if ($file.Length -lt 10MB) {
            $preview = (Get-Content -Path $downloadPath -TotalCount 1 -ErrorAction SilentlyContinue)
            throw "Downloaded file is too small to be a valid Node MSI ($($file.Length) bytes). It may be a network/proxy error page. Preview: $preview"
        }

        $sigBytes = Get-Content -Path $downloadPath -Encoding Byte -TotalCount 8
        $sigHex = ($sigBytes | ForEach-Object { $_.ToString('X2') }) -join ''
        if ($sigHex -ne 'D0CF11E0A1B11AE1') {
            $preview = (Get-Content -Path $downloadPath -TotalCount 1 -ErrorAction SilentlyContinue)
            throw "Downloaded file is not a valid MSI (signature: $sigHex). It may be a network/proxy HTML response. Preview: $preview"
        }

        Move-Item -Force $downloadPath $msiPath
        Write-Host "Downloaded and validated: $msiPath" -ForegroundColor Green

        Write-Host "Launching Node.js installer..." -ForegroundColor Yellow
        $proc = Start-Process -FilePath "msiexec.exe" -ArgumentList @('/i', $msiPath) -Wait -PassThru
        if ($proc.ExitCode -ne 0) {
            throw "Node.js installer exited with code $($proc.ExitCode)."
        }

        Write-Host "" 
        Write-Host "Installer finished." -ForegroundColor Green
        Write-Host "Please close and reopen your terminal, then run this script again." -ForegroundColor Yellow
        Read-Host "Press Enter to exit"
        exit 1
    }
    catch {
        Write-Host "[!] Failed to download or launch Node.js installer." -ForegroundColor Red
        Write-Host "Please install manually from: https://nodejs.org/" -ForegroundColor Yellow
        Write-Host "Error: $($_.Exception.Message)" -ForegroundColor DarkYellow
        Read-Host "Press Enter to exit"
        exit 1
    }
}

# Get Node.js and npm versions
$nodeVersion = node --version
$npmVersion = npm --version
Write-Host "[+] Node.js found: $nodeVersion" -ForegroundColor Green
Write-Host "[+] npm found: $npmVersion" -ForegroundColor Green
Write-Host ""

# Check if npm is accessible
$npmCheck = Get-Command npm -ErrorAction SilentlyContinue
if (-not $npmCheck) {
    Write-Host "[!] ERROR: npm is not found!" -ForegroundColor Red
    Write-Host ""
    Write-Host "npm should be installed with Node.js." -ForegroundColor Yellow
    Write-Host "Try restarting your terminal or computer." -ForegroundColor Yellow
    Write-Host ""
    Read-Host "Press Enter to exit"
    exit 1
}

# Check if node_modules exists
if (-not (Test-Path node_modules)) {
    Write-Host "[1/3] Installing dependencies..." -ForegroundColor Yellow
    Write-Host "This may take a few minutes on first run." -ForegroundColor DarkYellow
    npm install --no-audit --no-fund --no-progress --loglevel=warn
    if ($LASTEXITCODE -ne 0) {
        Write-Host "[!] Error: npm install failed" -ForegroundColor Red
        Write-Host "Please check your internet connection and try again." -ForegroundColor Yellow
        Read-Host "Press Enter to exit"
        exit 1
    }
    Write-Host "[+] Dependencies installed successfully" -ForegroundColor Green
} else {
    Write-Host "[1/3] Dependencies already installed" -ForegroundColor Green
}

Write-Host ""
Write-Host "[2/3] Building portable executable..." -ForegroundColor Yellow
npm run build
if ($LASTEXITCODE -ne 0) {
    Write-Host "[!] Error: Build failed" -ForegroundColor Red
    Write-Host "Check the error messages above for details." -ForegroundColor Yellow
    Read-Host "Press Enter to exit"
    exit 1
}

Write-Host ""
Write-Host "[3/3] Build complete!" -ForegroundColor Green
Write-Host ""
Write-Host "============================================" -ForegroundColor Green
Write-Host "[+] SUCCESS!" -ForegroundColor Green
Write-Host "============================================" -ForegroundColor Green
Write-Host ""

# Check if portable folder exists and list files
if (Test-Path portable) {
    Write-Host "Output location: portable\" -ForegroundColor Yellow
    Write-Host ""
    Get-ChildItem portable\*.exe | ForEach-Object { Write-Host "  $($_.Name)" }
    Write-Host ""
    Write-Host "To run the app:" -ForegroundColor Yellow
    Write-Host "  .\portable\KaraFun\ Queue\ Display-v*.exe" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "To share:" -ForegroundColor Yellow
    Write-Host "  Copy the .exe file to any Windows machine (Windows 7+)" -ForegroundColor Cyan
    Write-Host "  No installation needed - just double-click to run!" -ForegroundColor Cyan
    Write-Host ""
}

Write-Host "For more information, see: BUILD-QUICK-START.md" -ForegroundColor Cyan
Write-Host ""

Write-Host ""
