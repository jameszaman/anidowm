const { ipcRenderer } = require("electron");

let electronProgressStorage;
let appPath;

setTimeout(() => {
  ipcRenderer.send("request-app-path");
}, 1000);

ipcRenderer.on("global-ready", (event, data) => {
  electronProgressStorage = data.electronProgressStorage;
  global.appPath = data.appPath;
});

// Make sure to load downloadedProgress each time new page is loaded.
if(!electronProgressStorage) {
  // Request for electronProgressStorage
  ipcRenderer.send('fetch-electron-progress-storage');
  ipcRenderer.on('recieve-electron-progress-storage', (event, data) => {
    electronProgressStorage = data;
  });
}
