# KaraFun Queue Display

KaraFun Queue Display is an open-source Electron app that turns a live KaraFun session into a dedicated queue board for TVs and vertical monitors.

It is built for karaoke hosts, bars, events, and home setups that want a public-facing screen showing:

- what is singing now
- what is up next
- a QR code so guests can join instantly

## Why this project exists

The standard KaraFun mobile/web experience is great for participants, but hosts often need a persistent, room-visible queue display.
This project provides that display as a standalone desktop app that can be customized and reused.

## Features

- Join any live KaraFun session by session ID or URL
- Live queue updates from KaraFun WebSocket events
- Now Playing card plus upcoming queue list
- QR code linked to the active session URL
- Right-click fullscreen toggle for kiosk workflows
- Artwork hydration using queueData song metadata
- Graceful fallback when user identity fields are missing

## Runtime Overview

1. User enters session ID/URL and nickname
2. App requests `https://www.karafun.com/<session>/`
3. App extracts `Settings` JSON from session HTML
4. App opens WebSocket to `Settings.kcs_url` with subprotocol `kcpj~v2+emuping`
5. App responds to `core.PingRequest` messages
6. App sends `remote.UpdateUsernameRequest`
7. App listens for `remote.QueueEvent` and status events
8. App hydrates artwork via `POST /<session>/?type=queueData`

See API.md for low-level details.

## Requirements

- Windows 10/11
- Node.js 18+
- npm

## Quick Start

```bash
npm install
npm start
```

On startup, enter:

- Session ID (example: `272367`) or full KaraFun URL
- Nickname for this display client

## Build Portable EXE

Primary scripts:

- `portable/build-portable.ps1`
- `portable/build-portable.bat`

Root wrappers:

- `build-portable.ps1`
- `build-portable.bat`

## Public Reuse Notes

- This project is not an official KaraFun product.
- Upstream KaraFun protocol behavior may change over time.
- Contributions are welcome when they preserve current session compatibility.

## Project Structure

- `main.js`: Electron window lifecycle and fullscreen behavior
- `preload.js`: secure IPC bridge
- `renderer.js`: session protocol and UI state
- `index.html`: application markup
- `style.css`: visual system and responsive layout

## Documentation

- INDEX.md: documentation entrypoint
- SETUP.md: day-to-day setup and troubleshooting
- FIRST-TIME-SETUP.md: first machine onboarding
- DEPLOYMENT.md: production and kiosk deployment
- CHECKLIST.md: go-live validation
- API.md: protocol notes

## License

MIT
