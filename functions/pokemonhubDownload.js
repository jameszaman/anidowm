// Importing necessary modules.
const axios = require("axios");

// User defined modules.
const makeFolder = require("./makeFolder.js");
const download = require("./download.js");

// This is necessary for some websites.
const user_agent =
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:90.0) Gecko/20100101 Firefox/90.0";

async function downloadPokemon(url, title) {
  // Satatizing title.
  title = title.replace(/\n/g, "");
  title = title.replace(/\t/g, "");
  title = title.replace(/\//g, "");
  title = title.replace(/\\/g, "");
  title = title.replace(/:/g, "");
  title = title.replace(/"/g, "'");

  // Making sure the Downloads/Anidown folder exists.
  // Also getting the path.
  targetFolder = makeFolder();
  download(url, `${targetFolder}/${title}.mp4`);
}

module.exports = downloadPokemon;
