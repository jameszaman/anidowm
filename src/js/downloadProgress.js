// Modules
const axios = require('axios');

// Necessary variables.
const progressContainer = [];
let showProgressId = 0;

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
  // Turning the localStorage into an array.
  progressContainer = [];
  const keys = Object.keys(localStorage);
  keys.forEach(key => {
    progressContainer.push({name: key, url: localStorage.getItem(key)});
  });
  showProgressId = setInterval(() => {
    progressContainer.forEach((progress) => {
      console.log(progress);
    });
  }, 5000);
}

function stopShowingProgressbar() {
  clearInterval(showProgressId);
}