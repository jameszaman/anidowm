// Setting up electron.
const electron = require("electron");
const { ipcRenderer } = electron;

// Selecting elements.
const searchResultContainer = document.querySelector("#search-result-container");
const searchText = document.querySelector("#search-text");
const searchForm = document.querySelector("#search-form");
const downloadPopup = document.querySelector("#download-popup");
const downloadAllBtn = document.querySelector("#download-all-btn");
const downloadBetweenBtn = document.querySelector("#download-between-btn");
const selectDownloadBtn = document.querySelector("#select-download-btn");
const initialButtons = document.querySelector("#initial-buttons");
const downloadBetween = document.querySelector("#download-between");
const selectDownload = document.querySelector("#select-download");
const downloadBetweenEpisode = document.querySelector("#download-between-episode");
const downloadSelectEpisode = document.querySelector("#download-select-episode");
const downloadBetweenStart = document.querySelector("#download-between-start");
const downloadBetweenEnd = document.querySelector("#download-between-end");
const optionContainer = document.querySelector("#option-container");
const deleteBtn = document.querySelector("#delete-btn");
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
searchForm.addEventListener("submit", (e) => {
  e.preventDefault();
  fetch(`
    https://anidownserver.jameshedayet.repl.co/searchanimes?anime=${searchText.value}
  `)
    .then((res) => res.json())
    .then((datas) => {
      // Clearing previous search results and searchbar.
      searchText.value = ''
      deleteChilds(searchResultContainer);

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
          // First is the name, second is the url.
          anime = [data.replace(":", ''), datas[2][index]];
          selectedEpisodes = [];
          downloadPopup.classList.remove("hidden");
          initialButtons.classList.remove("hidden");
          downloadBetween.classList.add("hidden");
          selectDownload.classList.add("hidden");
        });
        // Appending all the elements.
        info.appendChild(animeName);
        info.appendChild(downloadButton);
        searchResult.appendChild(animeImage);
        searchResult.appendChild(info);
        searchResultContainer.appendChild(searchResult);
      });
    });
  // ipcRenderer.send("search", searchText.value);
});

downloadAllBtn.addEventListener("click", () => {
  downloadPopup.classList.add("hidden");
  ipcRenderer.send("downloadAll", anime);
});

// When recived the episodes list,

// HTML Events.
downloadBetweenBtn.addEventListener("click", () => {
  initialButtons.classList.add('hidden');
  downloadBetween.classList.remove('hidden');
});

selectDownloadBtn.addEventListener("click", () => {
  // Remove any previoys checkbox option before showing.
  while (optionContainer.firstChild) {
    optionContainer.removeChild(optionContainer.firstChild);
  }
  // Make downloadButton visible.
  initialButtons.classList.add("hidden");
  selectDownload.classList.remove("hidden");
  // Get episodes List and render them as options.
  fetch(
    `https://anidownserver.jameshedayet.repl.co/getepisodes?anime=${anime[1]}`
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
  downloadPopup.classList.add("hidden");
  ipcRenderer.send("downloadBetween", [anime[0], anime[1],
    downloadBetweenStart.value, downloadBetweenEnd.value
  ]);
});

// Event for downloading selected episodes.
downloadSelectEpisode.addEventListener("click", () => {
  downloadPopup.classList.add("hidden");
  ipcRenderer.send("downloadSelect", [anime, selectedEpisodes]);
});
deleteBtn.addEventListener("click", () => {
  downloadPopup.classList.add('hidden');
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
