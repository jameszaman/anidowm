// Setting up electron.
const electron = require("electron");
const { ipcRenderer } = electron;

// Selecting elements.
let sauce = document.querySelector("#sauce");
const singleDownloadBtn = document.querySelector("#single-download-btn");
let start = document.querySelector("#start");
let end = document.querySelector("#end");
const rangeDownloadBtn = document.querySelector("#range-download-btn");

// Necessary variables.
const url = "https://anidownserver.jameshedayet.repl.co";

singleDownloadBtn.addEventListener("click", () => {
  const tempSuace = sauce.value;
  sauce.value = '';
  fetch(`${url}/getnpokemonurls?id=${tempSuace}`)
    .then((res) => res.json())
    .then((data) => {
      ipcRenderer.send("NPokemonDownload", data);
    });
});

rangeDownloadBtn.addEventListener("click", () => {
  const tempStart = start.value;
  const tempEnd = end.value;
  start.value = '';
  end.value = '';
  for(let i = Number(tempStart); i <= Number(tempEnd); ++i) {
    fetch(`${url}/getnpokemonurls?id=${i}`)
    .then((res) => res.json())
    .then((data) => {
        ipcRenderer.send("NPokemonDownload", data);
    });
  }
});
