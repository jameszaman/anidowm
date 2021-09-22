// Selecting elements.
const dropdownButton = document.querySelector('#dropdown-button');
const navDropdown = document.querySelector("#nav-dropdown");


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
