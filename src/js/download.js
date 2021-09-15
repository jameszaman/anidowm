// Importing necessary modules.
const path = require('path');
const { spawn } = require('child_process');


module.exports = function (url, name) {
  // This is the path for python download file.
  // Need different path for development and production.
  // *** This needs to be inside the function,***
  // *** or global.appPath is undefined as app was not initialized yet. ***
  if (process.env.DEVELOPMENT) {
    downloader = "python/download.py";
  } else {
    downloader = path.join(global.appPath, "..", "python/download.py");
  }

  // If arguments are array, pass them in array format for python.
  if (Array.isArray(url)) {
    url = `[${url.toString()}]`;
    name = `[${name.toString()}]`;
  }

  // Downloading the file.
  spawn("python", [downloader, url, name]);
};
