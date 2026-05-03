# Pre-Launch Checklist

Use this checklist before running the KaraFun Queue Display app.

## ✅ System Setup

- [ ] Node.js installed (v14+)
  ```bash
  node --version  # Should show v14.0.0 or higher
  ```

- [ ] npm installed
  ```bash
  npm --version  # Should show 6.0.0 or higher
  ```

- [ ] Project dependencies installed
  ```bash
  npm install
  ```

- [ ] Network connectivity verified
  ```bash
  ping YOUR_KARAFUN_IP
  ```

## ✅ Configuration

- [ ] **API Base URL configured** - Edit `renderer.js` line 6
  ```javascript
  const API_BASE_URL = 'http://YOUR_KARAFUN_IP:8080';
  ```
  - [ ] Replaced `YOUR_KARAFUN_IP` with actual IP
  - [ ] Format is correct: `http://` not `https://`
  - [ ] Port is correct: `:8080`

- [ ] KaraFun server is accessible
  ```bash
  curl http://YOUR_KARAFUN_IP:8080/remote/queue
  # Should return JSON, not error
  ```

- [ ] KaraFun Remote API is enabled
  - [ ] Check KaraFun settings
  - [ ] API port 8080 is open
  - [ ] Both machines on same network

## ✅ Application Files

Verify all files exist:

- [ ] `main.js` - Electron main process
- [ ] `renderer.js` - UI and API logic
- [ ] `index.html` - Page structure
- [ ] `style.css` - Styling
- [ ] `preload.js` - IPC security
- [ ] `package.json` - Dependencies

## ✅ Display Setup

- [ ] Monitor is properly oriented
  - [ ] Vertical (1080x1920) or rotated
  - [ ] Windows Display Settings adjusted

- [ ] Resolution set correctly
  - [ ] 1080x1920 for standard
  - [ ] Or native vertical resolution

- [ ] No external monitors if fullscreen intended
  - [ ] Or configure for correct display

## ✅ Testing Before Launch

Run these tests in order:

### Test 1: Dependencies
```bash
npm list  # Should show all dependencies installed
```
- [ ] No errors in output
- [ ] All dependencies present

### Test 2: Launch App
```bash
npm start
```
- [ ] Window opens
- [ ] No crash on startup
- [ ] Window is proper size

### Test 3: API Connection
Once app is running:
- [ ] Status shows "Connected" (bottom left)
- [ ] Queue loads within 5 seconds
- [ ] Songs display with titles and artists

### Test 4: UI Rendering
- [ ] Current song displays clearly
- [ ] Album covers visible (or music note icons)
- [ ] Queue items numbered and readable
- [ ] QR code visible in top-left
- [ ] Text is large enough to read

### Test 5: Auto-Update
- [ ] Queue refreshes every 3-5 seconds
- [ ] Changes in queue are reflected
- [ ] No visual glitches during updates

### Test 6: Fullscreen Toggle
- [ ] Right-click the app
- [ ] App enters fullscreen mode
- [ ] Right-click again
- [ ] Returns to windowed mode

### Test 7: Scrolling (if needed)
- [ ] Mouse wheel scrolls queue
- [ ] Touch scroll works (if touchscreen)
- [ ] Scrollbar visible if needed
- [ ] Smooth scrolling

## ✅ Keyboard Shortcuts

Test these work:
- [ ] F12 - Developer tools open/close
- [ ] Alt+F4 - Close app
- [ ] F11 - Fullscreen (may not work due to Electron)

## ✅ Network Stability

- [ ] Connection remains stable for 5+ minutes
- [ ] No repeated "Connection Error" messages
- [ ] Queue updates consistently

## ✅ Performance

- [ ] App uses < 300MB RAM
  - [ ] Check in Task Manager
  - [ ] Ctrl+Shift+Esc → Find "KaraFun"

- [ ] CPU usage < 5% idle
- [ ] No freezing or stuttering
- [ ] Smooth animations

## ✅ Error Handling

Test error scenarios:
- [ ] Disconnect network - shows error
- [ ] Reconnect network - recovers to "Connected"
- [ ] Empty queue - displays appropriately
- [ ] Stop KaraFun - shows "Connection Error"
- [ ] No covers - shows music note icon

## ✅ Audio (Optional)

If adding audio later:
- [ ] Speakers/headphones connected
- [ ] Volume at appropriate level
- [ ] Audio doesn't interfere with display

## 🚀 Ready for Production?

Final checklist before deployment to kiosk:

- [ ] All configuration verified
- [ ] API URL correct for production server
- [ ] Connection test passed
- [ ] Display properly oriented
- [ ] All features working as expected
- [ ] Performance acceptable
- [ ] Error handling works

## 📋 Deployment Checklist

Before going live on kiosk machine:

- [ ] Executable built (if using standalone)
- [ ] Configuration updated for target server
- [ ] Network connectivity verified on kiosk machine
- [ ] Display resolution correct
- [ ] Auto-start configured (optional)
- [ ] Dev tools disabled (optional)
- [ ] Tested for at least 30 minutes

## 🔄 Post-Launch Verification

After deploying:

- [ ] App running on kiosk machine
- [ ] Displaying live queue correctly
- [ ] Updates happening in real-time
- [ ] QR code working for users to join
- [ ] No error messages on screen
- [ ] Performance stable over time

## 📝 Notes

Use this space to record your setup:

```
Date: ________________
KaraFun Server IP: ________________
KaraFun Server Name: ________________
Monitor Size: ________________
Network Type: ________________
Notes: 
_________________________________
_________________________________
```

## ❌ Troubleshooting Checklist

If something doesn't work:

1. [ ] Verify API URL is correct
   ```bash
   curl http://YOUR_IP:8080/remote/queue
   ```

2. [ ] Check network connectivity
   ```bash
   ping YOUR_IP
   ```

3. [ ] Verify KaraFun is running
   - [ ] Check KaraFun application is open
   - [ ] Check Remote API is enabled

4. [ ] Review console errors
   - [ ] Press F12
   - [ ] Click Console tab
   - [ ] Look for red error messages

5. [ ] Check firewall
   - [ ] Windows Defender may block port 8080
   - [ ] Add exception for KaraFun server

6. [ ] Restart app
   - [ ] Close completely
   - [ ] Reopen with `npm start`

7. [ ] Restart KaraFun server
   - [ ] Close KaraFun
   - [ ] Wait 10 seconds
   - [ ] Reopen KaraFun

8. [ ] Check documentation
   - [ ] README.md
   - [ ] SETUP.md
   - [ ] API.md

---

**Checklist Created:** [Date]  
**Verified By:** [Your Name]  
**Status:** ☐ Ready ☐ Issues Found (see notes)
