// Importing necessary modules.
const { app, BrowserWindow, ipcMain, Menu } = require("electron");
const { spawn } = require('child_process');
const path = require('path');
require('dotenv').config();

let mainWindow;
let pythonPath;

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
  mainWindow = new BrowserWindow({
    minHeight: 600,
    minWidth: 600,
    title: 'Anidown',
    webPreferences: {
      // *** Comment this line for testing. ***
      devTools: false,
      // For working with node.
      nodeIntegration: true,
      contextIsolation: false,
    },
  });
  mainWindow.loadURL(`file:\\\\${__dirname}\\views\\index.html`);
  Menu.setApplicationMenu(null)
});

// Events from window.

// Might try to turn this 4 into 1 function.
ipcMain.on('downloadAll', (event, data) => {
  spawn("python", [pythonPath, "downloadAll", data]);
});
ipcMain.on("downloadBetween", (event, data) => {
  spawn("python", [pythonPath, "downloadBetween", data]);
});
ipcMain.on("downloadSelect", (event, data) => {
  spawn("python", [pythonPath, "downloadSelect", data]);
});
ipcMain.on("downloadPokemonhub", (event, data) => {
  spawn("python", [pythonPath, "downloadPokemonhub", data]);
});
ipcMain.on("NPokemonDownload", (event, data) => {
  spawn("python", [pythonPath, "NPokemonDownload", data[0], data[1]]);
});
