@echo off
setlocal

cd /d "%~dp0"
set TARGET=%~dp0portable\build-portable.bat

if not exist "%TARGET%" (
  echo [!] Missing script: %TARGET%
  exit /b 1
)

call "%TARGET%"
exit /b %ERRORLEVEL%
