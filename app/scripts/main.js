const WELCOME_TEXT = 'Welcome, ';
const welcomeHook = document.getElementById('welcome');
const hook = document.getElementById('hook');
const searchInput = document.getElementById('search');
const searchButton = document.getElementById('call-search');

searchButton.addEventListener('click', event => {
  event.preventDefault();
  // TODO call searchHandler (util.js)
});

window.addEventListener('login', event => renderGreeting(event.user));

const formattedText = WELCOME_TEXT.concat(sessionStorage.getItem('username'));
welcomeHook.textContent = formattedText;
