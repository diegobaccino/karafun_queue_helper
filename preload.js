const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  toggleFullscreen: () => ipcRenderer.send('toggle-fullscreen'),
  onFullscreenToggled: (callback) => ipcRenderer.on('fullscreen-toggled', (event, isFullscreen) => callback(isFullscreen))
});
