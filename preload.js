const { contextBridge, ipcRenderer } = require('electron');

// Expose only the small operational surface the display needs. The renderer can
// request fullscreen changes, but window management stays in the main process.
contextBridge.exposeInMainWorld('electronAPI', {
  toggleFullscreen: () => ipcRenderer.send('toggle-fullscreen'),
  requestSessionModal: () => ipcRenderer.send('open-session-modal'),
  requestReconnectSession: () => ipcRenderer.send('reconnect-session'),
  onFullscreenToggled: (callback) => ipcRenderer.on('fullscreen-toggled', (event, isFullscreen) => callback(isFullscreen)),
  onOpenSessionModal: (callback) => ipcRenderer.on('open-session-modal', callback),
  onReconnectSession: (callback) => ipcRenderer.on('reconnect-session', callback)
});
