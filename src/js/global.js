const { ipcRenderer } = require("electron");

let electronProgressStorage;

setTimeout(() => {
  ipcRenderer.send("request-app-path");
}, 1000);

ipcRenderer.on("global-ready", (event, data) => {
  electronProgressStorage = data.electronProgressStorage;
});

// Make sure to load downloadedProgress each time new page is loaded.
if(!electronProgressStorage) {
  // Request for electronProgressStorage
  ipcRenderer.send('fetch-electron-progress-storage');
  ipcRenderer.on('recieve-electron-progress-storage', (event, data) => {
    electronProgressStorage = data;
  });
}
