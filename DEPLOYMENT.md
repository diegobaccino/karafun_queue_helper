# Deployment & Installation Guide

This guide covers setting up the KaraFun Queue Display app for production use on a kiosk or dedicated display machine.

## System Requirements

- **OS:** Windows 7 or later (or Mac/Linux)
- **RAM:** 256 MB minimum (512 MB recommended)
- **Disk Space:** 300 MB for Electron and dependencies
- **Network:** Connection to KaraFun server (same network or LAN)
- **Display:** Vertical monitor or rotated display (1080x1920 recommended)

## Installation Steps

### Option 1: From Source (For Development)

**Step 1: Install Node.js**
- Download from https://nodejs.org/
- Install the LTS version (v18 or higher recommended)
- Verify installation:
  ```bash
  node --version
  npm --version
  ```

**Step 2: Clone/Download Project**
```bash
cd c:\Source\karafun_queue_helper
npm install
```

**Step 3: Configure**
Edit `renderer.js`:
```javascript
const API_BASE_URL = 'http://YOUR_KARAFUN_IP:8080';
```

**Step 4: Run**
```bash
npm start
```

### Option 2: Standalone Executable (For Production)

**Prerequisites:**
- Node.js installed (only needed for building)
- electron-builder (`npm install --save-dev electron-builder`)

**Build Steps:**

1. **Update package.json** - Add build configuration:
```json
"build": {
  "appId": "com.karafun.queue-display",
  "productName": "KaraFun Queue Display",
  "directories": {
    "buildResources": "assets",
    "output": "dist"
  },
  "files": [
    "**/*",
    "!**/*.pdb",
    "!**/node_modules/*/{CHANGELOG.md,README.md,README,readme.md,readme,*.map,*.md}"
  ],
  "win": {
    "target": ["nsis", "portable"],
    "icon": "assets/icon.ico"
  },
  "nsis": {
    "oneClick": false,
    "allowToChangeInstallationDirectory": true,
    "createDesktopShortcut": true,
    "createStartMenuShortcut": true
  }
}
```

2. **Add build script to package.json**:
```json
"scripts": {
  "start": "electron .",
  "build": "electron-builder"
}
```

3. **Create app icon** (optional):
- Place a 256x256 PNG at `assets/icon.png`
- Or download one and convert using tools like ImageMagick

4. **Build the app**:
```bash
npm run build
```

5. **Output files** in `dist/`:
- `KaraFun Queue Display Setup.exe` - Installer
- `KaraFun Queue Display.exe` - Portable (no installation needed)

## Deployment on Kiosk Machine

### Fresh Windows Installation

1. **Copy Files:**
   - Copy the executable from `dist/` to the kiosk machine
   - Or run the installer to install with Start Menu shortcuts

2. **Configure Network:**
   - Connect to same network as KaraFun server
   - Get KaraFun server IP address

3. **Update Configuration:**
   - Edit `renderer.js` (if running from source) or
   - Create a config file with your API endpoint

4. **Test Connection:**
   - Launch the app
   - Status should show "Connected" within a few seconds
   - Check that queue displays correctly

### Auto-Start on Boot (Windows)

**Using Startup Folder:**
1. Press `Win+R`, type: `shell:startup`
2. Create shortcut to `KaraFun Queue Display.exe`
3. App will launch automatically on boot

**Using Task Scheduler (Advanced):**
1. Open Task Scheduler
2. Create Basic Task:
   - Name: "KaraFun Queue Display"
   - Trigger: At startup
   - Action: Start program (`KaraFun Queue Display.exe`)
   - Advanced: Set to run even if user not logged in

### Display Settings

**For Vertical Monitor:**
1. Open Windows Display Settings
2. Find your kiosk monitor
3. Change orientation to "Portrait" or "Portrait (flipped)"
4. Set resolution to 1080x1920 (or native vertical resolution)
5. Apply settings

**For Rotated Display:**
- Rotate monitor physically
- Windows will auto-detect and adjust

### Fullscreen Mode

**Auto Fullscreen on Launch:**
Edit `main.js`:
```javascript
const win = new BrowserWindow({
  width: 1080,
  height: 1920,
  fullscreen: true,  // Change false to true
  // ...
});
```

**Manual Fullscreen:**
- Right-click anywhere in the app to toggle
- Press F11 (if not intercepted by Electron)

### Disable Exit

