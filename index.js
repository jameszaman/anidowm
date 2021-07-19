// Importing necessary modules.
const { app, BrowserWindow, ipcMain, Menu } = require("electron");
const { spawn } = require('child_process');

let mainWindow;

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
      // devTools: false,
      // For working with node.
      nodeIntegration: true,
      contextIsolation: false,
    },
  });
  mainWindow.loadURL(`file:\\\\${__dirname}\\views\\index.html`);
  // Menu.setApplicationMenu(null)
});

// Events from window.
// Events for anime.
ipcMain.on("search", (event, data) => {
  const searchResult = spawn("python", ["python/pyrun.py", "search", data]);
  searchResult.stdout.on('data', (result) => {
    // Extracting data from python file.
    let names = result.toString().split('\n')[0]
    let images = result.toString().split("\n")[1];
    
    // Converting data into array.
    images = images.replace(/['\[\]]/g, "");
    images = images.split(", ");

    names = names.replace(/['\[\]]/g, "");
    names = names.split(", ");
    
    // Sending data to front end.
    mainWindow.webContents.send("searchResult", [names, images]);
  })
});

// Might try to turn this 4 into 1 function.
ipcMain.on('downloadAll', (event, data) => {
  spawn("python", ["python/pyrun.py", "downloadAll", data]);
});
ipcMain.on("downloadBetween", (event, data) => {
  spawn("python", ["python/pyrun.py", "downloadBetween", data]);
});
ipcMain.on("downloadSelect", (event, data) => {
  spawn("python", ["python/pyrun.py", "downloadSelect", data]);
});
ipcMain.on("downloadPokemonhub", (event, data) => {
  spawn("python", ["python/pyrun.py", "downloadPokemonhub", data]);
});

ipcMain.on("getEpisodeList", (event, data) => {
  const episodeList = spawn("python", ["python/pyrun.py", "getEpisodeList", data]);
  episodeList.stdout.on("data", (result) => {
    mainWindow.webContents.send("episodeList", strToArray(result.toString()));
  });
});
