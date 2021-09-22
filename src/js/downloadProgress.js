// Modules
const axios = require('axios');
const fs = require('fs');

// Necessary variables.
let progressContainer = { downloading: [], incomplete: [], deleted: [] };
let showProgressId = 0;

function showInProgressbar(path, cssClass, size) {
  // getting name from path.
  const pathSplit = path.split("/");
  const name = pathSplit[pathSplit.length - 1];

  // creating necessary elements.
  const downloadContainer = document.createElement("div");
  const downloadName = document.createElement("p");
  const deleteButton = document.createElement("button");

  // Adding classes.
  downloadName.classList.add("name");
  deleteButton.classList.add("delete-button");
  
  // Setting values.
  downloadName.innerText = name;
  deleteButton.innerHTML = "&#9587;";

  // Adding functionality.
  deleteButton.addEventListener("click", () => {
    deleteFromProgessbar(downloadContainer, path);
  });

  if (cssClass === "downloading") {
    // creating necessary elements for showing download progress.
    const downloadInfo = document.createElement("div");
    const textProgress = document.createElement("p");
    const visualProgress = document.createElement("div");
    const progress = document.createElement("div");

    // Setting values.
    textProgress.innerText = `${size} %`;

    // Adding classes.
    downloadInfo.classList.add("download-info");
    textProgress.classList.add("text-progress");
    visualProgress.classList.add("visual-progress");
    progress.classList.add("progress");

    // Appending elements.
    downloadContainer.appendChild(downloadName);
    downloadContainer.appendChild(downloadInfo);
    downloadContainer.appendChild(deleteButton); 
    downloadInfo.appendChild(textProgress);
    downloadInfo.appendChild(visualProgress);
    visualProgress.appendChild(progress);
    navDropdown.insertBefore(downloadContainer, navDropdown.firstChild);
  } else {
    // Creating elements.
    const downloadMessage = document.createElement("p");

    // Setting values.
    if (cssClass === "download-complete") {
      downloadMessage.innerText = 'Download Completed';
    }
    else if (cssClass === "download-deleted") {
      downloadMessage.innerText = 'Already Deleted';
    }
    else {
      downloadMessage.innerText = 'Message not found.'
    }
    // Adding classes.
    downloadContainer.classList.add(cssClass);

    // Appending elements.
    downloadContainer.appendChild(downloadName);
    downloadContainer.appendChild(deleteButton);
    downloadContainer.appendChild(downloadMessage);
    navDropdown.appendChild(downloadContainer);
  }

  return downloadContainer;
}

function markAsDownloaded(element) {
  // Removing the download progress.
  element.removeChild(element.childNodes[1]);
  // Adding complete message.
  const downloadMessage = document.createElement("p");
  downloadMessage.innerText = "Download Completed";
  element.classList.add("download-complete");
  element.appendChild(downloadMessage);
}

function deleteFromProgessbar(element, key) {
  localStorage.removeItem(key)
  navDropdown.removeChild(element);
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
      showInProgressbar(key, "download-complete");
    }
    else {
      const downloadProgress = showInProgressbar(
        key,
        "downloading",
        ((stat.size / itemSize) * 100).toFixed(3),
        key
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
    showInProgressbar(key, "download-deleted");
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
  const downloadProgress = showInProgressbar(location, "downloading", 0);
  progressContainer.downloading.push({ location, name, downloadProgress, size });
}

function showProgress(container) {
  // making sure progressbar is not alredy showing.
  clearInterval(showProgressId);
  
  
  // Update progress.
  showProgressId = setInterval(() => {
    progressContainer.downloading.forEach((progress) => {
      // Getting the size of how much downloaded.
      let downloadProgress;
      try {
        const stat = fs.statSync(progress.location);
        downloadProgress = (stat.size / progress.size * 100).toFixed(3);
      }
      catch (e) {
        downloadProgress = '0.000';
      }

      // Stop showing the output when it reaches 100%
      if(downloadProgress === '100.000') {
        // Removing the element.
        progressContainer.downloading = progressContainer.downloading.filter(prog => prog != progress);
        markAsDownloaded(progress.downloadProgress);
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
  }, 1000);
}

function stopShowingProgress() {
  clearInterval(showProgressId);
}