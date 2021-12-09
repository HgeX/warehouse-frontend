const orders = [
  { orderId: 0, customerId: 100, products: [{ prodId: 'asd' }] },
  {
    orderId: 1,
    customerId: 101,
    products: [{ prodId: 'abc' }, { prodId: 'abcde' }],
  },
];

searchHandler('orderid:0', orders);

function searchHandler(search, orders) {}

function searchByOrderId(search, orders) {
  const result = orders.filter(order => order.orderId === search);
  return result;
}
