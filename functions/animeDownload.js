// Importing necessary modules.
const axios = require('axios');

// User defined modules.
const makeFolder = require('./makeFolder');
const download = require('./download');
const sanatize = require('./sanatize');

// This is necessary for some websites.
const user_agent =
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:90.0) Gecko/20100101 Firefox/90.0";


async function downloadAll(name, url) {
  // Extracting all the episode links.
  url = `https://anidownserver.jameshedayet.repl.co/getanimeepisodelink?anime=${url}`;
  let episode_urls = await axios.get(url);
  episode_urls = episode_urls.data;

  // Sanatizing name.
  name = sanatize(name);

  // Creating the folder for storing the anime.
  target_foler = makeFolder([name]);

  // The filename for all the animes.
  const anime_names = [];
  episode_urls.forEach((url) => {
    const episode = url.split("episode-")[1];
    anime_names.push(`${target_foler}/${name} ${episode}.mp4`);
  });
  
  // Download urls for all anime
  const download_urls = [];
  
  for (anime of episode_urls) {
    url = `https://anidownserver.jameshedayet.repl.co/getanimedownloadurl?anime=${anime}`;
    let video_url = await axios.get(url);
    download_urls.push(video_url.data);
  }
  
  // Downloading all the episodes.
  download(download_urls, anime_names);
}

async function downloadSelect(name, url, episodeList) {
  // Extracting all the episode links.
  url = `https://anidownserver.jameshedayet.repl.co/getanimeepisodelink?anime=${url}`;
  let episode_urls = await axios.get(url);
  episode_urls = episode_urls.data;

  // Creating the folder for storing the anime.
  target_foler = makeFolder([name]);

  const anime_names = [];
  const download_urls = [];
  for(index of episodeList) {
    // The filename for the animes.
    const episode = episode_urls[index].split("episode-")[1];
    anime_names.push(`${target_foler}/${name} ${episode}.mp4`);
    // Download urls for the anime.
    url = `https://anidownserver.jameshedayet.repl.co/getanimedownloadurl?anime=${episode_urls[index]}`;
    let video_url = await axios.get(url);
    download_urls.push(video_url.data);
  }
  console.log(download_urls);
  // Downloading all the episodes.
  download(download_urls, anime_names);
}

module.exports.downloadAll = downloadAll;
module.exports.downloadSelect = downloadSelect;
