# KaraFun Queue Display - Complete Documentation Index

Welcome! This is your starting point for the KaraFun Queue Display application. Below you'll find links to all documentation and a guide to choosing which file to read.

## 🚀 Get Started Now

**First time?** Start here:

1. **[FIRST-TIME-SETUP.md](FIRST-TIME-SETUP.md)** ← Complete setup guide
2. **[BUILD-QUICK-START.md](BUILD-QUICK-START.md)** ← Quick build (5 min)
3. **[npm start]** ← Launch the app!

## 📚 Full Documentation

### For Users / Getting Started
| Document | Purpose | Time |
|----------|---------|------|
| **[FIRST-TIME-SETUP.md](FIRST-TIME-SETUP.md)** | Complete first-time setup guide | 15 min |
| **[QUICK_REFERENCE.md](QUICK_REFERENCE.md)** | Quick commands and config changes | 5 min |
| **[README.md](README.md)** | Complete feature overview & usage | 10 min |
| **[SETUP.md](SETUP.md)** | Installation and setup guide | 10 min |
| **[CHECKLIST.md](CHECKLIST.md)** | Pre-launch verification | 15 min |

### For Developers / Technical
| Document | Purpose | Time |
|----------|---------|------|
| **[API.md](API.md)** | KaraFun API endpoints & response formats | 10 min |
| **[DEPLOYMENT.md](DEPLOYMENT.md)** | Production deployment & optimization | 20 min |
| **[BUILD-PORTABLE.md](BUILD-PORTABLE.md)** | Building portable .exe executables | 15 min |
| **[BUILD-SYSTEM.md](BUILD-SYSTEM.md)** | Build system overview | 10 min |
| **[BUILD-QUICK-START.md](BUILD-QUICK-START.md)** | Quick build guide | 5 min |
| **[.env.example](.env.example)** | Configuration options reference | 5 min |

### Code Files
| File | Purpose |
|------|---------|
| **main.js** | Electron window management & fullscreen toggle |
| **renderer.js** | Queue fetching & UI updates (MAIN LOGIC) |
| **index.html** | Page structure & layout |
| **style.css** | Vibrant KaraFun styling |
| **preload.js** | Secure IPC communication |
| **package.json** | Dependencies & build configuration |

---

## 🎯 Quick Navigation by Task

### "I just want to get it running"
→ Read **[SETUP.md](SETUP.md)**

### "How do I configure it?"
→ Check **[QUICK_REFERENCE.md](QUICK_REFERENCE.md)** → Configuration section

### "It's not working / Connection error"
→ Read **[SETUP.md](SETUP.md)** → Troubleshooting section

### "I need to deploy to a kiosk"
→ Read **[DEPLOYMENT.md](DEPLOYMENT.md)**

### "I want to modify the styling"
→ Open **style.css** → Change colors under `:root`

### "I want to know about the API"
→ Read **[API.md](API.md)**

### "How do I build a standalone executable?"
→ Read **[BUILD-PORTABLE.md](BUILD-PORTABLE.md)** → Follow the quick build steps

### "What are all the features?"
→ Read **[README.md](README.md)** → Features section

### "Before I launch, what should I check?"
→ Use **[CHECKLIST.md](CHECKLIST.md)**

---

## 📖 Reading Order by Scenario

### 🆕 First-Time Users
1. QUICK_REFERENCE.md
2. SETUP.md
3. CHECKLIST.md
4. npm start

### 👨‍💻 Developers
1. README.md
2. API.md
3. DEPLOYMENT.md
4. Code files (main.js, renderer.js, style.css)

### 🏢 System Administrators
1. SETUP.md
2. DEPLOYMENT.md
3. CHECKLIST.md
4. API.md (for network setup)

### 🎨 Designers/Customizers
1. QUICK_REFERENCE.md (Styling section)
2. style.css (main file)
3. index.html (structure)
4. README.md (features to understand)

### 🐛 Troubleshooters
1. SETUP.md (Troubleshooting)
2. QUICK_REFERENCE.md (Common tweaks)
3. CHECKLIST.md (Verification)
4. Console errors (F12 in app)

---

## 🔑 Key Configuration Points

### The Most Important File: renderer.js

Line 6 - Update this with your KaraFun server IP:
```javascript
const API_BASE_URL = 'http://YOUR_KARAFUN_IP:8080';
```

Line 7 - How often to update:
```javascript
const POLL_INTERVAL = 3000;  // milliseconds
```

Line 8 - Songs to display:
```javascript
const MAX_QUEUE_ITEMS = 8;  // before showing "more"
```

👉 **This is the ONLY file you typically need to edit to get started!**

---

## 📋 Feature Checklist

The app includes:
- ✅ Real-time queue polling
- ✅ Vibrant KaraFun styling  
- ✅ QR code for joining sessions
- ✅ Current song highlight
- ✅ Album cover display
- ✅ Right-click fullscreen toggle
- ✅ Vertical monitor optimization
- ✅ Auto-refresh every 3 seconds
- ✅ Large readable text
- ✅ "X more songs" indicator when queue is long
- ✅ Song metadata (title, artist, singer, added by)

