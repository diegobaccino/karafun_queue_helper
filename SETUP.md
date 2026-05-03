# Setup Guide

This guide gets you from clone to running display.

## 1. Prerequisites

- Windows 10/11
- Node.js 18+
- npm (included with Node.js)

## 2. Install Dependencies

```bash
npm install
```

## 3. Start the App

```bash
npm start
```

## 4. Join a Session

On first launch, the app prompts for:

- Session ID or KaraFun URL
- Nickname for the display client

Examples:

- 272367
- https://www.karafun.com/272367/

## 5. Verify Live Data

Expected behavior after connecting:

- Status changes to connected/session joined
- Current song card updates when queue changes
- Upcoming queue list refreshes live
- QR code points to the same session URL

## Fullscreen and Display

- Right-click to toggle fullscreen/windowed mode
- Entering fullscreen hides menu bar
- Leaving fullscreen restores menu bar

## Troubleshooting

### Invalid session ID or URL

- Use numeric ID or full KaraFun URL
- Remove extra spaces

### Fails to connect

- Check internet access
- Verify session is active in KaraFun
- Try reconnecting with Change Session

### Connected but no songs show

- Queue may be empty
- Add songs from a client and wait for QueueEvent

### Artwork missing

- Artwork hydration is best-effort and non-fatal
- Queue remains usable without covers

### Added by missing

- KaraFun payload may omit user identity fields
- UI intentionally hides this line when unavailable

## Build Portable

Use either wrapper or portable scripts:

- .\build-portable.ps1
- .\build-portable.bat
- .\portable\build-portable.ps1
- .\portable\build-portable.bat
