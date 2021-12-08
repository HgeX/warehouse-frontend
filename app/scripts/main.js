const WELCOME_TEXT = 'Welcome, ';
const welcomeHook = document.getElementById('welcome');
const hook = document.getElementById('hook');

window.addEventListener('login', event => renderGreeting(event.user));

const formattedText = WELCOME_TEXT.concat(sessionStorage.getItem('username'));
welcomeHook.textContent = formattedText;
