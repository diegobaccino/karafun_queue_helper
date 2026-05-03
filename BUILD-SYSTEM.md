# Build System - Complete Setup

Your KaraFun Queue Display now includes a complete build system for creating portable Windows executables.

## What's New

### Build-Related Files Added

```
karafun-queue-helper/
├── portable/                        ← Output folder for built .exe
│   └── README.md                    ← Instructions for this folder
├── assets/                          ← Icons and resources
│   └── README.md                    ← How to add custom icons
├── build-portable.bat               ← Windows batch build script
├── build-portable.ps1               ← PowerShell build script
├── BUILD-QUICK-START.md             ← 5-minute quick start guide
├── BUILD-PORTABLE.md                ← Comprehensive build guide
└── package.json                     ← Updated with build config
```

### Updated Files

- **package.json** - Added build configuration and electron-builder
- **INDEX.md** - Links to build documentation

## Build System Overview

```
Source Code (main.js, renderer.js, etc.)
            ↓
        npm run build
            ↓
electron-builder processes files
            ↓
Creates standalone .exe (150 MB)
            ↓
portable/KaraFun Queue Display-v1.0.0.exe
```

## Quick Start

### Prerequisites
- Node.js v14+ installed from https://nodejs.org/

### Build Steps
```bash
cd c:\Source\karafun_queue_helper
npm install                    # One-time setup
npm run build                  # Creates .exe
```

**Result:** `portable/KaraFun Queue Display-v1.0.0.exe`

## Documentation Guide

| Document | Read When | Time |
|----------|-----------|------|
| **BUILD-QUICK-START.md** | First time building | 5 min |
| **BUILD-PORTABLE.md** | Need detailed instructions | 15 min |
| **portable/README.md** | About the output folder | 3 min |
| **assets/README.md** | Adding custom icons | 5 min |

## Build Scripts

### Windows Batch (Easiest)
```bash
# Just double-click:
build-portable.bat

# Or run from terminal:
build-portable.bat
```

Automatically:
- Checks for dependencies
- Installs if missing
- Builds executable
- Shows success message

### PowerShell
```powershell
.\build-portable.ps1
```

If access denied:
```powershell
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
.\build-portable.ps1
```

### npm CLI (Direct)
```bash
npm run build
```

Shows raw build output (more verbose).

## Build Commands

All available build commands:

```bash
npm start              # Run in development
npm run build          # Build portable .exe only
npm run build-installer  # Build with installer
npm run build-all      # All formats
```

## Configuration Before Build

**Important:** Configure before building if you want different settings!

### API Endpoint
Edit `renderer.js` line 6:
```javascript
const API_BASE_URL = 'http://YOUR_SERVER:8080';
```

This is baked into the executable.

### Version Number
Edit `package.json`:
```json
"version": "1.0.1"
```

Next build: `KaraFun Queue Display-v1.0.1.exe`

### Custom Icons
1. Create or find 256x256+ image
2. Convert to ICO format: https://icoconvert.com/
3. Place in `assets/icon.ico`
4. Rebuild

## Output Files

After `npm run build`:

```
portable/
├── KaraFun Queue Display-v1.0.0.exe    ← Your app!
├── builder-effective-config.yaml       ← Build metadata
└── KaraFun Queue Display-v1.0.0.exe.blockmap  ← Update info
```

Only the `.exe` needs to be distributed.

### File Details
- **Size:** ~150 MB (normal for Electron)
- **Requires:** Windows 7 or later
- **Installation:** None - just run it
- **Dependencies:** All included
- **Uninstall:** Delete the file

## Distribution

### Simple Distribution
```bash
copy portable\*.exe your-shared-folder\
```

Users just double-click - no installation needed!

### With Documentation
```bash
mkdir KaraFun-Release
copy portable\*.exe KaraFun-Release\
copy README.md KaraFun-Release\
copy SETUP.md KaraFun-Release\
copy QUICK_REFERENCE.md KaraFun-Release\

# Zip for easy sharing
# Right-click folder → Send to → Compressed (zipped) folder
```

