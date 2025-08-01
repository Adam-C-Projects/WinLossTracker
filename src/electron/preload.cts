const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electron', {
  getSummonerData: (username : string) => ipcRenderer.invoke('getSummonerData', username),
});