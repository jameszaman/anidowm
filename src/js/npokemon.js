// Selecting elements.
let sauce = document.querySelector("#sauce");
const singleDownloadBtn = document.querySelector("#single-download-btn");
let start = document.querySelector("#start");
let end = document.querySelector("#end");
const rangeDownloadBtn = document.querySelector("#range-download-btn");

// Necessary variables.
const url = "https://anidown.herokuapp.com";

singleDownloadBtn.addEventListener("click", () => {
  const tempSuace = sauce.value;
  sauce.value = '';
  fetch(`${url}/getnpokemonurls?id=${tempSuace}`)
    .then((res) => res.json())
    .then((data) => {
      // data[0] is id, data[1] is name, data[2] urls.
      // Need to save the name in the database.
      downloadNPokemon(data[0], data[2]);
    });
});

rangeDownloadBtn.addEventListener("click", async () => {
  const tempStart = start.value;
  const tempEnd = end.value;
  start.value = '';
  end.value = '';
  for(let i = Number(tempStart); i <= Number(tempEnd); ++i) {
    await fetch(`${url}/getnpokemonurls?id=${i}`)
    .then((res) => res.json())
    .then((data) => {
      // data[0] is id, data[1] is name, data[2] urls.
      // Need to save the name in the database.
      downloadNPokemon(data[0], data[2]);
    });
  }
});
