// User defined modules.
const makeFolder = require("./makeFolder.js");
const download = require("./download.js");

// This is necessary for some websites.
const user_agent =
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:90.0) Gecko/20100101 Firefox/90.0";

async function downloadNPokemon(name, urls) {
  // Shortening long names.
  if (name.length > 150) {
    name = name.substr(0, 150);
    name += "...";
  }
  // Creating a folder to store the manga.
  const targetFolder = makeFolder(name);
  // Downloading all the pages.
  for(const url of urls) {
    // Getting the page no.
    let page = url.split('/');
    page = page[page.length - 1];
    // Downloading the page.
    download(url, `${targetFolder}/${page}`);
  }
}

module.exports = downloadNPokemon;