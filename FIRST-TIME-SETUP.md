# First-Time Setup

Use this guide to set up KaraFun Queue Display on a machine for the first time.

## 1. Install Node.js

Install Node.js LTS from https://nodejs.org/.

Verify installation:

```bash
node --version
npm --version
```

## 2. Install Dependencies

From repository root:

```bash
cd c:\\Source\\karafun_queue_helper
npm install
```

## 3. Start the App

```bash
npm start
```

On startup, enter:

- Session ID or full KaraFun session URL
- Nickname for this display client

Examples:

- `272367`
- `https://www.karafun.com/272367/`

## 4. Verify Initial Connection

After joining a session, confirm:

- status reaches connected/session-joined state
- current song card updates
- queue updates as songs are added
- QR code matches the active session URL

## 5. Optional: Build a Standalone EXE

```bash
.\\portable\\build-portable.ps1
```

or

```bash
.\\portable\\build-portable.bat
```

## First-Run Troubleshooting

### Node or npm not recognized

- Restart terminal after installation
- Reinstall Node.js LTS if needed

### Session fails to connect

- Verify internet connectivity
- Confirm session is active in KaraFun
- Re-enter session ID/URL carefully

### Queue appears empty

- Make sure the session has songs queued
- Add a song from a client and wait for queue event

## Next Docs

- SETUP.md for ongoing usage and troubleshooting
- DEPLOYMENT.md for kiosk deployment
- API.md for protocol-level notes
