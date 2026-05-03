const { app, BrowserWindow } = require('electron');
const path = require('path');

let mainWindow;

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

  mainWindow.setMenuBarVisibility(true);
  mainWindow.setAutoHideMenuBar(false);

  // Load the app
  mainWindow.loadFile('index.html');

  mainWindow.on('enter-full-screen', () => {
    mainWindow.setMenuBarVisibility(false);
    mainWindow.setAutoHideMenuBar(true);
    mainWindow.webContents.send('fullscreen-toggled', true);
  });

  mainWindow.on('leave-full-screen', () => {
    mainWindow.setAutoHideMenuBar(false);
    mainWindow.setMenuBarVisibility(true);
    mainWindow.webContents.send('fullscreen-toggled', false);
  });

}

function toggleFullscreen() {
  if (mainWindow) {
    mainWindow.setFullScreen(!mainWindow.isFullScreen());
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
