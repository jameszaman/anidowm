// Importing necessary modules.
const path = require('path');
const https = require("https");
const { spawn } = require('child_process');

async function downloadSingleFile(url, filePath) {
  https.get(url, (res) => {
    // Open file in local filesystem
    const file = fs.createWriteStream(filePath);
    // Write data into local file
    res.pipe(file);
    // Close the file
    file.on("finish", () => {
      file.close();
      return true;
    });
  })
  .on("error", (err) => {
    console.log("Error: ", err.message);
    return false;
  });
}

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
    // Downloading accordingly if either array of urls/paths or single url/path was sent.
    if (Array.isArray(url)) {
      url.forEach((url, index) => {
        downloadSingleFile(url, filePath[index]);
      })
      url = `[${url.toString()}]`;
      filePath = `[${filePath.toString()}]`;
    }
    else {
      // Downloading the file.
      downloadSingleFile(url, filePath);
    }
  }
};
