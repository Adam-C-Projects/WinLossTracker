const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electron', {
  getSummonerData: (username : string, region : string) => ipcRenderer.invoke('getSummonerData', username, region),
});