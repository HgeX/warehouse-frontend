import ElementHelper from './ElementHelper.js';
import searchHandler from './util.js';

const WELCOME_TEXT = 'Welcome, ';
const ORDERS_URL = 'http://www.cc.puv.fi/~asa/json/project.json';
const welcomeHook = document.getElementById('welcome');
const hook = document.getElementById('hook');
const searchInput = document.getElementById('search');
const searchButton = document.getElementById('search-icon');
const clearSearchButton = document.getElementById('clear-icon');
const logoutButton = document.getElementById('logout-button');
const loadingText = document.getElementById('loading-text');
const header = document.getElementById('main-nav');
const offsetTop = header.offsetTop;
// Need this to disable the headers sticky behaviour
// when the order details page is opened.
let viewingOrderDetails = false;

window.onscroll = () => {
  if (!viewingOrderDetails) {
    if (window.pageYOffset > offsetTop) {
      header.classList.add('sticky');
    } else {
      header.classList.remove('sticky');
    }
  }
};

const formattedText = WELCOME_TEXT.concat(sessionStorage.getItem('username'));
welcomeHook.textContent = formattedText;

clearSearchButton.addEventListener('click', () => {
  searchInput.value = null;
  hideRenderedContent();
  renderOrders(orders);
});

logoutButton.addEventListener('click', event => {
  event.preventDefault();
  sessionStorage.removeItem('username');
  window.location.replace('./index.html');
});

