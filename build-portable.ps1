#!/usr/bin/env pwsh

$scriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
$target = Join-Path $scriptDir "portable\build-portable.ps1"

if (-not (Test-Path $target)) {
  Write-Host "[!] Missing script: $target" -ForegroundColor Red
  exit 1
}

& $target
exit $LASTEXITCODE
