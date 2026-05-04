# Assets Folder

This folder contains icons and resources for the KaraFun Queue Display executable.

## Icon Files

The following icon files can be placed here for the build process:

### Windows Icon (.ico)
**File:** `icon.ico`
- **Size:** 256x256 or larger
- **Format:** Windows ICO format
- **Purpose:** Application icon in Windows Explorer and taskbar

### PNG Icon
**File:** `icon.png`
- **Size:** 512x512 recommended
- **Format:** PNG with transparency
- **Purpose:** Alternative icon format for builds

### Screensaver Logo
**File:** `karafun-logo.svg`
- **Source:** Downloaded from public KaraFun web assets CDN
- **Purpose:** Center logo displayed in idle screensaver mode

## Screensaver Quotes

**File:** `screensaver-quotes.js`

- Stores rotating quote lines used by the idle screensaver overlay.
- Keep entries as plain strings in `window.SCREENSAVER_QUOTES`.
- The renderer rotates quotes every minute while screensaver mode is active.
- Hosts can update wording in this file without changing application logic.

## Creating Icons

### Option 1: Use Online Tools
1. Create or find an image (PNG, 512x512)
2. Visit https://icoconvert.com/ or similar
3. Upload your PNG
4. Download the ICO file
5. Place in this folder as `icon.ico`

### Option 2: Use Design Software
- Photoshop, GIMP, Affinity Designer
- Create 256x256+ image
- Export as ICO format

### Option 3: Convert Existing PNG
```bash
# Using ImageMagick (if installed)
magick convert icon.png -define icon:auto-resize=256,128,96,64,48,32,16 icon.ico
```

### Option 4: Use a KaraFun Logo
1. Download KaraFun logo
2. Convert to ICO format using online converter
3. Place as `icon.ico`

## Building Without Icons

The app builds successfully without custom icons. It will use the Windows default Electron icon, which still looks professional.

To rebuild with icons once they're added:
```bash
npm run build
```

## File Structure After Adding Icons

```
assets/
├── icon.ico      (256x256+, required for Windows)
└── icon.png      (512x512, optional)
```

---

The build process automatically includes files from this folder in the executable.
