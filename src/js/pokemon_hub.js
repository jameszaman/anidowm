// Selecting elements.
const PHSearchText = document.querySelector("#ph-search-text");
const PHSearchForm = document.querySelector("#ph-search-form");
const PHSearchResultContainer = document.querySelector("#ph-search-result-container");
const PHDownloadPopup = document.querySelector("#ph-download-popup");
const PHDeleteBtn = document.querySelector("#ph-delete-btn");
const PHInitialButtons = document.querySelector("#ph-initial-buttons");
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
      PHDownloadPopup.classList.remove("hidden");
      // Delete all previous quality buttons.
      deleteChilds(PHInitialButtons);
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
          PHDownloadPopup.classList.add("hidden");
          downloadPokemon(data[`${quality}`], data["title"]);
        });
        // Appending all the elements.
        PHInitialButtons.appendChild(button);
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
        addSearchResult(result, PHSearchResultContainer);
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
      addSearchResult(data, PHSearchResultContainer);
    });
  }
});

// Events.
// Search in Pokemonhub.
PHSearchForm.addEventListener("submit", (e) => {
  e.preventDefault();
  // Deleting previous results and reseting necessary variables.
  alreadySearched = true;
  searchValue = PHSearchText.value;
  PHSearchText.value = "";
  curPage = 1;
  loadMoreFlag = true;
  deleteChilds(PHSearchResultContainer);
  // Deleting the header video.
  deleteChilds(headerVideo);

  // Getting videos and showing them as result.
  fetch(
    `https://anidown.herokuapp.com/getpokemonhubvideo?search=${searchValue}`
  )
    .then((res) => res.json())
    .then((datas) => {
      datas.forEach((data) => {
        addSearchResult(data, PHSearchResultContainer);
      });
    });
});

PHDeleteBtn.addEventListener("click", () => {
  PHDownloadPopup.classList.add("hidden");
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
          addSearchResult(data, PHSearchResultContainer);
        });
        loadMoreFlag = true;
      });
    }
  }
});

