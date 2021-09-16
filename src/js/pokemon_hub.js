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
const headerVideo = document.querySelector("#header-video");

// Global variables.
let searchValue;
let curPage = 1;
let loadMoreFlag = false;
let alreadySearched = false;


// Functions.
function deleteChilds(element) {
  while(element.firstChild) {
    element.removeChild(element.firstChild);
  }
}

function addSearchResult(data, container) {
  // Creating elements.
  const searchResult = document.createElement("div");
  const animeImage = document.createElement("img");
  const info = document.createElement("div");
  const animeName = document.createElement("h3");
  const downloadButton = document.createElement("button");
  // Adding data to elements.
  animeImage.src = data[1];
  animeImage.loading = "lazy";
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
      `https://anidown.herokuapp.com/getpokemonhuburl?pokemon=${data[0]}`
    )
    .then((res) => res.json())
    .then((data) => {
      downloadPopup.classList.remove("hidden");
      // Delete all previous quality buttons.
      deleteChilds(initialButtons);
      // Add a button for each quality.
      data["quality"].forEach((quality) => {
        // Creating elements.
        const button = document.createElement("button");
        // Adding data to elements.
        button.innerText = quality;
        // Adding classes.
        button.classList.add("btn");
        // Adding events.
        button.addEventListener("click", () => {
          downloadPopup.classList.add("hidden");
          console.log(data[`${quality}`], data["title"]);
          ipcRenderer.send("downloadPokemonhub", [
            data[`${quality}`],
            data["title"],
          ]);
        });
        // Appending all the elements.
        initialButtons.appendChild(button);
      });
    });
  });

  animeImage.addEventListener("click", () => {
    // Reseting necessary values.
    window.scrollTo(0, 0);
    loadMoreFlag = false;
    // Getting related videos.
    fetch(
      `https://anidown.herokuapp.com/getpokemonhubrelatedvideo?viewkey=${
        data[0].split("viewkey=")[1]
      }`
    )
    .then((res) => res.json())
    .then((results) => {
      // Changing the header video.
      deleteChilds(headerVideo);
      addSearchResult(data, headerVideo);
      // Adding a hr line to differentiate them.
      const hr = document.createElement("hr");
      hr.classList.add('max-hr');
      headerVideo.appendChild(hr);
      // Changing search results.
      deleteChilds(container);
      results.forEach((result) => {
        addSearchResult(result, searchResultContainer);
      });
    });
  });
  // Appending all the elements.
  info.appendChild(animeName);
  info.appendChild(downloadButton);
  searchResult.appendChild(animeImage);
  searchResult.appendChild(info);
  container.appendChild(searchResult);
}

// Starting page videos.
fetch(
  `https://anidown.herokuapp.com/getpokemonhubvideo`
)
.then((res) => res.json())
.then((datas) => {
  if(!alreadySearched) {
    datas.forEach((data) => {
      addSearchResult(data, searchResultContainer);
    });
  }
});

// Events.
// Search in Pokemonhub.
searchForm.addEventListener("submit", (e) => {
  e.preventDefault();
  // Deleting previous results and reseting necessary variables.
  alreadySearched = true;
  searchValue = searchText.value;
  searchText.value = "";
  curPage = 1;
  loadMoreFlag = true;
  deleteChilds(searchResultContainer);
  // Deleting the header video.
  deleteChilds(headerVideo);

  // Getting videos and showing them as result.
  fetch(
    `https://anidown.herokuapp.com/getpokemonhubvideo?search=${searchValue}`
  )
    .then((res) => res.json())
    .then((datas) => {
      datas.forEach((data) => {
        addSearchResult(data, searchResultContainer);
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
        https://anidown.herokuapp.com/getpokemonhubvideo?search=${searchValue}&page=${curPage}
      `)
      .then((res) => res.json())
      .then((datas) => {
        datas.forEach((data) => {
          addSearchResult(data, searchResultContainer);
        });
        loadMoreFlag = true;
      });
    }
  }
});

