export default function (searchinput, orders) { // determines what type of search to run and calls relevant function. The function previously known as searchHandler()
  //Pass a search string in the form "parameter:searchterm", and an array of order objects to search over. Parameters are not case-sensitive.
  // accepts the following search parameters: 
  // orderID - searches for orders with a matching orderID. Should only ever return 1 result.
  // customerID - searches for orders with a matching customerID.
  // address - searches for orders with a matching invaddr OR delivaddr. Case sensitive.
  // date - searches for orders with a matching delivery date. Accepts ANY combination of the following date formats and separators: DD.MM.YY, D.M.YY, D/M/YYYY, D-MM-YYYY etc
  // salesperson - searches for orders with matching respsaleperson. Not case sensitive
  // productID - searches for orders which contain at least 1 instance of a product with the given ID/code. Not case sensitive
  // If not given a search parameter, search will default to basic search, which searches the given term for matching customerID OR orderID values

  let output = [];
  let parameterMatchRegex = /\w+(?=:)/; // finds whole word behind first colon in order to determine search parameter
  let parameterArray = [];
  let searchparameter = ""
  let searchcontent = ""

  if (parameterMatchRegex.exec(searchinput) != null) { //terrible hack to prevent a null return
    parameterArray = parameterMatchRegex.exec(searchinput); //performs regex operation on searchinput string to load result into parameterArray
  } else {
    parameterArray = ['dummy'];
  }

  searchparameter = parameterArray[0].toLowerCase(); // copies first regex match from array to a string
  searchcontent = searchinput; // copies search input to a new string for manipulation
  searchcontent = searchcontent.replace(/\w+(?=:):/, ''); // removes search parameter and colon from string, leaving just search contents

  switch (searchparameter) { // matches search parameter to each case and calls relevant search function
    case 'orderid':
      output = orderIDSearch(searchcontent, orders);
      break;

    case 'customerid':
      output = customerIDSearch(searchcontent, orders);
      break;

    case 'address':
      output = addressSearch(searchcontent, orders);
      break;

    case 'date':
      output = deliveryDateSearch(searchcontent, orders);
      break;

    case 'salesperson':
      output = respSalesPersonSearch(searchcontent, orders);
      break;

    case 'productid':
      output = productCodeSearch(searchcontent, orders);
      break;

    default:
      output = basicSearch(searchcontent, orders);
  }
  return output;
}

function basicSearch(searchTerm, ordersArray) { // basic search funtion, seaches for matches against orderid, customerid. Called when no search parameter is given, or if given parameter is invalid. eturns an array of order objects that match.
  //TODO expand search scope?
  let results = [];
  for (let i=0; i < ordersArray.length; i++) {
    if ((ordersArray[i].orderid == searchTerm) || (ordersArray[i].customerid == searchTerm)) {
      results.push(ordersArray[i]);
    }
  }
  return results;
}

function orderIDSearch(searchTerm, ordersArray) { // called with parameter "orderid". Returns an array of order objects that match.
  let results = [];

  for (let i=0; i < ordersArray.length; i++) {
    if (ordersArray[i].orderid == searchTerm) {
      results.push(ordersArray[i]);
    }
  }
  return results;
}

function customerIDSearch(searchTerm, ordersArray) { // called with parameter "customerid". Returns an array of order objects that match.
  let results = [];

  for (let i=0; i < ordersArray.length; i++) {
    if (ordersArray[i].customerid == searchTerm) {
      results.push(ordersArray[i]);
    }
  }
  return results;
}

function addressSearch(searchTerm, ordersArray) { // called with parameter "address". Returns an array of order objects that match.
  //TODO make case insensitive? I'm a bit worried that without doing it properly it'll cause unicode issues
  let results = [];

  for (let i=0; i < ordersArray.length; i++) {
    if (ordersArray[i].invaddr == searchTerm) {
      results.push(ordersArray[i]);
    } else if (ordersArray[i].delivaddr == searchTerm) {//I THINK that this elif should prevent duplicates when both delivery address and invoice address are filled and the same. Please leave as-is
      results.push(ordersArray[i]);
    }
  }
  return results;
}

function deliveryDateSearch(searchTerm, ordersArray) { // called with parameter "date". Returns an array of order objects that match.
  let results = [];
  let dateRegex = /\d{1,4}/g; // finds DD, MM and YYYY (alt format D, M, YY) from searchTerm. Separators will be ignored
  let dateStorageArray = []; //TODO don't forget to catch a null result
  let searchString = "";

  for (let i=0; i < ordersArray.length; i++) {
    dateStorageArray = searchTerm.match(dateRegex);

    dateStorageArray[0] = parseInt(dateStorageArray[0]);
    dateStorageArray[1] = parseInt(dateStorageArray[1]);
    if (dateStorageArray[2] < 99) {
      dateStorageArray[2] = parseInt(dateStorageArray[2]) + 2000;
    }
    searchString = dateStorageArray[0] + "-" + dateStorageArray[1] + "-" + dateStorageArray[2];
    
    if (ordersArray[i].deliverydate == searchString) {
      results.push(ordersArray[i]);
    }
  }
  return results;
}

function respSalesPersonSearch(searchTerm, ordersArray) { // called with parameter "salesperson". Returns an array of order objects that match. 
  let results = [];

  for (let i=0; i < ordersArray.length; i++) {
    if (ordersArray[i].respsalesperson.toUpperCase() == searchTerm.toUpperCase()) { //TODO improve case desensitisation
      results.push(ordersArray[i]);
    }
  }
  return results;
}

function productCodeSearch(searchTerm, ordersArray) { // called with parameter "productid". Returns an array of order objects that match.
  let results = [];
  let productsArray = [];

  for (let i=0; i < ordersArray.length; i++) {
    productsArray = ordersArray[i].products;
    for (let j=0; j < productsArray.length; j++) {
      if (productsArray[j].code.toUpperCase() == searchTerm.toUpperCase()) { //TODO improve case desensitisation
        results.push(ordersArray[i]);
      }
    }
  }
  return results;
}