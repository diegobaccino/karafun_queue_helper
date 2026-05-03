# Documentation Index

Use this page as the documentation entrypoint.

## Canonical Docs

- README.md: public project overview and reuse context
- SETUP.md: install/run/troubleshooting
- FIRST-TIME-SETUP.md: first machine onboarding
- DEPLOYMENT.md: kiosk and production deployment
- CHECKLIST.md: go-live validation sheet
- API.md: protocol notes and integration details
- QUICK_REFERENCE.md: short operational reference

## Build Scripts

- portable/build-portable.ps1: primary PowerShell build script
- portable/build-portable.bat: primary batch build script
- build-portable.ps1: root wrapper
- build-portable.bat: root wrapper

## Historical Docs

These still contain older guidance and are kept as reference history:

- BUILD-PORTABLE.md
- BUILD-QUICK-START.md
- BUILD-SETUP-COMPLETE.md
- BUILD-SYSTEM.md

## Source Files

- main.js: Electron main process
- preload.js: IPC bridge
- renderer.js: KaraFun session protocol and UI state
- index.html: app layout and modal markup
- style.css: presentation layer
