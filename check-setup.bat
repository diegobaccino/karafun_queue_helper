@echo off
REM KaraFun Queue Display - Setup Verification Script
REM This script checks if your system is ready to build the portable app

setlocal enabledelayedexpansion

echo.
echo ============================================
echo  KaraFun Build - Pre-Flight Check
echo ============================================
echo.

set READY=1

REM Check if Node.js is installed
where node >nul 2>nul
if errorlevel 1 (
    echo [X] Node.js - NOT INSTALLED
    echo    Download from: https://nodejs.org/
    set READY=0
) else (
    for /f "tokens=*" %%i in ('node --version') do set NODE_VERSION=%%i
    echo [+] Node.js - FOUND: %NODE_VERSION%
)

REM Check npm
where npm >nul 2>nul
if errorlevel 1 (
    echo [X] npm - NOT FOUND
    set READY=0
) else (
    for /f "tokens=*" %%i in ('npm --version') do set NPM_VERSION=%%i
    echo [+] npm - FOUND: %NPM_VERSION%
)

REM Check if node_modules exists
if exist node_modules (
    echo [+] Dependencies - INSTALLED
) else (
    echo [!] Dependencies - Not installed yet (will be installed on first build)
)

echo.

REM Check if portable folder exists
if exist portable (
    echo [+] Output folder - READY (portable\)
) else (
    echo [!] Output folder - Will be created on first build
)

echo.

if %READY% equ 1 (
    echo ============================================
    echo [✓] SYSTEM READY TO BUILD!
    echo ============================================
    echo.
    echo You can now run: build-portable.bat
    echo.
) else (
    echo ============================================
    echo [X] SYSTEM NOT READY
    echo ============================================
    echo.
    echo Please install the missing components above,
    echo then run this script again.
    echo.
)

pause
