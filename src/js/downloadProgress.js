// Modules
const axios = require('axios');
const fs = require('fs');

// Necessary variables.
let progressContainer = { downloading: [], downloaded: [], incomplete: [], deleted: [] };
let showProgressId = 0;

// Turning the localStorage into an array.
const keys = Object.keys(localStorage);
keys.forEach(key => {
  try {
    const stat = fs.statSync(key);
    const itemSize = localStorage.getItem(key).split(' ')[1];
    if(stat.size == itemSize) {
      progressContainer.downloaded.push({
        name: key,
        url: localStorage.getItem(key),
      });
    }
    else {
      progressContainer.incomplete.push({
        name: key,
        url: localStorage.getItem(key),
      });
    }
  }
  catch(e) {
    progressContainer.deleted.push({
      name: key,
      url: localStorage.getItem(key),
    });
  }
});

// All functions.
async function addToProgressbar(name, url) {
  // Getting the size of the file.
  const data = await axios.head(url);
  const size = data.headers["content-length"];

  // Saving in name: url status size
  localStorage.setItem(name, `${url} downloading ${size}`);
}

function showProgressbar() {
  // making sure progressbar is not alredy showing.
  clearInterval(showProgressId);
  
  // Showing progress.
  showProgressId = setInterval(() => {
    progressContainer.downloading.forEach((progress) => {
      // Extracting data about all the downloads.
      const progressSplitted = progress.url.split(" ");
      const locationSplit = progress.name.split("/");
      const name = locationSplit[locationSplit.length - 1];
      // Getting the size of how much downloaded.
      const stat = fs.statSync(progress.name);
      const downloadProgress = (stat.size/progressSplitted[2] * 100).toFixed(3);
      // Stop showing the output when it reaches 100%
      if(downloadProgress > 99) {
        progressContainer.downloaded.push(progress);
        // Removing the element.
        progressContainer.downloading = progressContainer.downloading.filter(prog => prog != progress);
      }
      else {
        // Showing the output.
        console.log(`${name}: ${downloadProgress}% completed.`);
      }
    });
  }, 5000);
}

function stopShowingProgressbar() {
  clearInterval(showProgressId);
}