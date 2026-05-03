# Quick Reference Card

## 🚀 Getting Started (60 seconds)

```bash
npm install                    # Install dependencies
# Edit renderer.js line 6      # Update API_BASE_URL
npm start                      # Launch app
```

## 🎮 Using the App

| Action | Result |
|--------|--------|
| **Right-click** | Toggle fullscreen/window |
| **F12** | Open developer tools |
| **Auto-updates** | Every 3 seconds |

## 📱 App Sections

```
┌─────────────────────────┐
│  Header: QR + Title     │  ← Scan to join
├─────────────────────────┤
│  Current Song           │  ← Now Playing
│  (large + album cover)  │
├─────────────────────────┤
│  Queue List             │  ← Next songs
│  (numbered, scrollable) │
├─────────────────────────┤
│ Status | Time           │  ← Connection status
└─────────────────────────┘
```

## ⚙️ Configuration

**File:** `renderer.js`

```javascript
// Line 6: Your KaraFun server
const API_BASE_URL = 'http://192.168.1.100:8080';

// Line 7: Update frequency (milliseconds)
const POLL_INTERVAL = 3000;

// Line 8: Songs to show before "more"
const MAX_QUEUE_ITEMS = 8;
```

## 🎨 Styling

**File:** `style.css`

```css
/* Change colors at the top */
:root {
  --primary: #ff1493;        /* Pink */
  --secondary: #00d4ff;      /* Cyan */
  --accent: #9d00ff;         /* Purple */
}
```

## 📝 File Structure

```
karafun-queue-display/
├── main.js              ← Electron window
├── renderer.js          ← API logic (CONFIGURE HERE)
├── index.html           ← Page structure
├── style.css            ← Visual styling
├── preload.js           ← IPC security
├── package.json         ← Dependencies
├── README.md            ← Full docs
├── SETUP.md             ← Setup guide
├── API.md               ← API reference
└── DEPLOYMENT.md        ← Production guide
```

## 🔧 Common Tweaks

**Slower updates (less network):**
```javascript
const POLL_INTERVAL = 5000;  // 5 seconds
```

**Show more songs:**
```javascript
const MAX_QUEUE_ITEMS = 12;  // Show 12 instead of 8
```

**Start in fullscreen:**
Edit `main.js` line 12:
```javascript
fullscreen: true,  // instead of false
```

## 🐛 Troubleshooting

| Problem | Fix |
|---------|-----|
| "Connection Error" | Update IP in renderer.js line 6 |
| Queue stuck on "Loading" | Check IP is correct, KaraFun is running |
| No covers showing | Normal - KaraFun API may not include covers |
| Right-click not working | Check Electron version compatibility |

## 💻 Command Cheatsheet

```bash
npm install                 # Install all dependencies (one-time)
npm start                   # Launch app in development
npm run build               # Build portable .exe executable
npm run build-installer     # Build with installer option
npm run build-all           # Build all formats
npm update                  # Update packages
```

### Build Output
After `npm run build`, find executable at:
```
portable/KaraFun Queue Display-v1.0.0.exe
```

## 🌐 Network Test

```bash
# Test if KaraFun is accessible
ping 192.168.1.100
curl http://192.168.1.100:8080/remote/queue
```

## 📊 Expected API Response

```json
{
  "current": {
    "title": "Song Name",
    "artist": "Artist",
    "singer": "Singer Name",
    "cover": "http://image.jpg"
  },
  "queue": [
    {
      "title": "Next Song",
      "artist": "Artist",
      "singer": "Singer",
      "addedBy": "User Name",
      "cover": "http://image.jpg"
    }
  ]
}
```

## 🎯 Display Tips

| Scenario | Recommendation |
|----------|-----------------|
| Small monitor | `MAX_QUEUE_ITEMS = 5` |
| Large monitor | `MAX_QUEUE_ITEMS = 12` |
| Slow network | `POLL_INTERVAL = 5000` |
| Fast local | `POLL_INTERVAL = 2000` |

## 📚 Documentation Files

- **README.md** - Complete documentation
- **SETUP.md** - Step-by-step setup
- **API.md** - API endpoints and formats
- **DEPLOYMENT.md** - Production deployment guide
- **This file** - Quick reference

## 🎤 Feature Overview

✅ Real-time queue polling  
✅ Vibrant KaraFun styling  
✅ QR code for joining  
✅ Current song highlight  
✅ Album covers  
✅ Fullscreen toggle  
✅ Vertical monitor optimized  
✅ Auto-refresh  
✅ Large readable text  
✅ "X more songs" indicator  

## 🔐 Security Note

For kiosk/public display:
1. Comment out `mainWindow.webContents.openDevTools()` in main.js
2. Consider disabling right-click in renderer.js
3. Add auto-restart on crash

## 💡 Pro Tips

- **Test locally first** before deploying to kiosk
- **Use static IP** for KaraFun server
- **Keep polling interval ≥ 2 seconds** to avoid overloading
- **Enable fullscreen** for kiosk use
- **Create config file** for easy updates

## 📞 Need Help?

1. Check file headers for code comments
2. Search error in browser console (F12)
3. Review README.md or SETUP.md
4. Check API.md for API-related issues
5. See DEPLOYMENT.md for production issues

---

**Version:** 1.0.0  
**Last Updated:** May 2026  
**Tested on:** Windows 10/11, Electron 30.x
