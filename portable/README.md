# Portable Executable Output

This folder contains the built portable `.exe` executable files.

## What's Here

When you run `npm run build`, the standalone Windows executable will be created in this folder:

```
portable/
└── KaraFun Queue Display-v1.0.0.exe    ← Your executable (built here)
```

## How to Build

### Quick Start

1. **Install Node.js** (if not already installed)
   - Download from: https://nodejs.org/
   - Install the LTS version (v18+ recommended)

2. **Install Dependencies**
   ```bash
   cd c:\Source\karafun_queue_helper
   npm install
   ```

3. **Build the Executable**
   ```bash
   npm run build
   ```
   
   Or use the helper scripts:
   - **Windows batch**: Double-click `build-portable.bat`
   - **PowerShell**: Run `.\build-portable.ps1`

4. **Output**
   - Built executable appears here: `portable/KaraFun Queue Display-v1.0.0.exe`
   - File size: ~150 MB (normal for Electron apps)

### Running the Built Executable

```bash
# From command line
.\portable\KaraFun\ Queue\ Display-v1.0.0.exe

# Or just double-click in Windows Explorer
portable/KaraFun Queue Display-v1.0.0.exe
```

## Distribution

The `.exe` file is **completely standalone** - it can be:
- Copied to any Windows machine (Windows 7 or later)
- Shared via USB drive, cloud storage, or email
- No installation needed - just run it!
- No dependencies required (includes Electron runtime)

### To Share

```bash
# Simple copy to a folder
copy portable\*.exe \\shared-server\karafun-builds\

# Or create a release package
mkdir KaraFun-Queue-Display-Release
copy portable\*.exe KaraFun-Queue-Display-Release\
copy README.md KaraFun-Queue-Display-Release\
copy SETUP.md KaraFun-Queue-Display-Release\
```

## Build Requirements

- **Node.js** v14+ (for building only, not needed to run the exe)
- **npm** (comes with Node.js)
- **electron-builder** (installed via npm)
- **~500 MB disk space** for build process
- **Windows 7 or later** (for running the exe)

## Build Time

- First build: 2-5 minutes (downloading Electron and dependencies)
- Subsequent builds: 1-2 minutes (dependencies cached)

## Troubleshooting

### "npm: command not found"
- Node.js not installed
- Install from: https://nodejs.org/
- Restart terminal after installation

### "electron-builder not found"
```bash
npm install --save-dev electron-builder
npm run build
```

### Build is slow
- First build is slower (one-time setup)
- Subsequent builds are faster
- Don't interrupt the build (let it run to completion)

### Executable file not created
1. Check for error messages in terminal
2. Ensure `node_modules` folder exists
3. Try: `npm install` then `npm run build`

## Customizing Builds

Before building, you can customize:

### API URL Configuration
Edit `renderer.js` line 6:
```javascript
const API_BASE_URL = 'http://YOUR_SERVER:8080';
```

Then build:
```bash
npm run build
```

### Executable Icon
Add icon files to `assets/` folder:
- `assets/icon.ico` (256x256)
- `assets/icon.png` (512x512)

Then rebuild.

### Version Number
Edit `package.json`:
```json
"version": "1.0.1"
```

Then build - executable will be named `KaraFun Queue Display-v1.0.1.exe`

## File Structure

```
karafun-queue-display/
├── portable/                           ← This folder (output location)
│   └── KaraFun Queue Display-*.exe     ← Built executable
├── dist/                               ← Unpacked files (temporary)
├── node_modules/                       ← Dependencies
├── build-portable.bat                  ← Windows build script
├── build-portable.ps1                  ← PowerShell build script
├── BUILD-PORTABLE.md                   ← Detailed build guide
├── main.js
├── renderer.js
├── index.html
├── style.css
├── package.json                        ← Contains build config
└── [other files]
```

## Build Scripts

### Batch Script (Windows)
```bash
# Double-click build-portable.bat
# Or run from command prompt
build-portable.bat
```

Automatically:
1. Checks for dependencies
2. Installs if needed
3. Builds executable
4. Shows success message

### PowerShell Script
```powershell
# Run from PowerShell
.\build-portable.ps1

# If access denied, allow scripts:
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
.\build-portable.ps1
```

## Future Builds

To build future versions:

1. **Update version** in `package.json`
2. **Update configuration** in `renderer.js` if needed
3. **Run build script**:
   ```bash
   npm run build
   ```
4. **New executable** appears in `portable/`

## Advanced Options

See [BUILD-PORTABLE.md](../BUILD-PORTABLE.md) for:
- Creating custom icons
- Automated builds
- CI/CD integration
- Different build formats (installer, etc.)

## Support

- Full build guide: [BUILD-PORTABLE.md](../BUILD-PORTABLE.md)
- General docs: [README.md](../README.md)
- API reference: [API.md](../API.md)

---

**To build the executable, see [BUILD-PORTABLE.md](../BUILD-PORTABLE.md)**

---

**Note:** This folder is created by `npm run build` - you don't need to manually create anything here. Just run the build command and the executable will appear!
