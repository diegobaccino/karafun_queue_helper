# Building a Portable Executable

> Status: Historical guide. Some sections reference pre-v1 localhost API configuration.
> For current runtime architecture and startup flow, use README.md, SETUP.md, and API.md first.

This guide explains how to build a standalone `.exe` file from the KaraFun Queue Display app that can be run on any Windows machine without needing Node.js or npm installed.

## Prerequisites

- **Node.js** (v14 or higher) - Only needed for building
- **npm** - Comes with Node.js
- **Windows 7 or later** - For running the built executable
- **~500 MB disk space** - For dependencies and build output

## Quick Build (TL;DR)

```bash
# One-time setup
npm install
npm install --save-dev electron-builder

# Build portable executable
npm run build

# Your executable is in the "portable" folder!
# Share: portable/KaraFun Queue Display-v1.0.0.exe
```

## Detailed Build Instructions

### Step 1: Install Dependencies

First, install the required Node.js packages:

```bash
cd c:\Source\karafun_queue_helper
npm install
```

This installs:
- `electron` - Desktop application framework
- `axios` - HTTP client for API calls
- `electron-builder` - Tool to create standalone executables

### Step 2: Create Icons (Optional)

For a professional build with app icon in Windows:

1. Create an **assets** folder in the project root:
   ```bash
   mkdir assets
   ```

2. Add your icons:
   - **icon.ico** (256x256 or larger)
   - **icon.png** (512x512 recommended)

You can:
- Design your own icon
- Use an online PNG to ICO converter
- Download the KaraFun logo and convert it
- Skip this step - the app will build without custom icons

### Step 3: Build the Executable

Run the build command:

```bash
npm run build
```

**What happens:**
1. electron-builder analyzes your project
2. Bundles all dependencies
3. Creates a portable Windows executable
4. Places it in the `portable/` folder
5. Builds in about 2-5 minutes (first time longer)

**Output location:**
```
portable/
└── KaraFun Queue Display-v1.0.0.exe
```

### Step 4: Test the Build

```bash
# Run the built executable
.\portable\KaraFun\ Queue\ Display-v1.0.0.exe
```

Or double-click the `.exe` file in Windows Explorer.

**Verify:**
- Window opens with proper size
- Status shows "Connecting..."
- Queue loads (if KaraFun server is running)
- Right-click toggles fullscreen

## Build Variants

### Portable Only (Recommended)
Smallest file, easiest to distribute, requires no installation:
```bash
npm run build
```
Output: `KaraFun Queue Display-v1.0.0.exe` (~150 MB)

### With Installer
Also creates an NSIS installer alongside portable:
```bash
npm run build-installer
```
Outputs both `.exe` files:
- `KaraFun Queue Display Setup 1.0.0.exe` - Installer (~150 MB)
- `KaraFun Queue Display-v1.0.0.exe` - Portable (~150 MB)

### All Formats
Builds all available formats (if configured):
```bash
npm run build-all
```

## Distribution

### To Share the Built App

**Option A: Direct Distribution**
```bash
# Copy the single executable
copy portable\KaraFun\ Queue\ Display-v1.0.0.exe your-shared-folder\
```

Users just double-click to run - no installation needed!

**Option B: Create a Release Folder**
```bash
# Create a distributable package
mkdir KaraFun-Queue-Display-v1.0.0
copy portable\*.exe KaraFun-Queue-Display-v1.0.0\
copy README.md KaraFun-Queue-Display-v1.0.0\
copy SETUP.md KaraFun-Queue-Display-v1.0.0\
copy QUICK_REFERENCE.md KaraFun-Queue-Display-v1.0.0\

# Zip it for easy distribution
# Right-click folder → Send to → Compressed (zipped) folder
```

## Building for Different Versions

### Update Version Number

Edit `package.json`:
```json
"version": "1.0.1"
```

Then rebuild:
```bash
npm run build
```

New executable: `portable/KaraFun Queue Display-v1.0.1.exe`

### Update Configuration Before Build

Before building, update `renderer.js` with the correct settings:

```javascript
// Line 6 - Set default API URL for your environment
const API_BASE_URL = 'http://192.168.1.100:8080';

// Line 7 - Poll interval
const POLL_INTERVAL = 3000;

// Line 8 - Queue display size
const MAX_QUEUE_ITEMS = 8;
```

Then build:
```bash
npm run build
```

The configuration is baked into the executable.

## File Structure After Build

```
karafun-queue-display/
├── portable/                           ← Build output directory
│   ├── KaraFun Queue Display-v1.0.0.exe    ← Your executable!
│   └── builder-effective-config.yaml   ← Build metadata
├── dist/                               ← Unpacked app files
├── node_modules/                       ← Dependencies
├── main.js
├── renderer.js
├── index.html
├── style.css
├── preload.js
├── package.json                        ← Build config here
└── [documentation files]
```

## Customizing the Build

Edit `package.json` in the `"build"` section to customize:

### Change Output Folder Name
```json
"directories": {
  "output": "releases"  // Changes from "portable" to "releases"
}
```

### Change Executable Name
```json
"portable": {
  "artifactName": "KaraFun-Queue-${version}.exe"
}
```

### Add More Files to Bundle
```json
"files": [
  "main.js",
  "preload.js",
  "renderer.js",
  "index.html",
  "style.css",
  "package.json",
  "node_modules/**/*",
  "assets/**/*"  // Include assets folder
]
```

