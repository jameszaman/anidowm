// Importing necessary modules.
const { app, BrowserWindow, ipcMain, Menu } = require("electron");
const { spawn } = require('child_process');
const path = require('path');
const { autoUpdater } = require("electron-updater");
require('dotenv').config();

// Importing user defined modules.
const { downloadAll, downloadSelect } = require('./src/js/animeDownload');
const pokemonhubDownload = require('./src/js/pokemonhubDownload');
const NPokemonDownload = require('./src/js/npokemonDownload');
const { ipcRenderer } = require("electron/renderer");

let mainWindow;
let pythonPath;
let electronProgressStorage = [];

// Python dependencies
spawn("pip", ["install", "bs4"]);
spawn("pip", ["install", "requests"]);

// Need different path for development and production.
if(process.env.DEVELOPMENT) {
  pythonPath = "python/pyrun.py";
}
else {
  pythonPath = path.join(app.getAppPath(), "..", "python/pyrun.py");
}

// Necessary Functions.
function strToArray(str) {
  str = str.trim();
  str = str.replace(/['\[\]"]/g, "");
  str = str.split(", ");
  return str;
}

// App event.
app.on('ready', () => {
  // Different settings for production and development.
  let devTools = true;
  if (!process.env.DEVELOPMENT) {
    Menu.setApplicationMenu(null);
    devTools =  false;
  }
  mainWindow = new BrowserWindow({
    minHeight: 600,
    minWidth: 600,
    title: 'Anidown',
    webPreferences: {
      devTools,
      // For working with node.
      nodeIntegration: true,
      contextIsolation: false,
    },
  });
  mainWindow.loadURL(`file:\\\\${__dirname}\\views\\anime.html`);
  if (!process.env.DEVELOPMENT) {
    autoUpdater.checkForUpdates();
  }
  ipcMain.on('request-app-path', () => {
    mainWindow.webContents.send("global-ready", {
      appPath: app.getAppPath(),
      electronProgressStorage,
    });
  });
});

// Event for download progress.
ipcMain.on("new-download", (event, data) => {
  electronProgressStorage.push(data);
});

// Send electronProgressStorage if asked.
ipcMain.on("fetch-electron-progress-storage", () => {
  mainWindow.webContents.send("recieve-electron-progress-storage", electronProgressStorage);
});


// Event for update.
if (!process.env.DEVELOPMENT) {
  autoUpdater.on("update-downloaded", (info) => {
    autoUpdater.quitAndInstall();
  });

  autoUpdater.on("update-available", (info) => {
    mainWindow.webContents.send("will-update");
  });
}

