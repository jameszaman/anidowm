// Setting up electron.
const electron = require("electron");
const { ipcRenderer } = electron;

// Selecting elements.
const searchText = document.querySelector("#search-text");
const searchForm = document.querySelector("#search-form");
const searchResultContainer = document.querySelector("#search-result-container");

// Functions.
function deleteChilds(element) {
  while(element.firstChild) {
    element.removeChild(element.firstChild);
  }
}

function addSearchResult(data) {
  // Creating elements.
  const searchResult = document.createElement("div");
  const animeImage = document.createElement("img");
  const info = document.createElement("div");
  const animeName = document.createElement("h3");
  const downloadButton = document.createElement("button");
  // Adding data to elements.
  animeImage.src = data[1];
  animeName.innerText = data[2];
  downloadButton.innerText = "Download";
  // Adding classes.
  searchResult.classList.add("search-result");
  animeImage.classList.add("anime-image");
  info.classList.add("info");
  downloadButton.classList.add("btn");
  // Adding events.
  downloadButton.addEventListener("click", () => {
    ipcRenderer.send("downloadPokemonhub", data[0]);
  });
  // Appending all the elements.
  info.appendChild(animeName);
  info.appendChild(downloadButton);
  searchResult.appendChild(animeImage);
  searchResult.appendChild(info);
  searchResultContainer.appendChild(searchResult);
}

// Starting page videos.
fetch(
  `https://anidownserver.jameshedayet.repl.co/getpokemonhubvideo`
)
.then((res) => res.json())
.then((datas) => {
  datas.forEach((data) => {
    addSearchResult(data);
  });
});

// Events.
searchForm.addEventListener("submit", (e) => {
  e.preventDefault();
  // Deleting previous results.
  deleteChilds(searchResultContainer);

  // Getting videos and showing them as result.
  fetch(
    `https://anidownserver.jameshedayet.repl.co/getpokemonhubvideo?search=${searchText.value}`
  )
  .then((res) => res.json())
  .then((datas) => {
    datas.forEach((data) => {
      addSearchResult(data);
    });
  });
});
