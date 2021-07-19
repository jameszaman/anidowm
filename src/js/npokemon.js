// Setting up electron.
const electron = require("electron");
const { ipcRenderer } = electron;

// Selecting elements.
const sauce = document.querySelector("#sauce");
const singleDownloadBtn = document.querySelector("#single-download-btn");
const start = document.querySelector("#start");
const end = document.querySelector("#end");
const rangeDownloadBtn = document.querySelector("#range-download-btn");

// Necessary variables.
const url = "https://anidownserver.jameshedayet.repl.co";

singleDownloadBtn.addEventListener("click", () => {
  fetch(`${url}/getnpokemonurls?id=${sauce.value}`)
  .then(res => res.json())
  .then(data => {
    ipcRenderer.send("NPokemonDownload", data);
  })
});

rangeDownloadBtn.addEventListener("click", () => {
  for(let i = Number(start.value); i <= Number(end.value); ++i) {
    fetch(`${url}/getnpokemonurls?id=${i}`)
    .then((res) => res.json())
    .then((data) => {
        ipcRenderer.send("NPokemonDownload", data);
    });
  }
});
