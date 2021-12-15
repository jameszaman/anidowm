// Importing necessary modules.
const path = require('path');
const { spawn } = require('child_process');


async function download(url, filePath) {
  // We should not download the file if it already exists.
  // Extracting the file path.
  const fileDir = filePath.slice(
    0,
    Math.max(filePath.lastIndexOf("\\"), filePath.lastIndexOf("/"))
  );
  // Checking if a file already exists.
  const files = await fs.readdirSync(fileDir);
  const filePathSplit = filePath.split(/[\/\\]/gi);
  const fileAlreadyExists = files.includes(
    filePathSplit[filePathSplit.length - 1]
  );

  if (!fileAlreadyExists) {
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
      filePath = `[${filePath.toString()}]`;
    }

    // Downloading the file.
    spawn("python", [downloader, url, filePath]);
  }
};
