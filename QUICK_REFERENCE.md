# Quick Reference

## Run

```bash
npm install
npm start
```

## Session Input

- ID format: 4-10 digits
- URL format: https://www.karafun.com/<session>/

## Controls

- Right-click: toggle fullscreen
- Change Session button: re-open join modal

## Build Portable

```bash
npm run build-portable
```

or

```bash
.\portable\build-portable.bat
```

## Key Runtime Constants

In renderer.js:

- MAX_QUEUE_ITEMS: max upcoming songs displayed
- KARAFUN_HOST: base host (default https://www.karafun.com)
- KARAFUN_WS_PROTOCOL: required WebSocket subprotocol

## Connection Status Meanings

- Connecting to session...: bootstrap started
- Authenticating...: WebSocket opened
- Session joined: username update accepted
- Live queue connected: queue events received
- Disconnected/Error: session dropped or network issue

## Known Limits

- KaraFun queue events may not include stable user labels
- Added by line is hidden when data is missing
- Artwork is improved via queueData but still depends on upstream metadata

## Primary Docs

- README.md: overview
- SETUP.md: setup and troubleshooting
- API.md: protocol details
- INDEX.md: documentation map
