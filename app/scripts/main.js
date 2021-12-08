const WELCOME_TEXT = 'Welcome, ';
const welcomeHook = document.getElementById('welcome');
const hook = document.getElementById('hook');
const searchInput = document.getElementById('search');
const searchButton = document.getElementById('search-icon');
const dummySearchButton = document.getElementById('dummy-search-button');
const clearSearchButton = document.getElementById('clear-icon');
const logoutButton = document.getElementById('logout-button');

[searchButton, dummySearchButton].forEach(button =>
  button.addEventListener('click', event => {
    event.preventDefault();
    console.log('called');
    // TODO call searchHandler (util.js)
  })
);

const formattedText = WELCOME_TEXT.concat(sessionStorage.getItem('username'));
welcomeHook.textContent = formattedText;

// Clear search input when the little x is clicked
clearSearchButton.addEventListener('click', () => (searchInput.value = null));
// Redirect user to login screen, clear sessionStorage
logoutButton.addEventListener('click', event => {
  event.preventDefault();
  sessionStorage.removeItem('username');
  window.location.replace('./index.html');
});
