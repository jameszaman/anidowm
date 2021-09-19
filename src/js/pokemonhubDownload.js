// This is necessary for some websites.
const user_agent =
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:90.0) Gecko/20100101 Firefox/90.0";

async function downloadPokemon(url, title) {
  // Satatizing title.
  title = sanatize(title);

  // Making sure the Downloads/Anidown folder exists.
  // Also getting the path.
  targetFolder = makeFolder();
  addToProgressbar(`${targetFolder}/${title}.mp4`, url);
  download(url, `${targetFolder}/${title}.mp4`);
}

