# First-Time Setup Guide

**New to building the KaraFun Queue Display?** This guide walks you through everything step-by-step.

## What You Need

The only tool required is **Node.js** (which includes npm).

## Step 1: Install Node.js (5 minutes)

### Download
1. Go to: **https://nodejs.org/**
2. Click the big **LTS** button (green, on the left)
3. Save the installer

### Install
1. **Open** the downloaded installer
2. **Click Next** through the setup wizard
3. **Accept all defaults** - don't change anything
4. **Finish** the installation
5. **Important:** Restart your computer or terminal

### Verify Installation
Open **Command Prompt** or **PowerShell** and type:

```bash
node --version
npm --version
```

You should see version numbers like:
```
v18.16.0
9.6.7
```

If you see "command not found", restart your computer and try again.

## Step 2: Verify Your System (1 minute)

**Optional but recommended** - check if everything is ready:

```bash
# Windows Command Prompt or PowerShell:
check-setup.bat
# or
.\check-setup.ps1
```

This shows a checklist of what's installed.

**All green checkmarks?** → You're ready!

## Step 3: Build the Portable EXE (5-10 minutes)

### Easy Way: Use the Build Script

**Windows Command Prompt or Explorer:**
```bash
build-portable.bat
```

Or just **double-click** `build-portable.bat` in the folder.

**What it does:**
1. ✅ Checks for Node.js
2. ✅ Installs dependencies (first time only, 2-3 minutes)
3. ✅ Builds your app
4. ✅ Creates the .exe file

### Alternative: Use Commands

```bash
npm install
npm run build
```

## Step 4: Find Your Executable

After the build completes:

```
portable/
└── KaraFun Queue Display-v1.0.0.exe
```

**That's your app!** 🎉

## Step 5: Test It

```bash
# Run it
./portable/KaraFun\ Queue\ Display-v1.0.0.exe

# Or double-click it in Windows Explorer
```

You should see:
- App window opens
- "Connecting..." at the bottom
- Queue loads (if KaraFun server is running)

## Step 6: Share It

The `.exe` is ready to share!

```bash
# Copy to any Windows machine
copy portable\*.exe "C:\Users\YourName\Desktop"

# Or share via email, USB drive, cloud storage, etc.
```

**No installation needed** - just double-click to run!

---

## Troubleshooting

### "node: command not found" or "npm: command not found"

**Solution:**
1. Node.js might not be installed correctly
2. Download and install again: https://nodejs.org/
3. **Restart your computer**
4. Open a fresh terminal and try again

### Build is very slow (10+ minutes)

**Normal for first build** - downloading Electron takes time
- Don't interrupt it
- Subsequent builds are faster

### "npm install" fails

**Likely causes:**
- Internet connection issue
- Antivirus blocking downloads
- Disk space issue

**Try:**
```bash
npm install --no-audit
npm run build
```

### Build still failing?

1. **Read the error message** - it usually explains the problem
2. **Close and reopen** your terminal
3. **Try again** - sometimes it just needs a retry

### .exe file not created

1. Check if the build actually completed (look for success message)
2. Check `portable/` folder for any .exe files
3. Try `npm run build` again

---

## What Gets Built?

Your `.exe` includes everything:
- ✅ Full Electron application runtime
- ✅ Your HTML, CSS, JavaScript
- ✅ All dependencies (axios, etc.)
- ✅ Configuration (API URL, etc.)

**Result:** A standalone app that runs on Windows 7+!

---

## Customization Before Building

### Change API URL

Before building, edit `renderer.js` line 6:

```javascript
const API_BASE_URL = 'http://192.168.1.100:8080';
```

Then build - the URL is baked into the .exe.

### Add a Custom Icon

1. Create a 256x256+ image
2. Convert to `.ico` format (use https://icoconvert.com/)
3. Save as `assets/icon.ico`
4. Rebuild

The icon appears in Windows Explorer and taskbar.

### Change Version Number

Edit `package.json`:

```json
"version": "1.0.1"
```

Next build: `KaraFun Queue Display-v1.0.1.exe`

---

## Next Builds (Future Updates)

To rebuild with changes:

```bash
# Make code changes, then:
npm run build

# New .exe in portable/ folder
```

That's it! No need to reinstall anything.

---

## Common Questions

**Q: Do I need Node.js on every machine?**
A: No! Only on the machine you're building on. The .exe runs anywhere on Windows 7+.

**Q: Can I modify the code?**
A: Yes! Edit any file and rebuild. See [renderer.js](renderer.js) for the main logic.

**Q: Why is the .exe so large (150 MB)?**
A: It includes Electron's browser engine. This is normal - VS Code, Discord, etc. are also large.

**Q: Can I run it without Node.js installed?**
A: Yes! The .exe is standalone. Node.js only needed for building.

**Q: How do I uninstall?**
A: Just delete the .exe file!

---

## Next Steps

1. **Install Node.js** from https://nodejs.org/
2. **Restart your computer**
3. **Run:** `build-portable.bat`
4. **Find your app** in `portable/` folder
5. **Share it!**

---

## Getting Help

- **Setup help:** This guide!
- **Build details:** [BUILD-PORTABLE.md](BUILD-PORTABLE.md)
- **Quick start:** [BUILD-QUICK-START.md](BUILD-QUICK-START.md)
- **System overview:** [BUILD-SYSTEM.md](BUILD-SYSTEM.md)

---

**You got this!** 🚀

If anything seems confusing, the build scripts will guide you through it step-by-step.

---

**Last Updated:** May 2026
