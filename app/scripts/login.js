const emailField = document.getElementById('email');
const passwordField = document.getElementById('pass');
const loginButton = document.getElementById('login');

// TODO maybe don't do store users like this.
const users = [{ email: 'test@test.test', password: 'hello' }];

loginButton.addEventListener('click', event => {
  event.preventDefault();
  handleLogin();
});

function handleLogin() {
  const email = emailField.value;
  const password = passwordField.value;
  if (!email || !password) {
    alert('Email and password fields are required, please fill in both!');
  } else {
    let user;
    for (const each of users) {
      if (each.email === email && each.password === password) {
        user = each;
        break;
      }
    }

    // Check if we have a user with matching credentials
    if (!user) {
      alert('Invalid email and/or password, please try again!');
    } else {
      // TODO redirect user to dashboard, this doesn't feel like the right way to do it.
      window.location.replace('./dashboard.html');
    }
  }
}
