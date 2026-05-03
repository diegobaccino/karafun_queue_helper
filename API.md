# KaraFun API Documentation

This document describes the KaraFun Remote API endpoints used by the Queue Display app.

## Base URL

```
http://<KARAFUN_SERVER_IP>:8080
```

Replace `<KARAFUN_SERVER_IP>` with the IP address of your KaraFun machine.

## Endpoints

### 1. Get Queue

**Endpoint:** `GET /remote/queue`

**Description:** Retrieves the current song and upcoming queue.

**Request:**
```bash
curl http://192.168.1.100:8080/remote/queue
```

**Response Format:**
```json
{
  "current": {
    "id": "12345",
    "title": "Song Title",
    "artist": "Artist Name",
    "album": "Album Name",
    "singer": "Singer Name",
    "addedBy": "Person Who Added It",
    "cover": "http://url-to-cover.jpg",
    "coverUrl": "http://url-to-cover.jpg",
    "duration": 180,
    "position": 45,
    "key": "C",
    "year": 2020
  },
  "queue": [
    {
      "id": "12346",
      "title": "Next Song",
      "artist": "Artist Name",
      "album": "Album Name",
      "singer": "Singer Name",
      "addedBy": "Another Person",
      "cover": "http://url-to-cover.jpg",
      "duration": 200
    },
    {
      "id": "12347",
      "title": "Third Song",
      "artist": "Artist Name",
      "singer": "Someone Else",
      "addedBy": "Another Person",
      "cover": "http://url-to-cover.jpg"
    }
  ]
}
```

**Response Fields:**

| Field | Type | Description |
|-------|------|-------------|
| `current` | Object | Currently playing song |
| `current.id` | String | Unique song ID |
| `current.title` | String | Song title |
| `current.artist` | String | Artist/performer name |
| `current.album` | String | Album name |
| `current.singer` | String | Name of person singing |
| `current.addedBy` | String | Name of person who added to queue |
| `current.cover` | String | URL to album cover image |
| `current.coverUrl` | String | Alternative cover URL (use if cover is null) |
| `current.duration` | Number | Song duration in seconds |
| `current.position` | Number | Current playback position in seconds |
| `current.key` | String | Musical key (e.g., "C", "G#") |
| `current.year` | Number | Year song was released |
| `queue` | Array | Array of upcoming songs |
| `queue[].id` | String | Song ID |
| `queue[].title` | String | Song title |
| `queue[].artist` | String | Artist name |
| `queue[].album` | String | Album name (optional) |
| `queue[].singer` | String | Singer name |
| `queue[].addedBy` | String | Person who added it |
| `queue[].cover` | String | Cover image URL |
| `queue[].duration` | Number | Song duration in seconds |

### 2. Get Session Info

**Endpoint:** `GET /remote/session`

**Description:** Retrieves session information including join URLs.

**Response Format:**
```json
{
  "id": "session-123",
  "name": "My Karaoke Party",
  "port": 8080,
  "sessionCode": "ABC123",
  "joinUrl": "http://192.168.1.100:8080/remote",
  "qrCode": "..."
}
```

## Expected Data Structure in App

The app expects the `/remote/queue` endpoint to return at minimum:

```json
{
  "current": {
    "title": "Current Song Title",
    "artist": "Artist Name",
    "singer": "Singer Name",
    "cover": "http://path-to-image.jpg"
  },
  "queue": [
    {
      "title": "Song 1",
      "artist": "Artist 1",
      "singer": "Singer 1",
      "addedBy": "User 1",
      "cover": "http://path-to-image.jpg"
    }
  ]
}
```

## Fallback Behavior

The app handles missing fields gracefully:

| Missing Field | Fallback |
|---------------|----------|
| `current.cover` | Music note icon (♪) |
| `current.artist` | Empty string |
| `current.singer` | "Unknown" |
| `queue[].cover` | Music note icon (♪) |
| `queue[].artist` | Empty string |
| `queue[].addedBy` | Empty string |

## Testing the API

### Using cURL
```bash
# Test connection
curl -v http://192.168.1.100:8080/remote/queue

# Pretty-print response (on Windows with jq installed)
curl http://192.168.1.100:8080/remote/queue | jq .
```

### Using Browser
Visit: `http://192.168.1.100:8080/remote/queue` in your web browser

### Using the App
1. Check the status bar (bottom of window)
2. If it says "Connected", the API is working
3. Check Developer Tools (F12 → Console) for errors

## Common Issues

### 404 Not Found
- API endpoint doesn't exist
- KaraFun version might not support Remote API
- Check KaraFun is running and accessible

### Connection Refused
- KaraFun server not running
- Wrong IP address
- Port 8080 is blocked by firewall

### Invalid JSON Response
- Server returned HTML error page instead of JSON
- Check KaraFun error logs
- Verify API endpoint is correct

### Missing Album Covers
- Covers are optional in API
- App displays music note placeholder
- Ensure KaraFun has covers configured

## CORS Headers

If accessing from a different origin, ensure your KaraFun server includes:
```
Access-Control-Allow-Origin: *
```

## API Response Times

- Expected response time: < 100ms
- Polling interval in app: 3000ms (configurable)
- Recommended: Keep polling interval ≥ 2000ms to avoid server load

## Future Endpoints (Not Yet Implemented)

These endpoints may be available in future KaraFun versions:

- `GET /remote/session` - Session information
- `GET /remote/history` - Historical songs played
- `POST /remote/queue` - Add songs to queue
- `DELETE /remote/queue/:id` - Remove songs
- `PUT /remote/queue/:id` - Update song

## Version Compatibility

This app is designed for KaraFun Remote API v1.x

For API version compatibility, check your KaraFun installation for version information.

---

**Last Updated:** May 2026