searchButton.addEventListener('click', event => {
  event.preventDefault();
});
searchInput.addEventListener('keyup', event => {
  if (searchInput === document.activeElement && event.key === 'Enter') {
    handleSearch();
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

function handleSearch() {
  const search = searchInput.value;
  hideRenderedContent();
  if (search) {
    const result = searchHandler(search, orders);
    if (result.length === 0) {
      renderErrorMessage();
    } else {
      renderOrders(result);
    }
  } else {
    renderOrders(orders);
  }
}

function hideRenderedContent() {
  const childrenToRemove = [];
  for (const child of hook.children) {
    childrenToRemove.push(child);
  }

  childrenToRemove.forEach(child => hook.removeChild(child));
}

function renderErrorMessage() {
  const errorMsgContainer = ElementHelper.create('div').setId('error-message');
  ElementHelper.create('i')
    .setClass('ph-warning-circle-bold')
    .setParent(errorMsgContainer);
  ElementHelper.create('h2')
    .setClass('decorated')
    .setText('No orders matched this criteria.')
    .setParent(errorMsgContainer);
  hook.appendChild(errorMsgContainer.htmlElement);
}

function renderOrders(orders) {
  searchInput.disabled = false;
  viewingOrderDetails = false;
  const ordersContainer = ElementHelper.create('div').setId('orders-container');
  orders.forEach(each => renderSingleOrder(each, ordersContainer));
  hook.appendChild(ordersContainer.htmlElement);
}

function renderSingleOrder(order, parent) {
  const orderContainer = ElementHelper.create('div')
    .setClass('card')
    .setParent(parent)
    .setOnClick(() => {
      renderDetails(order);
      window.scrollTo(0, 0);
    });

  // Create title
  const titleContainer = ElementHelper.create('div')
    .setClass('card-title card-entry')
    .setParent(orderContainer);
  ElementHelper.create('i').setClass('ph-package').setParent(titleContainer);
  const orderTitle = ElementHelper.create('h3')
    .setClass('decorated')
    .setText(`Order #${order.orderid}`)
    .setParent(titleContainer);

  if (order.ready) {
    ElementHelper.create('i')
      .setClass('ph-check-circle decorated')
      .setParent(titleContainer);
    orderTitle.htmlElement.classList.toggle('strikethrough');
  }

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
}

function renderDetails(order) {
  hideRenderedContent();
  searchInput.disabled = true;
  viewingOrderDetails = true;
  const container = ElementHelper.create('div').setId('product-details');
  const backContainer = ElementHelper.create('div')
    .setId('back-container')
    .setParent(container);

  const backButton = ElementHelper.create('i')
    .setClass('ph-arrow-left decoration')
    .setId('back-button')
    .setParent(backContainer);
  backButton.htmlElement.addEventListener('click', () => {
    hideRenderedContent();
    handleSearch();
  });

  ElementHelper.create('h3')
    .setText('Back to all orders')
    .setParent(backContainer);

  const orderIdContainer = ElementHelper.create('div')
    .setParent(container)
    .setId('orderid-container');

  ElementHelper.create('h3')
    .setText(`Order details #${order.orderid}`)
    .setClass('category')
    .setParent(orderIdContainer);
  const checkmark = ElementHelper.create('i')
    .setClass('ph-check-circle decorated')
    .do(element =>
      order.ready
        ? (element.style.visibility = 'visible')
        : (element.style.visibility = 'hidden')
    )
    .setParent(orderIdContainer);

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
    .setClass('product-info-entry')
    .setId('products-container');

  products.forEach(product => {
    const text = product.product
      ? `${product.product} - ${product.code}`
      : `${product.code}`;
    const switchContainer = ElementHelper.create('div')
      .setParent(productsContainer)
      .setClass(`switch-container`);
    const checkbox = ElementHelper.create('input')
      .setAttr('type', 'checkbox')
      .setParent(switchContainer);
    if (product.collected) {
      checkbox.setAttr('checked', 'true');
    }
    const textContainer = ElementHelper.create('p')
      .setParent(switchContainer)
      .setText(text)
      .setClass(`decorated`);
    const descContainer = ElementHelper.create('p')
      .setParent(productsContainer)
      .setText(`${product.description}`);
    const supplierContainer = ElementHelper.create('p')
      .setParent(productsContainer)
      .setText(`${product.suppliercode}`);
    const priceContainer = ElementHelper.create('p')
      .setParent(productsContainer)
      .setText(`${product.unit_price}€`);
    const posContainer = ElementHelper.create('p')
      .setParent(productsContainer)
      .setText(`${product.shelf_pos}`);

    const row = [
      textContainer,
      descContainer,
      supplierContainer,
      priceContainer,
      posContainer
    ];
    row.forEach(element => {
      if (product.collected) {
        element.htmlElement.classList.toggle('strikethrough');
      }
    });

    checkbox.htmlElement.addEventListener('change', () => {
      row.forEach(element =>
        element.htmlElement.classList.toggle('strikethrough')
      );
      product.collected = !product.collected;
    });
  });

  const comments = order.comment ? order.comment.split(';') : [];
  const commentCount = order.comment ? comments.length : 0;
  ElementHelper.create('h3')
    .setText(`Comments (${commentCount})`)
    .setClass('category')
    .setParent(container);

  const commentsContainer = ElementHelper.create('div')
    .setParent(container)
    .setId('comments-container');

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
    .setParent(container);
  textarea.htmlElement.addEventListener('keyup', event => {
    if (
      textarea.htmlElement === document.activeElement &&
      event.key === 'Enter'
    ) {
      const newComment = textarea.htmlElement.value;
      order.comment += `${commentCount > 0 ? ';' : ''}${newComment}`;
      hideRenderedContent();
      renderDetails(order);
    }
  });

  const readyButtonText = 'Mark as ready';
  const notReadyButtonText = 'Mark as not ready';
  ElementHelper.create('button')
    .setClass('primary-button')
    .setId('done-button')
    .setText(order.ready ? notReadyButtonText : readyButtonText)
    .setParent(
      ElementHelper.create('div')
        .setId('done-button-container')
        .setParent(container)
    )
    .setOnClick((event, button) => {
      event.preventDefault();
      const action = order.ready
        ? button => {
            checkmark.htmlElement.style.visibility = 'hidden';
            button.htmlElement.textContent = readyButtonText;
            order.ready = false;
          }
        : button => {
            checkmark.htmlElement.style.visibility = 'visible';
            button.htmlElement.textContent = notReadyButtonText;
            order.ready = true;
          };
      action(button);
    });

  hook.appendChild(container.htmlElement);
}
