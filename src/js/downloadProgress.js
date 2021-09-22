// Modules
const axios = require('axios');
const fs = require('fs');

// Necessary variables.
let progressContainer = { downloading: [], incomplete: [], deleted: [] };
let showProgressId = 0;

function showInProgressbar(name, cssClass, size) {
  // creating necessary elements.
  const downloadContainer = document.createElement("div");
  const downloadName = document.createElement("p");

  if(cssClass === "downloading") {
    // creating necessary elements for showing download progress.
    const downloadInfo = document.createElement("div");
    const textProgress = document.createElement("p");
    const visualProgress = document.createElement("div");
    const progress = document.createElement("div");

    // Setting values.
    downloadName.innerText = name;
    textProgress.innerText = `${size} %`;

    // Adding classes.
    downloadName.classList.add('name');
    downloadInfo.classList.add('download-info');
    textProgress.classList.add('text-progress');
    visualProgress.classList.add('visual-progress');
    progress.classList.add('progress');

    // Appending elements.
    downloadContainer.appendChild(downloadName);
    downloadContainer.appendChild(downloadInfo);
    downloadInfo.appendChild(textProgress);
    downloadInfo.appendChild(visualProgress);
    visualProgress.appendChild(progress);
    navDropdown.insertBefore(downloadContainer, navDropdown.firstChild);
  }
  else {
    downloadName.innerText = name;
    navDropdown.appendChild(downloadName);
  }
  downloadName.classList.add(cssClass);
  return downloadContainer;
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
      const downloadProgress = showInProgressbar(
        name,
        "downloading",
        ((stat.size / itemSize) * 100).toFixed(3)
      );
      progressContainer.downloading.push({
        location: key,
        name,
        downloadProgress,
        size: itemSize,
      });
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
  const downloadProgress = showInProgressbar(name, "downloading", 0);
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
        const textProgress = progress.downloadProgress.querySelector('.text-progress');
        const visualProgressAfter = progress.downloadProgress.querySelector(
          ".visual-progress .progress"
        );
        textProgress.innerText = `${downloadProgress} %`;
        visualProgressAfter.style.width = `${downloadProgress}%`;
      }
    });
  }, 5000);
}

function stopShowingProgress() {
  clearInterval(showProgressId);
}