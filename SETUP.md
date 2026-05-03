# Quick Start Guide

## 🚀 Getting Started in 5 Minutes

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Your KaraFun Server IP
Open `renderer.js` and find line 6:
```javascript
const API_BASE_URL = 'http://localhost:8080';
```

Replace `localhost` with your KaraFun machine's IP address:
```javascript
const API_BASE_URL = 'http://192.168.1.100:8080'; // Your actual IP
```

### 3. Run the App
```bash
npm start
```

The app will launch in a window.

### 4. Test It
- Queue should load within a few seconds
- You should see a "Connected" status at the bottom
- QR code should display in the top-left

## 🖥️ Using the App

### Toggle Fullscreen
**Right-click anywhere** in the app to toggle fullscreen/window mode.

### Understanding the Display

**Top Section (Header):**
- QR code to join the session
- Title

**Middle Section (Current Song):**
- Album artwork
- Song title, artist, singer name
- This is the song currently being sung

**Queue Section:**
- Numbered list of upcoming songs
- Each shows: song title, artist, who added it, album art
- If more than 8 songs, shows "+X more songs in queue"

**Bottom (Status):**
- Connection status (green = connected)
- Current time

## 🔧 Common Configuration Changes

### Change How Often It Updates
In `renderer.js`, find line 7:
```javascript
const POLL_INTERVAL = 3000; // 3 seconds
```
Change to:
- 5000 for 5-second updates (less network traffic)
- 1000 for 1-second updates (more responsive)

### Change Maximum Queue Display
In `renderer.js`, find line 8:
```javascript
const MAX_QUEUE_ITEMS = 8; // Show 8 songs max
```
Change to show more or fewer songs.

## 🔗 Finding Your KaraFun Server IP

**On the KaraFun machine:**
1. Check the Network settings
2. Look for the IP address (usually starts with 192.168 or 10.x)

**From another computer:**
1. Open Command Prompt
2. Run: `ipconfig` (Windows) or `ifconfig` (Mac/Linux)
3. Find KaraFun machine in your network

## ❌ Troubleshooting

### "Connection Error" status
- ❌ Check IP address is correct
- ❌ Verify KaraFun app is running
- ❌ Ensure both computers are on same network

### Queue shows "Loading queue..." forever
- ❌ Verify the IP address in `renderer.js`
- ❌ Open Developer Tools (F12) and check console for errors
- ❌ Try accessing `http://YOUR_IP:8080/remote/queue` directly in browser

### Album art not showing
- This is normal - just shows a music note icon
- If you want it to work, ensure KaraFun API returns image URLs

## 📦 Building for Production

When ready to deploy on your kiosk machine:

```bash
npm run build
```

This creates an executable you can run on any Windows machine without needing Node.js.

## 🎨 Customizing Colors

Edit `style.css` to change the vibrant colors. Look for the `:root` section at the top:
```css
:root {
  --primary: #ff1493;      /* Change these colors */
  --secondary: #00d4ff;
  /* etc */
}
```

## 📞 Getting Help

1. **Check the README.md** for detailed documentation
2. **Check the console** - Press F12 to see errors
3. **Review the configuration** - Make sure API_BASE_URL is correct

---

**Ready to go!** Your KaraFun queue display is now running. 🎤
