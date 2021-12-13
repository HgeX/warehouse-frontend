import ElementHelper from './ElementHelper.js';
import searchHandler from './util.js';

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

clearSearchButton.addEventListener('click', () => {
  searchInput.value = null;
});

logoutButton.addEventListener('click', event => {
  event.preventDefault();
  sessionStorage.removeItem('username');
  window.location.replace('./index.html');
});

searchButton.addEventListener('click', event => handleSearch(event));
searchInput.addEventListener('keyup', event => {
  if (searchInput === document.activeElement && event.key === 'Enter') {
    handleSearch(event);
  }
});

const orders = await fetchData();
if (orders) {
  loadingText.style.display = 'none';
  renderOrders(orders);
}

async function fetchData() {
  try {
    const resp = await fetch(ORDERS_URL).then(resp => resp.json());
    return resp;
  } catch (e) {
    loadingText.textContent = `An internal error occured. ${e.message}`;
  }
}

function handleSearch(event) {
  event.preventDefault();
  const search = searchInput.value;
  if (search) {
    searchHandler(search, orders);
  }
}

function hideRenderedOrders() {
  const childrenToRemove = [];
  for (const child of hook.children) {
    childrenToRemove.push(child);
  }

  childrenToRemove.forEach(child => hook.removeChild(child));
}

function renderOrders(orders) {
  const ordersContainer = ElementHelper.create('div').setId('orders-container');
  orders.forEach(each => renderSingleOrder(each, ordersContainer));
  hook.appendChild(ordersContainer.htmlElement);
}

function renderSingleOrder(order, parent) {
  const orderContainer = ElementHelper.create('div')
    .setClass('card')
    .setParent(parent);
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

  // Create price info
  const priceInfoContainer = ElementHelper.create('div')
    .setClass('price-info card-entry additional-info')
    .setParent(orderContainer);
  ElementHelper.create('i').setClass('ph-wallet').setParent(priceInfoContainer);
  ElementHelper.create('p')
    .setClass('decorated')
    .setText(`Total price: ${order.totalprice}€`)
    .setParent(priceInfoContainer);

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

  orderContainer.htmlElement.addEventListener('click', () =>
    renderDetails(order)
  );
}

function renderDetails(order) {
  hideRenderedOrders();
  const container = ElementHelper.create('div').setId('product-details');
  container.htmlElement.innerHTML = `
    <p>${order.orderid}</p>
    <p>${order.customerid}</p>
    <p>${order.customer}</p>
    <p>${order.invaddr}</p>
    <p>${order.delivaddr}</p>
    <p>${order.deliverydate}</p>
    <p>${order.respsalesperson}</p>
    <p>${order.comment}</p>
    <p>${order.totalprice}</p>
  `;

  order.products.forEach(product => {
    container.htmlElement.innerHTML += `
      <p>-------------</p>
      <p>${product.code}</p>
      <p>${product.product}</p>
      <p>${product.description}</p>
      <p>${product.suppliercode}</p>
      <p>${product.qty}</p>
      <p>${product.unit_price}</p>
      <p>${product.shelf_pos}</p>
    `;
  });

  hook.appendChild(container.htmlElement);
}
