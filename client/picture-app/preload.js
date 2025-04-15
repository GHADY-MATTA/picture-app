const { contextBridge, ipcRenderer } = require('electron');

console.log("✅ preload.js loaded");

contextBridge.exposeInMainWorld('electronAPI', {
  getImages: () => ipcRenderer.invoke('get-images'),
  saveImage: (payload) => ipcRenderer.invoke('save-image', payload),
  deleteImage: (payload) => ipcRenderer.invoke('delete-image', payload),
});

contextBridge.exposeInMainWorld('env', {
  CHAT_URL: 'ws://localhost:8080',
});
contextBridge.exposeInMainWorld('electronAPI', {
  getImages: () => ipcRenderer.invoke('get-images'),
  saveImage: (payload) => ipcRenderer.invoke('save-image', payload),
  deleteImage: (payload) => ipcRenderer.invoke('delete-image', payload),
});
// contextBridge.exposeInMainWorld('electronAPI', {
//   getImages: () => ipcRenderer.invoke('get-images'),
//   saveImage: (payload) => ipcRenderer.invoke('save-image', payload),
//   deleteImage: (payload) => ipcRenderer.invoke('delete-image', payload),
// });
