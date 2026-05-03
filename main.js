const { app, BrowserWindow, Menu } = require('electron');
const path = require('path');

let mainWindow;
let isFullscreen = false;

function createWindow() {
  // Create the browser window
  mainWindow = new BrowserWindow({
    width: 1080,
    height: 1920,
    fullscreen: false,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: false,
      contextIsolation: true
    },
    icon: path.join(__dirname, 'assets', 'icon.png') // Optional icon
  });

  // Load the app
  mainWindow.loadFile('index.html');

  // Handle right-click for fullscreen toggle
  mainWindow.webContents.on('context-menu', (e) => {
    e.preventDefault();
    toggleFullscreen();
  });

  mainWindow.webContents.openDevTools();
}

function toggleFullscreen() {
  if (mainWindow) {
    isFullscreen = !isFullscreen;
    mainWindow.setFullScreen(isFullscreen);
    mainWindow.webContents.send('fullscreen-toggled', isFullscreen);
  }
}

app.whenReady().then(() => {
  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

// Expose toggleFullscreen to renderer process via IPC if needed
const { ipcMain } = require('electron');
ipcMain.on('toggle-fullscreen', toggleFullscreen);
