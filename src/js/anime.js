// Setting up electron.
const electron = require("electron");

// Selecting elements.
const animeSearchResultContainer = document.querySelector("#anime-search-result-container");
const animeSearchText = document.querySelector("#anime-search-text");
const animeSearchForm = document.querySelector("#anime-search-form");
const animeDownloadPopup = document.querySelector("#anime-download-popup");
const downloadAllBtn = document.querySelector("#download-all-btn");
const downloadBetweenBtn = document.querySelector("#download-between-btn");
const selectDownloadBtn = document.querySelector("#select-download-btn");
const animeInitialButtons = document.querySelector("#anime-initial-buttons");
const downloadBetween = document.querySelector("#download-between");
const selectDownload = document.querySelector("#select-download");
const downloadBetweenEpisode = document.querySelector("#download-between-episode");
const downloadSelectEpisode = document.querySelector("#download-select-episode");
const downloadBetweenStart = document.querySelector("#download-between-start");
const downloadBetweenEnd = document.querySelector("#download-between-end");
const optionContainer = document.querySelector("#option-container");
const animeDeleteBtn = document.querySelector("#anime-delete-btn");
const body = document.querySelector("body");

// Global variables.
let anime;
let selectedEpisodes = [];

// Functions.
function deleteChilds(element) {
  while(element.firstChild) {
    element.removeChild(element.firstChild);
  }
}

// Electron events.
animeSearchForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const searchValue = animeSearchText.value;
  animeSearchText.value = "";
  fetch(`
    https://anidown.herokuapp.com/searchanimes?anime=${searchValue}
  `)
    .then((res) => res.json())
    .then((datas) => {
      // Clearing previous search results and searchbar.
      deleteChilds(animeSearchResultContainer);

      // Adding all the data to the page.
      datas[0].forEach((data, index) => {
        // Creating elements.
        const searchResult = document.createElement("div");
        const animeImage = document.createElement("img");
        const info = document.createElement("div");
        const animeName = document.createElement("h3");
        const downloadButton = document.createElement("button");
        // Adding data to elements.
        animeImage.src = datas[1][index];
        animeImage.loading = "lazy";
        animeName.innerText = data;
        downloadButton.innerText = "Download";
        // Adding classes.
        searchResult.classList.add("search-result");
        animeImage.classList.add("anime-image");
        animeImage.classList.add("anime-image-lazy");
        info.classList.add("info");
        downloadButton.classList.add("btn");
        // Adding events.
        downloadButton.addEventListener("click", () => {
          // folder name and urls cannot have :
          // Some anime has extra spaces at start/end which creates problems.
          // First is the name, second is the url.
          anime = [data.replace(":", "").trim(), datas[2][index]];
          selectedEpisodes = [];
          animeDownloadPopup.classList.remove("hidden");
          animeInitialButtons.classList.remove("hidden");
          downloadBetween.classList.add("hidden");
          selectDownload.classList.add("hidden");
        });
        // Appending all the elements.
        info.appendChild(animeName);
        info.appendChild(downloadButton);
        searchResult.appendChild(animeImage);
        searchResult.appendChild(info);
        animeSearchResultContainer.appendChild(searchResult);
      });
    });
});

downloadAllBtn.addEventListener("click", () => {
  animeDownloadPopup.classList.add("hidden");
  downloadAll(anime[0], anime[1]);
});

// When recived the episodes list,

// HTML Events.
downloadBetweenBtn.addEventListener("click", () => {
  animeInitialButtons.classList.add('hidden');
  downloadBetween.classList.remove('hidden');
});

selectDownloadBtn.addEventListener("click", () => {
  // Remove any previoys checkbox option before showing.
  while (optionContainer.firstChild) {
    optionContainer.removeChild(optionContainer.firstChild);
  }
  // Make downloadButton visible.
  animeInitialButtons.classList.add("hidden");
  selectDownload.classList.remove("hidden");
  // Get episodes List and render them as options.
  fetch(
    `https://anidown.herokuapp.com/getepisodes?anime=${anime[1]}`
  )
  .then(res => res.json())
  .then(datas => {
    // Creating Elements.
    datas.forEach((data, index) => {
      const checkboxInput = document.createElement("input");
      const checkboxLabel = document.createElement("label");
      // Fixing/Adding attribte.
      checkboxInput.type = "checkbox";
      checkboxInput.id = `checkbox_${data}`;
      checkboxLabel.innerText = data;
      checkboxLabel.htmlFor = `checkbox_${data}`;
      // Adding classes.
      checkboxInput.classList.add("checkbox");
      // Adding elements to parents.
      optionContainer.appendChild(checkboxInput);
      optionContainer.appendChild(checkboxLabel);
      // Adding functions.
      checkboxInput.addEventListener("change", () => {
        // When checked add it to the selectedEpisodes array.
        if (checkboxInput.checked) {
          selectedEpisodes.push(index);
        } else {
          // And remove it when it is unchecked.
          selectedEpisodes = selectedEpisodes.filter(
            (episode) => episode !== index
          );
        }
      });
    });
  })
});

// Event for downloading episodes in range.
downloadBetweenEpisode.addEventListener("click", () => {
  animeDownloadPopup.classList.add("hidden");
  // Converting the range into an array.
  const episodeList = [];
  const start = Number(downloadBetweenStart.value) - 1;
  const end = Number(downloadBetweenEnd.value) - 1;
  for (let i = start; i <= end; i++) {
    episodeList.push(i);
  }
  // Downloading the episode.
  downloadSelect(anime[0], anime[1], episodeList);
});

// Event for downloading selected episodes.
downloadSelectEpisode.addEventListener("click", () => {
  animeDownloadPopup.classList.add("hidden");
  downloadSelect(anime[0], anime[1], selectedEpisodes);
});
animeDeleteBtn.addEventListener("click", () => {
  animeDownloadPopup.classList.add('hidden');
})

// Event for update window.
ipcRenderer.on("will-update", () => {
  // Deleteing everything else on screen first.
  deleteChilds(body);

  // Creating elements.
  const updatePopupContainer = document.createElement("div");
  const updatePopup = document.createElement("div");
  const p1 = document.createElement("p");
  const p2 = document.createElement("p");
  // Adding data.
  p1.innerText = "DOWNLOADING UPDATE...";
  p2.innerText = "PLEASE WAIT...";
  // Adding classes.
  updatePopupContainer.classList.add("update-popup-container");
  updatePopup.classList.add("update-popup");
  // Appending childs.
  updatePopup.appendChild(p1);
  updatePopup.appendChild(p2);
  updatePopupContainer.appendChild(updatePopup);
  body.appendChild(updatePopupContainer);
});
