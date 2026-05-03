# Deployment Guide

This guide covers production deployment of KaraFun Queue Display on a dedicated monitor or kiosk workstation.

## Recommended Deployment Model

Use a portable EXE built from this repository, then copy it to the target machine.
This avoids requiring Node.js on production endpoints.

## Prerequisites

- Windows 10/11 target machine
- Stable internet access
- Active KaraFun sessions available to join
- Portrait display recommended (1080x1920 target)

## Build a Production EXE

From repository root:

```bash
npm install
.\\portable\\build-portable.ps1
```

Alternative:

```bash
.\\portable\\build-portable.bat
```

The script prompts for output folder and defaults to `portable/`.

## Deploy to Target Machine

1. Copy EXE to target machine.
2. Launch app.
3. Enter session ID or full KaraFun session URL.
4. Enter nickname.
5. Confirm queue updates in real time.

## Kiosk Recommendations

- Toggle fullscreen with right-click.
- Use portrait orientation in Windows display settings.
- Disable sleep and lock during event hours.
- Use a dedicated local account for kiosk login.
- Add app shortcut to Startup folder for auto-launch.

Startup folder command:

```text
shell:startup
```

## Go-Live Validation

- App reaches connected/session-joined state
- Queue updates when songs are added/removed
- QR code opens the same session URL on mobile
- Fullscreen and menu behavior are correct

Use CHECKLIST.md for complete validation.

## Recovery During Events

If the display stops updating:

1. Click Change Session.
2. Re-enter session ID/URL.
3. Confirm internet connectivity.
4. Restart app if needed.

## Updating Deployed Machines

1. Pull latest repository.
2. Rebuild EXE.
3. Replace deployed EXE.
4. Smoke-test session join and live updates.

## Notes

- This project is not affiliated with or endorsed by KaraFun.
- Upstream protocol changes can require updates in this repository.