### Customize App Icon
Place icon files in `assets/`:
```
assets/
├── icon.ico      (Windows icon, 256x256+)
└── icon.png      (PNG icon, 512x512)
```

Then rebuild:
```bash
npm run build
```

## Troubleshooting Builds

### Error: "electron-builder not found"

```bash
# Install electron-builder
npm install --save-dev electron-builder
```

Then retry:
```bash
npm run build
```

### Error: "Cannot find module 'electron'"

```bash
# Rebuild all dependencies
npm install
```

### Build takes very long

**First build is slow** (downloading Electron, packaging dependencies).

Subsequent builds are faster. If stuck for > 10 minutes:
1. Press Ctrl+C to cancel
2. Delete `dist/` folder
3. Run `npm run build` again

### Portable EXE file is very large (~150 MB)

**This is normal.** Electron includes a full Chromium browser engine.

- Can't be significantly reduced
- Still fast to run once extracted
- Normal for all Electron apps (VS Code, Discord, etc.)

### Icon not showing in executable

1. Ensure `assets/icon.ico` exists
2. Rebuild:
   ```bash
   npm run build
   ```
3. If still missing, the app will use Windows default icon (still works fine)

### "Access Denied" error during build

Windows Defender or antivirus may block building.

**Solution:**
1. Add project folder to antivirus exclusions
2. Run terminal as Administrator
3. Or temporarily disable antivirus (not recommended)

## Version Control & Build Artifacts

### What to Commit to Git
```bash
# These should be in .gitignore
portable/           # Don't commit built executables
dist/               # Don't commit unpacked files
node_modules/       # Don't commit dependencies
```

### What to Keep
```bash
# These should be committed
main.js
renderer.js
index.html
style.css
preload.js
package.json       # Important! Has build config
```

Check `.gitignore` to verify correct files are excluded.

## Automating Builds

### Windows Batch Script

Create `build-portable.bat`:

```batch
@echo off
echo Building KaraFun Queue Display Portable...
echo.

if not exist node_modules (
    echo Installing dependencies...
    call npm install
)

echo.
echo Building executable...
call npm run build

echo.
echo.
echo ============================================
echo Build complete!
echo.
echo Portable executable:
echo portable\KaraFun Queue Display-v1.0.0.exe
echo.
echo To test: 
echo .\portable\KaraFun\ Queue\ Display-v1.0.0.exe
echo ============================================
pause
```

**Usage:**
```bash
# Double-click build-portable.bat
# Or run from terminal:
build-portable.bat
```

### PowerShell Script

Create `build-portable.ps1`:

```powershell
Write-Host "Building KaraFun Queue Display Portable..." -ForegroundColor Green
Write-Host ""

if (-not (Test-Path node_modules)) {
    Write-Host "Installing dependencies..." -ForegroundColor Yellow
    npm install
}

Write-Host ""
Write-Host "Building executable..." -ForegroundColor Yellow
npm run build

Write-Host ""
Write-Host "============================================" -ForegroundColor Green
Write-Host "Build complete!" -ForegroundColor Green
Write-Host ""
Write-Host "Portable executable:" -ForegroundColor Yellow
Write-Host "portable\KaraFun Queue Display-v1.0.0.exe"
Write-Host ""
Write-Host "To test:" -ForegroundColor Yellow
Write-Host ".\portable\KaraFun\ Queue\ Display-v1.0.0.exe"
Write-Host "============================================" -ForegroundColor Green
```

**Usage:**
```powershell
# Run from PowerShell:
.\build-portable.ps1

# Or set execution policy if needed:
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

## Building on CI/CD (GitHub Actions, etc.)

Add to `.github/workflows/build.yml`:

```yaml
name: Build Portable EXE

on: [push, pull_request]

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

## Best Practices

✅ **DO:**
- Always test the built executable before distributing
- Include README and setup instructions with the executable
- Version your builds (update package.json version)
- Keep `package.json` in version control
- Document configuration changes before building

❌ **DON'T:**
- Modify `node_modules` - regenerate with `npm install`
- Delete build output before testing
- Distribute without testing first
- Forget to update configuration for target environment
- Share without instructions on how to configure API URL

## Common Deployment Scenarios

### Scenario: Build Once, Deploy Many

```bash
# Build once with default config
npm run build

# Copy to multiple machines
copy portable\*.exe \\kiosk1\install\
copy portable\*.exe \\kiosk2\install\
copy portable\*.exe \\kiosk3\install\
```

### Scenario: Custom Build Per Server

```bash
# For Server A
# 1. Edit renderer.js: const API_BASE_URL = 'http://server-a:8080'
# 2. npm run build
# 3. copy portable\*.exe server-a-build\
# 4. git checkout renderer.js (restore original)

# For Server B
# 1. Edit renderer.js: const API_BASE_URL = 'http://server-b:8080'
# 2. npm run build
# 3. copy portable\*.exe server-b-build\
# 4. git checkout renderer.js
```

### Scenario: CI/CD Pipeline

Set up GitHub Actions to automatically build on each release:

```yaml
# On every version tag, build and release
on:
  push:
    tags:
      - 'v*'
```

## Support & Troubleshooting

1. **Build fails** - Check you have Node.js v14+ installed
2. **EXE won't run** - Ensure Windows 7 or later
3. **Connection error** - Update `renderer.js` API_BASE_URL
4. **Need help** - Review [DEPLOYMENT.md](DEPLOYMENT.md)

---

**Last Updated:** May 2026  
**Version:** 1.0.0
