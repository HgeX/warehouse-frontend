if (!sessionStorage.getItem('username')) {
  // In this case dashboard.html was opened directly without logging in.
  window.location.replace('./index.html');
}
