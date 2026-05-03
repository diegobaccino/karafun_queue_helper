# KaraFun Queue Display

A fullscreen Electron app that displays the KaraFun karaoke queue on a vertical monitor with a vibrant, modern UI optimized for kiosk/display use.

## Features

✨ **Vibrant Design** - KaraFun-inspired color palette with bright purples, pinks, and cyans  
🎵 **Real-time Queue Updates** - Automatically polls the queue every 3 seconds  
📱 **QR Code** - Displays QR code for easy session joining  
🎤 **Current Song Display** - Prominently shows the currently playing song with album art  
📊 **Smart Queue Display** - Shows large queue items with "X more songs" if needed  
🖥️ **Fullscreen Toggle** - Right-click to toggle between fullscreen and windowed mode  
🔄 **Auto-refresh** - Constantly updates without manual refresh  
📲 **Vertical Optimized** - Designed specifically for tall/vertical monitors  
📍 **Song Metadata** - Displays song name, artist, album art, and who added it  

## Installation

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn

### Setup

1. **Navigate to project directory:**
   ```bash
   cd c:\Source\karafun_queue_helper
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure API Endpoint:**
   Edit `renderer.js` and update the API configuration at the top:
   ```javascript
   const API_BASE_URL = 'http://YOUR_KARAFUN_SERVER_IP:8080';
   ```
   Replace `YOUR_KARAFUN_SERVER_IP` with the actual IP address of your KaraFun machine.

## Running the App

### Development Mode
```bash
npm start
```

### Build for Production
```bash
npm run build
```

## Usage

- **Toggle Fullscreen:** Right-click anywhere in the app
- **View Queue:** Scroll through the queue display
- **QR Code:** Scan the QR code in the header to join the session
- **Auto-refresh:** The queue automatically updates every 3 seconds

## Configuration

### API Endpoint
The app fetches queue data from: `http://YOUR_SERVER:8080/remote/queue`

Expected JSON response format:
```json
{
  "current": {
    "title": "Song Title",
    "artist": "Artist Name",
    "singer": "Singer Name",
    "cover": "http://url-to-cover.jpg"
  },
  "queue": [
    {
      "title": "Next Song",
      "artist": "Artist Name",
      "singer": "Singer Name",
      "cover": "http://url-to-cover.jpg"
    }
  ]
}
```

### Display Settings
Edit constants in `renderer.js`:
- `POLL_INTERVAL` - How often to refresh (in milliseconds)
- `MAX_QUEUE_ITEMS` - Maximum songs to display before showing "more" message

## Window Size
Default window size is 1080x1920 (designed for vertical monitors). Modify in `main.js`:
```javascript
mainWindow = new BrowserWindow({
  width: 1080,
  height: 1920,
  // ...
});
```

## Keyboard Shortcuts
- **Right-click** - Toggle fullscreen/window mode
- **F12** - Open Developer Tools (in dev mode)

## API Compatibility

This app supports KaraFun Remote API. Ensure your KaraFun machine is:
- Running with Remote API enabled
- Accessible on the network at the configured IP address
- Port 8080 is open

## Troubleshooting

### Connection Error
- **Issue:** "Connection Error" status displayed
- **Solution:** 
  1. Check the `API_BASE_URL` in `renderer.js` is correct
  2. Verify KaraFun server is running and accessible
  3. Ensure network connectivity
  4. Check firewall settings

### Queue Not Updating
- **Issue:** Queue shows "Loading queue..." indefinitely
- **Solution:**
  1. Open Developer Tools (F12) and check console for errors
  2. Verify the API endpoint returns valid JSON
  3. Check network requests in DevTools

### QR Code Not Displaying
- **Issue:** QR code box is empty
- **Solution:**
  1. The app uses a public QR generation API - ensure internet access
  2. Check browser console for any error messages

### Album Art Not Loading
- **Issue:** Song covers showing as music note instead of artwork
- **Solution:**
  1. Verify the KaraFun API returns valid cover image URLs
  2. Check that image URLs are accessible
  3. Check CORS settings if using remote server

## Project Structure

```
karafun-queue-display/
├── main.js              # Electron main process
├── preload.js           # IPC bridge between main and renderer
├── index.html           # UI layout
├── renderer.js          # UI logic and API integration
├── style.css            # Vibrant styling
├── package.json         # Dependencies
└── README.md            # This file
```

## Technologies

- **Electron** - Desktop app framework
- **HTML5/CSS3** - Modern web UI
- **JavaScript** - App logic
- **Fetch API** - HTTP requests to KaraFun API

## Performance Notes

- The app polls every 3 seconds - adjust `POLL_INTERVAL` if needed
- Large queue displays are limited to 8 items to maintain readability
- CSS animations run smoothly on vertical monitors
- Memory footprint is minimal (~150MB)

## License

This project is built for personal use with KaraFun.

## Support

For issues with:
- **KaraFun API:** Contact KaraFun support
- **This app:** Check the troubleshooting section above

---

Built with ❤️ for KaraFun queue displays