**Prevent Users from Closing App:**
Edit `main.js`:
```javascript
mainWindow.on('close', (event) => {
  event.preventDefault();
});
```

Note: Use Alt+F4 or Task Manager to force close.

## Configuration for Production

### API Endpoint

Before deployment, update the API URL in `renderer.js`:

```javascript
// Development
const API_BASE_URL = 'http://localhost:8080';

// Production
const API_BASE_URL = 'http://karafun.office.local:8080';
// or
const API_BASE_URL = 'http://192.168.1.50:8080';
```

### Update Interval

For smooth updates without network strain:
```javascript
const POLL_INTERVAL = 3000; // 3 seconds (good default)
```

### Queue Display Size

Control how many songs show before "more":
```javascript
const MAX_QUEUE_ITEMS = 8; // Adjust for your screen
```

## Network Connectivity

### LAN Setup (Recommended)

```
┌─────────────────┐
│  KaraFun PC     │ (192.168.1.50:8080)
└────────┬────────┘
         │
         │ Network Cable
         │
    [WiFi Router]
         │
         │
    ┌────┴──────────┐
    │  Kiosk Screen │ (192.168.1.100)
    └───────────────┘
```

1. Connect both machines to same router
2. Note KaraFun server IP: `192.168.1.50`
3. Update app configuration with this IP

### Internet Setup (If Remote)

If KaraFun is accessed over internet:
1. Get public IP or domain name
2. Use that in API_BASE_URL:
   ```javascript
   const API_BASE_URL = 'http://your-domain.com:8080';
   ```
3. Ensure firewall allows port 8080

## Monitoring & Maintenance

### Check Connection Status

The app shows status in bottom-left:
- **"Connected"** (green) - All good
- **"Connection Error"** (red) - Check network/server

### View Logs

For troubleshooting:
1. Press F12 to open Developer Tools
2. Go to Console tab
3. Look for error messages

### Common Issues

| Issue | Solution |
|-------|----------|
| App won't start | Verify Electron installation, check Node version |
| Connection error | Verify API URL, check firewall, ping KaraFun server |
| Queue not updating | Check network connectivity, verify API endpoint |
| No album art | Ensure KaraFun has covers, check image URLs |

## Performance Tuning

### For Slow Networks

Increase polling interval:
```javascript
const POLL_INTERVAL = 5000; // 5 seconds instead of 3
```

### For Large Queues

Reduce display items:
```javascript
const MAX_QUEUE_ITEMS = 5; // Show only 5 instead of 8
```

### For Low-End Hardware

Disable animations in `style.css`:
```css
.queue-item {
  transition: none; /* Remove animation */
}
```

## Updates

### Check for Updates Manually

1. Download latest version
2. Replace executable or reinstall
3. No data loss - configuration stored separately

### For Future Electron Versions

Update in package.json:
```json
"devDependencies": {
  "electron": "^30.0.0"  // Update version number
}
```

Then rebuild:
```bash
npm install
npm run build
```

## Security Considerations

### For Kiosk Use

1. **Prevent Settings Access:**
   - Disable right-click context menu (already done)
   - Hide Dev Tools (F12) in production

2. **To Hide Dev Tools:**
   Edit `main.js`:
   ```javascript
   // mainWindow.webContents.openDevTools(); // Comment this out
   ```

3. **Lock Down System:**
   - Use kiosk mode in Windows
   - Disable task bar
   - Restrict access to file system

4. **Network Security:**
   - Use HTTPS if possible
   - Firewall rules to allow only necessary ports
   - Strong password on KaraFun server

## Troubleshooting Deployment

### App crashes on startup
```bash
# Try running from command line to see error
"C:\Path\To\KaraFun Queue Display.exe"
```

### Can't connect to KaraFun server
1. Test network connectivity:
   ```bash
   ping 192.168.1.50
   ```

2. Test API directly:
   ```bash
   curl http://192.168.1.50:8080/remote/queue
   ```

### Display orientation wrong
- Check Windows Display Settings
- Ensure monitor is properly rotated
- May need to restart app after rotation

### Memory usage grows over time
- Normal for Electron apps
- If excessive (>500MB), restart app

## Support & Help

- Check `README.md` for general documentation
- Check `SETUP.md` for quick start
- Check `API.md` for API details
- Review `renderer.js` comments for code details

---

**Deployment Date:** [YYYY-MM-DD]  
**KaraFun Server:** [IP Address]  
**Last Updated:** May 2026