## Troubleshooting

### Problem: "npm: command not found"
**Solution:** Node.js not installed
- Install from https://nodejs.org/ (LTS version)
- Restart terminal/computer
- Try again

### Problem: Build is slow (5+ minutes)
**Expected** for first build (downloading Electron)
- Don't interrupt it
- Subsequent builds are faster

### Problem: "electron-builder not found"
```bash
npm install --save-dev electron-builder
npm run build
```

### Problem: Executable not created
1. Check terminal for error messages
2. Ensure `node_modules` exists:
   ```bash
   npm install
   npm run build
   ```
3. Check `portable/` folder

### Problem: App won't connect when distributed
Update API URL in `renderer.js` before building:
```javascript
const API_BASE_URL = 'http://correct-server:8080';
npm run build
```

## Build Pipeline

### Development Workflow
```
Edit code → npm start → Test locally
     ↓
Done testing → npm run build
     ↓
Test .exe → Ship executable
```

### Production Workflow
```
Update configuration in renderer.js
     ↓
Update version in package.json
     ↓
npm run build
     ↓
Test: portable/KaraFun Queue Display-v*.exe
     ↓
Copy to distribution folder
     ↓
Share with users
```

## Advanced: Automation

### Batch Script to Build Multiple Versions
```batch
@echo off

REM Build for different servers
for %%s in (server1, server2, server3) do (
    echo Building for %%s...
    
    REM Update renderer.js with server IP
    REM (manual step in this example)
    
    npm run build
    
    REM Copy to versioned folder
    mkdir dist-%%s
    copy portable\*.exe dist-%%s\
    
    echo.
)

echo All builds complete!
```

### GitHub Actions (CI/CD)
Automatically build on code changes:

```yaml
name: Build Portable EXE
on: [push]
jobs:
  build:
    runs-on: windows-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: 18
      - run: npm install
      - run: npm run build
      - uses: actions/upload-artifact@v3
        with:
          name: portable-exe
          path: portable/
```

## Key Files Reference

| File | Purpose | Edit When |
|------|---------|-----------|
| **package.json** | Build config, versions, dependencies | Changing version |
| **renderer.js** | App logic, API configuration | Changing API URL |
| **main.js** | Window behavior | Changing window size/fullscreen |
| **build-portable.bat** | Build script (Windows) | Never (automated) |
| **build-portable.ps1** | Build script (PowerShell) | Never (automated) |

## What's Configured

The build system includes:

✅ **electron-builder** - Creates executables  
✅ **Correct entry points** - main.js, renderer.js  
✅ **Dependency bundling** - All npm packages included  
✅ **Windows target** - Portable .exe format  
✅ **Icon support** - Optional custom icons  
✅ **Version management** - Automatic versioning  
✅ **Output folder** - `portable/` directory  

## Version Bumping

For releases, update version:

```json
// package.json
"version": "1.0.0"  →  "1.0.1"  // Patch (bug fix)
"version": "1.0.0"  →  "1.1.0"  // Minor (new feature)
"version": "1.0.0"  →  "2.0.0"  // Major (breaking change)
```

Then build - version automatically in executable name.

## Next Steps

1. **Read:** [BUILD-QUICK-START.md](BUILD-QUICK-START.md) - First build guide
2. **Build:** `npm run build`
3. **Test:** Run the `.exe` from `portable/` folder
4. **Share:** Copy `.exe` to any Windows machine!

## Support & Resources

- **Quick Build:** [BUILD-QUICK-START.md](BUILD-QUICK-START.md)
- **Detailed Guide:** [BUILD-PORTABLE.md](BUILD-PORTABLE.md)
- **Portable Folder:** [portable/README.md](portable/README.md)
- **Assets/Icons:** [assets/README.md](assets/README.md)
- **General Help:** [README.md](README.md)

---

**You're all set for building!** 🎉

Start with [BUILD-QUICK-START.md](BUILD-QUICK-START.md) or jump to `npm run build` if you're familiar with Node.js.

**Last Updated:** May 2026
