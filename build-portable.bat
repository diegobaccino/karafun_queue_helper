@echo off
setlocal

REM Always run from this script's directory
cd /d "%~dp0"

echo.
echo ============================================
echo  KaraFun Queue Display - Build Portable EXE
echo ============================================
echo.

REM Check if Node.js is installed
node --version >nul 2>&1
if errorlevel 1 (
    echo [!] ERROR: Node.js is not installed!
    echo.
    echo Switching to PowerShell bootstrap for Node.js installation...
    powershell -NoProfile -ExecutionPolicy Bypass -File "%~dp0build-portable.ps1"
    echo.
    echo Re-run this script after Node.js installation completes.
    pause
    exit /b 1
)

REM Get Node.js version
for /f "tokens=*" %%A in ('node --version') do set NODE_VER=%%A
echo [+] Node.js found: %NODE_VER%

REM Get npm version
for /f "tokens=*" %%A in ('npm --version') do set NPM_VER=%%A
echo [+] npm found: %NPM_VER%
echo.

REM Install dependencies if needed
if not exist node_modules (
    echo [1/3] Installing dependencies...
    call npm install
    if errorlevel 1 (
        echo [!] Error: npm install failed
        echo Please check your internet connection and try again.
        pause
        exit /b 1
    )
    echo [+] Dependencies installed
) else (
    echo [1/3] Dependencies already installed
)

echo.
echo [2/3] Building portable executable...
call npm run build
if errorlevel 1 (
    echo [!] Error: Build failed
    pause
    exit /b 1
)

echo.
echo [3/3] Build complete!
echo.
echo ============================================
echo [+] SUCCESS!
echo ============================================
echo.

if exist portable (
    echo Output location: portable\
    echo.
    for %%F in (portable\*.exe) do echo   %%~nxF
    echo.
    echo To run: .\portable\KaraFun Queue Display-v*.exe
    echo.
)

pause
