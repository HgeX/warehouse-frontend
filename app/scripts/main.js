// True constants
const WELCOME_TEXT = 'Welcome, ';
const ORDERS_URL = 'http://www.cc.puv.fi/~asa/json/project.json';
// Not so constant constants lol
const welcomeHook = document.getElementById('welcome');
const hook = document.getElementById('hook');
const searchInput = document.getElementById('search');
const searchButton = document.getElementById('search-icon');
const dummySearchButton = document.getElementById('dummy-search-button');
const clearSearchButton = document.getElementById('clear-icon');
const logoutButton = document.getElementById('logout-button');
const loadingText = document.getElementById('loading-text');

[searchButton, dummySearchButton].forEach(button =>
  button.addEventListener('click', event => handleSearch(event))
);

function handleSearch(event) {
  event.preventDefault();
  const search = searchInput.value;
  if (search) {
    searchHandler(search);
  }
}

const formattedText = WELCOME_TEXT.concat(sessionStorage.getItem('username'));
welcomeHook.textContent = formattedText;

// Clear search input when the little x is clicked
clearSearchButton.addEventListener('click', () => (searchInput.value = null));
// Redirect user to login screen, clear sessionStorage
logoutButton.addEventListener('click', event => {
  event.preventDefault();
  sessionStorage.removeItem('username');
  sessionStorage.removeItem(ORDERS_KEY);
  window.location.replace('./index.html');
});

fetch(ORDERS_URL)
  .then(resp => resp.json())
  .then(orders => storeData(orders))
  .then(_ => (loadingText.style.display = 'none'))
  .catch(
    err =>
      (loadingText.textContent = `An internal error occured. ${err.message}`)
  );
