// Setting up electron.
const electron = require("electron");
const { ipcRenderer } = electron;

// Selecting elements.
const searchText = document.querySelector("#search-text");
const searchForm = document.querySelector("#search-form");
const searchResultContainer = document.querySelector("#search-result-container");
const downloadPopup = document.querySelector("#download-popup");
const deleteBtn = document.querySelector("#delete-btn");
const initialButtons = document.querySelector("#initial-buttons");

// Global variables.
let searchValue;
let curPage = 1;
let loadMoreFlag = true;


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
  animeImage.loading = 'lazy';
  animeName.innerText = data[2];
  downloadButton.innerText = "Download";
  // Adding classes.
  searchResult.classList.add("search-result");
  animeImage.classList.add("anime-image");
  animeImage.classList.add("pokemon-hub-image");
  info.classList.add("info");
  downloadButton.classList.add("btn");
  // Adding events.
  downloadButton.addEventListener("click", () => {
    fetch(
      `https://anidownserver.jameshedayet.repl.co/getpokemonhuburl?pokemon=${data[0]}`
    )
    .then(res => res.json())
    .then(data => {
      downloadPopup.classList.remove('hidden');
      // Delete all previous quality buttons.
      deleteChilds(initialButtons);
      // Add a button for each quality.
      data["quality"].forEach(quality => {
        // Creating elements.
        const button = document.createElement("button");
        // Adding data to elements.
        button.innerText = quality;
        // Adding classes.
        button.classList.add("btn");
        // Adding events.
        button.addEventListener("click", () => {
          downloadPopup.classList.add("hidden");
          ipcRenderer.send("downloadPokemonhub", [data[`s${quality}`], data['title']]);
        });
        // Appending all the elements.
        initialButtons.appendChild(button);
      })
    })
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
  // Deleting previous results and clearing searchbar.
  deleteChilds(searchResultContainer);
  searchValue = searchText.value;
  searchText.value = "";
  curPage = 1;

  // Getting videos and showing them as result.
  fetch(
    `https://anidownserver.jameshedayet.repl.co/getpokemonhubvideo?search=${searchValue}`
  )
    .then((res) => res.json())
    .then((datas) => {
      datas.forEach((data) => {
        addSearchResult(data);
      });
    });
});

deleteBtn.addEventListener("click", () => {
  downloadPopup.classList.add("hidden");
});

// Load more images on reaching end of page.
window.addEventListener("scroll", () => {
  if(window.innerHeight + window.scrollY >= document.body.offsetHeight) {
    if(loadMoreFlag) {
      loadMoreFlag = false;
      curPage++;
      fetch(`
        https://anidownserver.jameshedayet.repl.co/getpokemonhubvideo?search=${searchValue}&page=${curPage}
      `)
      .then((res) => res.json())
      .then((datas) => {
        datas.forEach((data) => {
          addSearchResult(data);
        });
        loadMoreFlag = true;
      });
    }
  }
});

