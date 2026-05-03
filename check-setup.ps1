#!/usr/bin/env pwsh

# KaraFun Queue Display - Setup Verification Script
# This script checks if your system is ready to build the portable app

Write-Host ""
Write-Host "============================================" -ForegroundColor Cyan
Write-Host "  KaraFun Build - Pre-Flight Check" -ForegroundColor Cyan
Write-Host "============================================" -ForegroundColor Cyan
Write-Host ""

$ready = $true

# Check if Node.js is installed
$nodeCheck = Get-Command node -ErrorAction SilentlyContinue
if (-not $nodeCheck) {
    Write-Host "[X] Node.js - NOT INSTALLED" -ForegroundColor Red
    Write-Host "    Download from: https://nodejs.org/" -ForegroundColor Yellow
    $ready = $false
} else {
    $nodeVersion = node --version
    Write-Host "[+] Node.js - FOUND: $nodeVersion" -ForegroundColor Green
}

# Check npm
$npmCheck = Get-Command npm -ErrorAction SilentlyContinue
if (-not $npmCheck) {
    Write-Host "[X] npm - NOT FOUND" -ForegroundColor Red
    $ready = $false
} else {
    $npmVersion = npm --version
    Write-Host "[+] npm - FOUND: $npmVersion" -ForegroundColor Green
}

# Check if node_modules exists
if (Test-Path node_modules) {
    Write-Host "[+] Dependencies - INSTALLED" -ForegroundColor Green
} else {
    Write-Host "[!] Dependencies - Not installed yet (will be installed on first build)" -ForegroundColor Yellow
}

# Check if portable folder exists
if (Test-Path portable) {
    Write-Host "[+] Output folder - READY (portable\)" -ForegroundColor Green
} else {
    Write-Host "[!] Output folder - Will be created on first build" -ForegroundColor Yellow
}

Write-Host ""

if ($ready) {
    Write-Host "============================================" -ForegroundColor Green
    Write-Host "[+] SYSTEM READY TO BUILD!" -ForegroundColor Green
    Write-Host "============================================" -ForegroundColor Green
    Write-Host ""
    Write-Host "You can now run:" -ForegroundColor Yellow
    Write-Host "  .\build-portable.ps1" -ForegroundColor Cyan
    Write-Host "  or" -ForegroundColor Cyan
    Write-Host "  build-portable.bat" -ForegroundColor Cyan
    Write-Host ""
} else {
    Write-Host "============================================" -ForegroundColor Red
    Write-Host "[X] SYSTEM NOT READY" -ForegroundColor Red
    Write-Host "============================================" -ForegroundColor Red
    Write-Host ""
    Write-Host "Please install the missing components above," -ForegroundColor Yellow
    Write-Host "then run this script again." -ForegroundColor Yellow
    Write-Host ""
}
