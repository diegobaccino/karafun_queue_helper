@echo off
setlocal

cd /d "%~dp0.."

echo.
echo ============================================
echo  KaraFun Queue Display - Build Portable EXE
echo ============================================
echo.

echo Launching PowerShell build script...
powershell -NoProfile -ExecutionPolicy Bypass -File "%~dp0build-portable.ps1"
set EXIT_CODE=%ERRORLEVEL%

echo.
if %EXIT_CODE% neq 0 (
  echo [!] Build failed with exit code %EXIT_CODE%.
) else (
  echo [+] Build finished successfully.
)

exit /b %EXIT_CODE%
