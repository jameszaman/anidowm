// This is necessary for some websites.
const user_agent =
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:90.0) Gecko/20100101 Firefox/90.0";

// This variables controls how long we will wait before starting download.
// This is used to make sure too many pages are not starting download together.
let waitTimer = 1;

async function downloadNPokemon(name, urls) {
  // Shortening long names.
  if (name.length > 150) {
    name = name.substr(0, 150);
  }
  
  // Creating a folder to store the manga.
  const targetFolder = makeFolder(name);
  // Downloading all the pages.
  for (const index in urls) {
    setTimeout(() => {
      // Getting the page no.
      let page = urls[index].split("/");
      page = page[page.length - 1];
      // Downloading the page.
      download(urls[index], `${targetFolder}/${page}`);
    }, waitTimer);
    waitTimer += 500;
  }
}