---

## 🆘 Common Issues & Solutions

| Issue | Where to Look |
|-------|---------------|
| "Connection Error" | SETUP.md → Troubleshooting |
| Can't see queue | SETUP.md → Troubleshooting |
| Need to change server IP | QUICK_REFERENCE.md → Configuration |
| Want bigger/smaller text | style.css → Adjust font-size |
| Album art not showing | API.md → Expected response format |
| Want fullscreen by default | DEPLOYMENT.md → Display settings |
| Building for production | DEPLOYMENT.md → Option 2 |

---

## 📞 Support Resources

1. **Check the docs** - Start with the relevant document above
2. **Check the code** - Comments in main.js, renderer.js explain key sections
3. **Check the API** - API.md has response format examples
4. **Check your console** - Press F12 in the app, look at Console tab
5. **Network test** - Try accessing http://YOUR_IP:8080/remote/queue in browser

---

## 🎓 Learning Path

If you want to understand the entire system:

1. **QUICK_REFERENCE.md** - Get the big picture
2. **README.md** - Learn all features
3. **SETUP.md** - Follow installation steps
4. **style.css** - See how styling works
5. **renderer.js** - Understand the logic
6. **main.js** - Learn about Electron window
7. **API.md** - Deep dive into API integration
8. **DEPLOYMENT.md** - Production deployment

---

## 📱 Mobile/Responsive Considerations

The app is optimized for:
- ✅ Vertical monitors (1080x1920)
- ✅ Large displays (kiosk screens)
- ✅ Touch interfaces
- ✅ Long queue lists with scrolling

Not optimized for:
- ❌ Horizontal/landscape mode
- ❌ Small phone screens
- ❌ Narrow displays

---

## 🔄 Update & Maintenance

- **Dependencies** - Update with `npm update`
- **Electron** - Major updates in package.json
- **Configuration** - Edit renderer.js for API/behavior
- **Styling** - Modify style.css for appearance
- **Features** - Modify renderer.js for logic

---

## 💾 File Structure Overview

```
karafun-queue-display/
│
├── 📄 Core Application Files
│   ├── main.js              # Electron window (START HERE for windowing)
│   ├── renderer.js          # Queue logic (START HERE for API/behavior)
│   ├── preload.js           # IPC security bridge
│   ├── index.html           # Page structure
│   └── style.css            # All styling
│
├── 📋 Configuration
│   ├── package.json         # Dependencies
│   └── .env.example         # Optional config reference
│
├── 📚 Documentation (You are here!)
│   ├── README.md            # Feature overview
│   ├── SETUP.md             # Installation guide
│   ├── QUICK_REFERENCE.md   # Cheat sheet
│   ├── API.md               # API documentation
│   ├── DEPLOYMENT.md        # Production guide
│   ├── CHECKLIST.md         # Verification checklist
│   └── INDEX.md             # This file
│
└── 🔧 Git & Misc
    └── .gitignore          # Git ignore rules
```

---

## 🎬 Next Steps

### Option A: Just Get Started
```bash
cd c:\Source\karafun_queue_helper
npm install
# Edit renderer.js line 6 with your KaraFun IP
npm start
```

### Option B: Learn & Understand
1. Read QUICK_REFERENCE.md
2. Read SETUP.md  
3. Read README.md
4. Run the app

### Option C: Deploy to Production
1. Read DEPLOYMENT.md completely
2. Run CHECKLIST.md
3. Build executable
4. Deploy to kiosk

---

## ✨ You're All Set!

Everything you need is here. Pick a document above based on what you want to do, and start with the recommended reading order for your scenario.

**Happy queuing! 🎤**

---

### Quick Links to Files

- [🆕 FIRST-TIME-SETUP.md](FIRST-TIME-SETUP.md) - Complete setup (start here!)
- [📖 README.md](README.md) - Full documentation
- [⚡ SETUP.md](SETUP.md) - Get started quickly  
- [🚀 DEPLOYMENT.md](DEPLOYMENT.md) - Production setup
- [📦 BUILD-SYSTEM.md](BUILD-SYSTEM.md) - Build system overview
- [🔨 BUILD-QUICK-START.md](BUILD-QUICK-START.md) - Quick build guide (5 min)
- [🏗️ BUILD-PORTABLE.md](BUILD-PORTABLE.md) - Detailed build instructions
- [✅ check-setup.bat](check-setup.bat) - Verify your system is ready
- [�🔗 API.md](API.md) - API reference
- [✅ CHECKLIST.md](CHECKLIST.md) - Pre-launch checklist
- [⚙️ QUICK_REFERENCE.md](QUICK_REFERENCE.md) - Command reference
- [🔧 renderer.js](renderer.js) - Main application logic
- [🎨 style.css](style.css) - Styling

**Last Updated:** May 2026  
**Version:** 1.0.0
