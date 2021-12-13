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
    return resp.sort((a, b) => a.orderid - b.orderid);
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
  const comments = order.comment ? order.comment.split(';') : [];
  const commentText =
    comments.length > 1
      ? `${comments.length} comments`
      : comments.length === 1
      ? `Comment: ${comments[0]}`
      : 'No comment was added.';
  const commentInfoContainer = ElementHelper.create('div')
    .setClass('comment-info card-entry additional-info')
    .setParent(orderContainer);
  ElementHelper.create('i').setClass('ph-chat').setParent(commentInfoContainer);
  ElementHelper.create('p')
    .setClass('decorated')
    .setText(commentText)
    .setParent(commentInfoContainer);

  orderContainer.htmlElement.addEventListener('click', () =>
    renderDetails(order)
  );
}

function renderDetails(order) {
  hideRenderedOrders();
  const container = ElementHelper.create('div').setId('product-details');
  const backContainer = ElementHelper.create('div')
    .setId('back-container')
    .setParent(container);

  const backButton = ElementHelper.create('i')
    .setClass('ph-arrow-left decoration')
    .setId('back-button')
    .setParent(backContainer);
  backButton.htmlElement.addEventListener('click', () => {
    hideRenderedOrders();
    renderOrders(orders);
  });

  ElementHelper.create('h3')
    .setText('Back to all orders')
    .setParent(backContainer);

  ElementHelper.create('h3')
    .setText(`Order details #${order.orderid}`)
    .setClass('category')
    .setParent(container);

  const orderInfoContainer = ElementHelper.create('div')
    .setParent(container)
    .setId('product-info-container');

  const customerContainer = ElementHelper.create('div')
    .setParent(orderInfoContainer)
    .setClass('product-info-entry')
    .setId('customer-container');
  ElementHelper.create('i').setClass('ph-user').setParent(customerContainer);
  ElementHelper.create('p')
    .setText(`Customer: ${order.customer} (#${order.customerid})`)
    .setClass('decorated')
    .setParent(customerContainer);

  const invAddress = order.invaddr;
  const invAddressText = invAddress ? invAddress.toString() : '-';
  const invoiceAddressContainer = ElementHelper.create('div')
    .setParent(orderInfoContainer)
    .setClass('product-info-entry')
    .setId('invaddr-container');
  ElementHelper.create('i')
    .setClass('ph-receipt')
    .setParent(invoiceAddressContainer);
  ElementHelper.create('p')
    .setText(`Invoice address: ${invAddressText}`)
    .setClass('decorated')
    .setParent(invoiceAddressContainer);

  const deliveryAddress = order.delivaddr;
  const deliveryAddressText = deliveryAddress
    ? deliveryAddress.toString()
    : '-';
  const deliveryAddressContainer = ElementHelper.create('div')
    .setParent(orderInfoContainer)
    .setClass('product-info-entry')
    .setId('delivaddr-container');
  ElementHelper.create('i')
    .setClass('ph-map-pin')
    .setParent(deliveryAddressContainer);
  ElementHelper.create('p')
    .setText(`Delivery address: ${deliveryAddressText}`)
    .setClass('decorated')
    .setParent(deliveryAddressContainer);

  const delivDateContainer = ElementHelper.create('div')
    .setParent(orderInfoContainer)
    .setClass('product-info-entry')
    .setId('deliv-date-container');
  ElementHelper.create('i')
    .setClass('ph-calendar')
    .setParent(delivDateContainer);
  ElementHelper.create('p')
    .setText(`Delivery date: ${order.deliverydate}`)
    .setClass('decorated')
    .setParent(delivDateContainer);

  const salesPersonContainer = ElementHelper.create('div')
    .setParent(orderInfoContainer)
    .setClass('product-info-entry')
    .setId('sales-person-container');
  ElementHelper.create('i')
    .setClass('ph-person')
    .setParent(salesPersonContainer);
  ElementHelper.create('p')
    .setText(`Sales person: ${order.respsalesperson}`)
    .setClass('decorated')
    .setParent(salesPersonContainer);

  const totalPriceContainer = ElementHelper.create('div')
    .setParent(orderInfoContainer)
    .setClass('product-info-entry')
    .setId('total-price-container');
  ElementHelper.create('i')
    .setClass('ph-wallet')
    .setParent(totalPriceContainer);
  ElementHelper.create('p')
    .setText(`Total price: ${order.totalprice}€`)
    .setClass('decorated')
    .setParent(totalPriceContainer);

  const products = order.products;
  ElementHelper.create('h3')
    .setText(`Products (${products.length})`)
    .setClass('category')
    .setParent(container);

  const productsContainer = ElementHelper.create('div')
    .setParent(container)
    .setId('products-container');

  products.forEach(product => {
    ElementHelper.create('p')
      .setParent(productsContainer)
      .setText(
        `${product.code} | ${product.product} | ${product.description} | ${product.suppliercode} | ${product.qty} | ${product.unit_price} | ${product.shelf_pos}`
      );
  });

  const comments = order.comment ? order.comment.split(';') : [];
  const commentCount = order.comment ? comments.length : 0;
  ElementHelper.create('h3')
    .setText(`Comments (${commentCount})`)
    .setClass('category')
    .setParent(container);

  const commentsContainer = ElementHelper.create('div')
    .setParent(container)
    .setId('products-container');

  comments.forEach(comment => {
    const commentContainer = ElementHelper.create('div')
      .setParent(commentsContainer)
      .setClass('product-info-entry comment');
    ElementHelper.create('i').setClass('ph-chat').setParent(commentContainer);
    ElementHelper.create('p')
      .setParent(commentContainer)
      .setText(comment)
      .setClass('decorated');
  });

  const textarea = ElementHelper.create('textarea')
    .setAttr('placeholder', 'Add a comment...')
    .setAttr('rows', '7')
    .setAttr('cols', '100')
    .setParent(container);
  textarea.htmlElement.addEventListener('keyup', event => {
    if (
      textarea.htmlElement === document.activeElement &&
      event.key === 'Enter'
    ) {
      const newComment = textarea.htmlElement.value;
      order.comment += `${commentCount > 0 ? ';' : ''}${newComment}`;
      hideRenderedOrders();
      renderDetails(order);
    }
  });

  hook.appendChild(container.htmlElement);
}
