# API and Protocol Notes

This project follows KaraFun web session behavior.

It does not use a local 8080 API, polling loop, or Socket.IO client library.

## Session Input

Accepted user input:

- Numeric session ID (4-10 digits)
- Full KaraFun session URL

Parsing helper: parseSessionId in renderer.js

## Session Bootstrap

1. GET https://www.karafun.com/<session>/
2. Extract Settings = {...}; from HTML
3. Parse JSON and use Settings.kcs_url as the WebSocket endpoint

If Settings.kcs_url is missing, connection cannot continue.

## WebSocket Transport

- URL: Settings.kcs_url
- Subprotocol: kcpj~v2+emuping
- Message format: JSON { id, type, payload }

### Required handshake/runtime behavior

- On open: send remote.UpdateUsernameRequest
- On core.PingRequest: send core.PingResponse with same id
- Queue updates come through remote.QueueEvent
- Session state updates come through remote.StatusEvent

## Queue Normalization

Raw queue items are normalized to:

```json
{
  "id": "string",
  "title": "string",
  "artist": "string",
  "singer": "string",
  "coverUrl": "string"
}
```

Notes:

- singer is best-effort based on available fields in events
- missing singer values are hidden in UI

## Artwork Hydration

Queue events alone may not include reliable artwork URLs.

The app requests artwork details via:

- Method: POST
- URL: https://www.karafun.com/<session>/?type=queueData
- Body: FormData with keys songIds, quizIds, communityIds

Expected response: array entries with songId and img.

The app maps img by songId and re-renders queue/current card when updates arrive.

## Error States

- Invalid session input: prompt user to correct ID/URL
- Session page fetch fails: show HTTP error state
- Missing kcs_url: stop with status message
- WebSocket close/error: show disconnected/error status
- Artwork fetch failure: ignored (non-fatal)

## Legacy Note

Older documents in this repo may still mention localhost :8080 endpoints.
Those are historical and are not used by the current implementation.
