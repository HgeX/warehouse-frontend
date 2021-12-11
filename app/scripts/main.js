// True constants
const WELCOME_TEXT = 'Welcome, ';
const ORDERS_URL = 'http://www.cc.puv.fi/~asa/json/project.json';
// Not so constant constants lol
const welcomeHook = document.getElementById('welcome');
const hook = document.getElementById('hook');
const searchInput = document.getElementById('search');
const searchButton = document.getElementById('search-icon');
const clearSearchButton = document.getElementById('clear-icon');
const logoutButton = document.getElementById('logout-button');
const loadingText = document.getElementById('loading-text');

const formattedText = WELCOME_TEXT.concat(sessionStorage.getItem('username'));
welcomeHook.textContent = formattedText;

console.log(clearSearchButton);
clearSearchButton.addEventListener('click', () => {
  console.log('called');
  searchInput.value = null;
});

logoutButton.addEventListener('click', event => {
  event.preventDefault();
  sessionStorage.removeItem('username');
  sessionStorage.removeItem(ORDERS_KEY);
  window.location.replace('./index.html');
});

searchButton.addEventListener('click', event => handleSearch(event));
searchInput.addEventListener('keyup', event => {
  if (searchInput === document.activeElement && event.code === 'Enter') {
    handleSearch(event);
  }
});

fetch(ORDERS_URL)
  .then(resp => resp.json())
  .then(orders => storeData(orders))
  .then(_ => (loadingText.style.display = 'none'))
  .catch(
    err =>
      (loadingText.textContent = `An internal error occured. ${err.message}`)
  );

// TODO Remove this
const orders = [
  {
    orderid: 0,
    customerid: 12,
    products: ['a', 'nb', 'c'],
    comment: 'Hello There!'
  },
  {
    orderid: 1,
    customerid: 45,
    products: ['a', 'nb', 'c', 'd', 'e', 'f']
  }
];

renderOrders(orders);

function handleSearch(event) {
  event.preventDefault();
  const search = searchInput.value;
  if (search) {
    searchHandler(search);
  }
}

function hideRenderedOrders() {
  for (const child of hook.children) {
    child.remove();
  }
}

function renderOrders(orders) {
  orders.forEach(each => renderSingleOrder(each));
}

// TODO set click events
function renderSingleOrder(order) {
  const orderContainer = ElementHelper.create('div').setClass('card');
  // Create title
  const titleContainer = ElementHelper.create('div')
    .setClass('card-title card-entry')
    .setParent(orderContainer);
  ElementHelper.create('i').setClass('ph-package').setParent(titleContainer);
  ElementHelper.create('h3')
    .setClass('decorated')
    .setText(`Order #${order.orderid}`)
    .setParent(titleContainer);

  // Create customer info
  const customerInfoContainer = ElementHelper.create('div')
    .setClass('user-info card-entry additional-info')
    .setParent(orderContainer);
  ElementHelper.create('i')
    .setClass('ph-user')
    .setParent(customerInfoContainer);
  ElementHelper.create('p')
    .setClass('decorated')
    .setText(`Customer ID: ${order.customerid}`)
    .setParent(customerInfoContainer);

  // Create product info
  const productInfoContainer = ElementHelper.create('div')
    .setClass('prod-info card-entry additional-info')
    .setParent(orderContainer);
  ElementHelper.create('i')
    .setClass('ph-hash-straight')
    .setParent(productInfoContainer);
  ElementHelper.create('p')
    .setClass('decorated')
    .setText(`Product count: ${order.products.length}`)
    .setParent(productInfoContainer);

  // Create comment info
  const comment = order.comment;
  const commentInfoContainer = ElementHelper.create('div')
    .setClass('comment-info card-entry additional-info')
    .setParent(orderContainer);
  ElementHelper.create('i').setClass('ph-chat').setParent(commentInfoContainer);
  ElementHelper.create('p')
    .setClass('decorated')
    .setText(comment ? `Comment: ${comment}` : 'No comment was added.')
    .setParent(commentInfoContainer);

  hook.appendChild(orderContainer.htmlElement);
}
