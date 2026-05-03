#!/usr/bin/env pwsh

Write-Host ""
Write-Host "============================================" -ForegroundColor Cyan
Write-Host "  KaraFun Queue Display - Build Portable EXE" -ForegroundColor Cyan
Write-Host "============================================" -ForegroundColor Cyan
Write-Host ""

$scriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
$repoRoot = Resolve-Path (Join-Path $scriptDir "..")
Set-Location $repoRoot

$nodeCheck = Get-Command node -ErrorAction SilentlyContinue
if (-not $nodeCheck) {
    Write-Host "[!] ERROR: Node.js is not installed." -ForegroundColor Red
    Write-Host "Install Node.js from https://nodejs.org/ and run again." -ForegroundColor Yellow
    exit 1
}

Write-Host "[+] Node.js found: $(node --version)" -ForegroundColor Green
Write-Host "[+] npm found: $(npm --version)" -ForegroundColor Green
Write-Host ""

if (-not (Test-Path node_modules)) {
    Write-Host "[1/4] Installing dependencies..." -ForegroundColor Yellow
    npm.cmd install --no-audit --no-fund --no-progress --loglevel=warn
    if ($LASTEXITCODE -ne 0) {
        Write-Host "[!] Error: npm install failed" -ForegroundColor Red
        exit 1
    }
} else {
    Write-Host "[1/4] Dependencies already installed" -ForegroundColor Green
}

$defaultOut = Join-Path $repoRoot "portable"
Write-Host ""
Write-Host "Output folder prompt" -ForegroundColor Cyan
Write-Host "Press Enter to use default: $defaultOut" -ForegroundColor DarkCyan
$outInput = Read-Host "Build output folder"

if ([string]::IsNullOrWhiteSpace($outInput)) {
    $buildOutput = $defaultOut
} else {
    $resolved = [Environment]::ExpandEnvironmentVariables($outInput.Trim())
    if ([System.IO.Path]::IsPathRooted($resolved)) {
        $buildOutput = $resolved
    } else {
        $buildOutput = Join-Path $repoRoot $resolved
    }
}

New-Item -ItemType Directory -Force -Path $buildOutput | Out-Null

Write-Host ""
Write-Host "[2/4] Building portable executable..." -ForegroundColor Yellow
npx.cmd electron-builder --win portable --config.directories.output="$buildOutput" --config.win.signAndEditExecutable=false --config.win.verifyUpdateCodeSignature=false
if ($LASTEXITCODE -ne 0) {
    Write-Host "[!] Error: Build failed" -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "[3/4] Build output:" -ForegroundColor Green
Get-ChildItem $buildOutput | Select-Object Name,Length,LastWriteTime | Format-Table -AutoSize

Write-Host ""
Write-Host "[4/4] Done." -ForegroundColor Green
Write-Host "Output folder: $buildOutput" -ForegroundColor Cyan
