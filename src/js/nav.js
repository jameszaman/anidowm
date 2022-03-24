// Selecting elements.
const dropdownButton = document.querySelector('#dropdown-button');
const navDropdown = document.querySelector("#nav-dropdown");
const navAnchors = document.querySelectorAll('.nav-container .navitem');
const webPages = document.querySelectorAll('main .webpage');

// Events
dropdownButton.addEventListener('click', () => {
  if(navDropdown.classList.contains('nav-dropdown-hidden')) {
    navDropdown.classList.remove('nav-dropdown-hidden');
    showProgress();
  }
  else {
    navDropdown.classList.add("nav-dropdown-hidden");
    stopShowingProgress();
  }
});

// Code for hanling the SPA aspect of the page.
navAnchors.forEach((navAnchor, index) => {
  navAnchor.addEventListener('click', (e) => {
    e.preventDefault();
    webPages.forEach((webpage, webPageIndex) => {
      if(index == webPageIndex) {
        webpage.classList.remove('hidden');
      }
      else {
        webpage.classList.add('hidden');
      }
    })
  })
})
