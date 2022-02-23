async function downloadNPokemon(name, urls) {
  // Shortening long names.
  if (name.length > 150) {
    name = name.substr(0, 150);
  }
  
  // Creating a folder to store the manga.
  const targetFolder = makeFolder(name);
  // Downloading all the pages.
  for (const index in urls) {
    // Getting the page no.
    let page = urls[index].split("/");
    page = page[page.length - 1];
    // Downloading the page.
    download(urls[index], `${targetFolder}/${page}`);
  }
}
