// Selecting elements.
const dropdownButton = document.querySelector('#dropdown-button');
const navDropdown = document.querySelector("#nav-dropdown");


// Events
dropdownButton.addEventListener('click', () => {
  if(navDropdown.classList.contains('hidden')) {
    navDropdown.classList.remove('hidden');
    showProgress();
  }
  else {
    navDropdown.classList.add("hidden");
    stopShowingProgress();
  }
});
