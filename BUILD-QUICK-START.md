# 🔨 Building Your Portable Executable - Quick Start

> Status: Historical quick guide. Build commands are still useful, but runtime configuration sections may be outdated.
> For current session connection behavior, see README.md and API.md.

This guide will walk you through building a standalone `.exe` file from the KaraFun Queue Display app in **5 minutes**.

## What You Need

1. **Node.js** (v14 or later)
   - Download: https://nodejs.org/
   - Install the **LTS version**
   - Restart your terminal/computer after installation

That's it! No other tools needed.

## Building (3 Simple Steps)

### Step 1: Open Terminal/Command Prompt

Navigate to the project folder:
```bash
cd c:\Source\karafun_queue_helper
```

### Step 2: Install Dependencies

First time only - installs what's needed to build:
```bash
npm install
```

This takes 2-3 minutes. **Don't interrupt it.**

### Step 3: Build the Executable

```bash
npm run build
```

Or use our helper script (easier):

**Windows Command Prompt:**
```bash
build-portable.bat
```

**PowerShell:**
```powershell
.\build-portable.ps1
```

The helper scripts do the same thing but show progress and check for errors.

## Where's My Executable?

After the build completes (1-5 minutes), find it here:

```
c:\Source\karafun_queue_helper\portable\
    └── KaraFun Queue Display-v1.0.0.exe  ← Your app!
```

It's ready to use!

## Test It

```bash
# Option 1: Double-click the .exe in Windows Explorer
# Option 2: Run from terminal:
.\portable\KaraFun\ Queue\ Display-v1.0.0.exe
```

**Should see:**
- App window opens
- "Connecting..." status
- Queue loads (if KaraFun server is running)

## Share It

The `.exe` is completely standalone:
- Copy to any Windows machine (Windows 7+)
- No installation needed
- No dependencies
- Just double-click to run!

## Rebuilding in the Future

To build updated versions:

1. Make changes (config, styling, etc.)
2. Update version in `package.json` if desired
3. Run:
   ```bash
   npm run build
   ```
4. New executable in `portable/` folder

That's it!

## Customizing Before Build

### Change the API URL

Before building, edit `renderer.js` line 6:
```javascript
const API_BASE_URL = 'http://192.168.1.100:8080';  // Your server
```

Then rebuild - the URL is baked into the executable.

### Change Version Number

Edit `package.json`:
```json
"version": "1.0.1"
```

Next build will be `KaraFun Queue Display-v1.0.1.exe`

### Add Custom Icon (Optional)

1. Create a 256x256+ image or use a PNG converter
2. Save as `icon.ico` in the `assets` folder
3. Rebuild

The icon appears in Windows Explorer and taskbar.

## Troubleshooting

### "npm: command not found"
**Solution:** Node.js not installed or not in PATH
- Download and install: https://nodejs.org/
- Restart your terminal
- Try again

### Build is very slow (5+ minutes)
**Normal for first build** - downloading Electron (150 MB)
- Subsequent builds are faster (1-2 min)
- Don't interrupt the build

### "electron-builder not found"
```bash
npm install --save-dev electron-builder
npm run build
```

### Executable file is huge (~150 MB)
**This is normal.** Electron includes a full browser engine.
- Same size as all Electron apps (VS Code, Discord, etc.)
- Runs fast once started
- Can't be significantly reduced

### App won't connect
Update `renderer.js` line 6 with correct KaraFun server IP:
```javascript
const API_BASE_URL = 'http://YOUR_ACTUAL_IP:8080';
```

Then rebuild.

## What Gets Built?

Your executable contains:
- ✅ Full Electron runtime
- ✅ Your HTML/CSS/JavaScript
- ✅ All dependencies (axios, etc.)
- ✅ Configuration (API URL, etc.)

**Nothing needed on the target machine except Windows!**

## Distributed Executable Info

Once you distribute the `.exe`:

| Aspect | Details |
|--------|---------|
| **File Size** | ~150 MB |
| **Requires** | Windows 7 or later |
| **Installation** | None - just run it |
| **Configuration** | Configured at build time |
| **Uninstall** | Delete the .exe |

## Advanced: Multiple Configurations

If you have multiple KaraFun servers:

```bash
# Build for Server A
# 1. Edit renderer.js: API_BASE_URL = 'http://server-a:8080'
# 2. npm run build
# 3. Copy portable\*.exe to server-a-folder\

# Build for Server B
# 1. Edit renderer.js: API_BASE_URL = 'http://server-b:8080'  
# 2. npm run build
# 3. Copy portable\*.exe to server-b-folder\
```

Each build bakes in the configuration.

## For More Info

- **Detailed build guide:** [BUILD-PORTABLE.md](BUILD-PORTABLE.md)
- **General documentation:** [README.md](README.md)
- **Setup guide:** [SETUP.md](SETUP.md)
- **Quick reference:** [QUICK_REFERENCE.md](QUICK_REFERENCE.md)

## Summary

```bash
# One-time setup
npm install

# Each build
npm run build

# Result
portable/KaraFun Queue Display-v*.exe
```

Done! You now have a professional standalone Windows application. 🎉

---

**Questions?** Check [BUILD-PORTABLE.md](BUILD-PORTABLE.md) for detailed troubleshooting and advanced options.
