const { app, BrowserWindow, Menu } = require('electron');
const path = require('path');
const { ipcMain } = require('electron');

let mainWindow;

function createWindow() {
  // The app is designed for vertical queue displays, so the default window uses
  // a portrait footprint that matches kiosk and DJ monitor setups.
  mainWindow = new BrowserWindow({
    width: 1080,
    height: 1920,
    fullscreen: false,
    backgroundColor: '#0a0e27',
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: false,
      contextIsolation: true
    },
    icon: path.join(__dirname, 'assets', 'icon.png')
  });

  mainWindow.setMenuBarVisibility(true);
  mainWindow.setAutoHideMenuBar(false);

  mainWindow.loadFile('index.html');

  buildApplicationMenu();

  // Fullscreen mode is the primary operational gesture in booth and kiosk use,
  // so the menu is hidden only while fullscreen is active.
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

function sendToRenderer(channel) {
  if (mainWindow && !mainWindow.isDestroyed()) {
    mainWindow.webContents.send(channel);
  }
}

function buildApplicationMenu() {
  const template = [
    {
      label: 'File',
      submenu: [
        { role: 'quit' }
      ]
    },
    {
      label: 'Session',
      submenu: [
        {
          label: 'Change Session',
          accelerator: 'CommandOrControl+Shift+S',
          click: () => sendToRenderer('open-session-modal')
        },
        {
          label: 'Reconnect Now',
          accelerator: 'CommandOrControl+Shift+R',
          click: () => sendToRenderer('reconnect-session')
        }
      ]
    },
    {
      label: 'View',
      submenu: [
        { role: 'reload' },
        { role: 'forceReload' },
        { type: 'separator' },
        { role: 'togglefullscreen' }
      ]
    },
    {
      role: 'windowMenu'
    },
    {
      role: 'help',
      submenu: [
        {
          label: 'KaraFun Queue Display'
        }
      ]
    }
  ];

  const menu = Menu.buildFromTemplate(template);
  Menu.setApplicationMenu(menu);
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

ipcMain.on('toggle-fullscreen', toggleFullscreen);
ipcMain.on('open-session-modal', () => sendToRenderer('open-session-modal'));
ipcMain.on('reconnect-session', () => sendToRenderer('reconnect-session'));
