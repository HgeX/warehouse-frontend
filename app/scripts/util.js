// async function importJSONFromWeb() {
//   try {
//     const resp = await fetch(ORDERS_URL);
//     let jsonData = await resp.json();

//     return jsonData;
//   } catch (error) {
//     console.log(`Failed to fetch data: ${error.message}`);
//   }
// }

export default function (searchinput, orders) {
  //determines what type of search to run and calls relevant function

  let output = [];

  console.log('search input is: ' + searchinput); // debug

  let myRegex = /\w+(?=:)/; // finds whole word behind first colon in order to determine search parameter
  let regexArray = [];

  if (myRegex.exec(searchinput) != null) {
    //terrible hack to prevent a null return
    regexArray = myRegex.exec(searchinput); //performs regex operation on searchinput string to load result into regexArray
  } else {
    regexArray = ['dummy'];
  }

  console.log('Regex array is: ' + regexArray); // debug
  console.log('Search parameter is: ' + regexArray[0]); // debug

  let searchparameter = regexArray[0]; // copies first regex match from array to a string //TODO fix to be case insensitive

  let searchcontent = searchinput; // copies search input to a new string for manipulation
  searchcontent = searchcontent.replace(/\w+(?=:):/, ''); // removes search parameter and colon from string, leaving just search contents
  console.log('searchcontent is: ' + searchcontent); // debug

  console.log(orders);

  switch (searchparameter) {
    case 'orderid':
      console.log('orderid condition matched'); // debug
      output = orderIDSearch(searchcontent, orders);
      break;

    case 'customerid':
      console.log('customerid condition matched'); // debug
      output = customerIDSearch(searchcontent, orders);
      break;

    case 'address':
      console.log('address condition matched'); // debug
      output = addressSearch(searchcontent, orders);
      break;

    case 'date':
      console.log('date condition matched'); // debug
      output = deliveryDateSearch(searchcontent, orders);
      break;

    case 'salesperson':
      console.log('salesperson condition matched'); // debug
      output = respSalesPersonSearch(searchcontent, orders);
      break;

    case 'productid':
      console.log('productid condition matched'); // debug
      output = productCodeSearch(searchcontent, orders);
      break;

    default:
      console.log('basic search condition matched'); // debug
      output = basicSearch(searchcontent, orders);
  }

  return output;

}

function basicSearch(searchTerm, ordersArray) { //TODO expand search scope
  // basic search funtion, seaches for matches against orderid, customerid. Called when no search parameter is given, or if given parameter is invalid
  let results = [];

  for (let i=0; i < ordersArray.length; i++) {
    if ((ordersArray[i].orderid == searchTerm) || (ordersArray[i].customerid == searchTerm)) {
      results.push(ordersArray[i].orderid);
      console.log("Array of matched orders: " + results); //debug
    }
  }
  return results;
}

function orderIDSearch(searchTerm, ordersArray) {
  // called with parameter "orderid". Returns an array of orderids that match
  let results = [];

  for (let i=0; i < ordersArray.length; i++) {
    if (ordersArray[i].orderid == searchTerm) {
      results.push(ordersArray[i].orderid);
      console.log("Array of matched orders: " + results); //debug
    }
  }
  return results;
}

function customerIDSearch(searchTerm, ordersArray) {
  // called with parameter "customerid". Returns an array of orderids that match
  let results = [];

  for (let i=0; i < ordersArray.length; i++) {
    if (ordersArray[i].customerid == searchTerm) {
      results.push(ordersArray[i].orderid);
      console.log("Array of matched orders: " + results); //debug
    }
  }
  return results;
}

function addressSearch(searchTerm, ordersArray) { //TODO implement address search
  // called with parameter "address". Returns an array of orderids that match
}

function deliveryDateSearch(searchTerm, ordersArray) { //TODO implement delivery date search
  // called with parameter "date". Returns an array of orderids that match
}

function respSalesPersonSearch(searchTerm, ordersArray) { //TODO improve case desensitisation
  // called with parameter "salesperson". Returns an array of orderids that match
  let results = [];

  for (let i=0; i < ordersArray.length; i++) {
    if (ordersArray[i].respsalesperson.toUpperCase() == searchTerm.toUpperCase()) {
      results.push(ordersArray[i].orderid);
      console.log("Array of matched orders: " + results); //debug
    }
  }
  return results;
}

function productCodeSearch(searchTerm, ordersArray) { //TODO implement product id search
  // called with parameter "productid". Returns an array of orderids that match
}