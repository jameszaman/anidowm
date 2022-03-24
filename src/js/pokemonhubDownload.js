async function downloadPokemon(url, title) {
  // Satatizing title.
  title = sanatize(title);

  // Making sure the Downloads/Anidown folder exists.
  // Also getting the path.
  targetFolder = makeFolder();
  trackDownloadProgress(`${targetFolder}/${title}.mp4`, url);
  download(url, `${targetFolder}/${title}.mp4`);
}

