// Modules
const axios = require('axios');
const fs = require('fs');

// Necessary variables.
let progressContainer = { downloading: [], incomplete: [], deleted: [] };
let showProgressId = 0;

function showInProgressbar(name, cssClass) {
  const progressBar = document.createElement("p");
  if(cssClass === "downloading") {
    progressBar.innerText = `${name}: 0% completed.`;
  }
  else {
    progressBar.innerText = name;
  }
  progressBar.classList.add(cssClass);
  navDropdown.insertBefore(progressBar, navDropdown.firstChild);
  return progressBar;
}

// Turning the localStorage into an array.
const keys = Object.keys(localStorage);
keys.forEach(key => {
  // Extracting the name.
  const keySplit = key.split('/');
  const name = keySplit[keySplit.length - 1];
  
  try {
    // Getting size.
    const stat = fs.statSync(key);
    const itemSize = localStorage.getItem(key).split(' ')[1];

    if(stat.size == itemSize) {
      showInProgressbar(name, 'downloaded');
    }
    else {
      showInProgressbar(name, "incomplete");
    }
  }
  catch(e) {
    showInProgressbar(name, "deleted");
  }
});

// All functions.
async function addToProgressbar(location, url) {
  // Getting the size of the file.
  const data = await axios.head(url);
  const size = data.headers["content-length"];

  // Saving in localstorage. location: url size
  localStorage.setItem(location, `${url} ${size}`);

  const locationSplit = location.split("/");
  const name = locationSplit[locationSplit.length - 1];

  // Adding it to navDropdown and progressContainer to show it downloading.
  const downloadProgress = showInProgressbar(name, "downloading");
  progressContainer.downloading.push({ location, name, downloadProgress, size });
}

function showProgress(container) {
  // making sure progressbar is not alredy showing.
  clearInterval(showProgressId);
  
  
  // Update progress.
  showProgressId = setInterval(() => {
    progressContainer.downloading.forEach((progress) => {
      // Getting the size of how much downloaded.
      const stat = fs.statSync(progress.location);
      const downloadProgress = (stat.size / progress.size * 100).toFixed(3);

      // Stop showing the output when it reaches 100%
      if(downloadProgress === '100.000') {
        // Showing it as complete.
        progressContainer.downloaded.classList.remove('downloading');
        progressContainer.downloaded.classList.add('downloaded');
        // Removing the element.
        progressContainer.downloading = progressContainer.downloading.filter(prog => prog != progress);
      }
      else {
        // Showing the output.
        progress.downloadProgress.innerText = `${progress.name}: ${downloadProgress}% completed.`;
      }
    });
  }, 5000);
}

function stopShowingProgress() {
  clearInterval(showProgressId);
}