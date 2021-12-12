const ORDERS_KEY = '__orders__';

function storeData(orders) {
  sessionStorage.setItem(ORDERS_KEY, orders);
}

function getOrders() {
  return sessionStorage.getItem(ORDERS_KEY);
}

async function importJSONFromWeb() {
  try {
      const resp = await fetch(ORDERS_URL);
      let jsonData = await resp.json();

      return jsonData;
  } catch (error) {
      console.log(`Failed to fetch data: ${error.message}`);
  }
}

function searchHandler(searchinput) { //determines what type of search to run and calls relevant function
  console.log('search input is: ' + searchinput); // debug

  let myRegex = /\w+(?=:)/; // finds whole word behind first colon in order to determine search parameter
  let regexArray = [];

  if (myRegex.exec(searchinput) != null) { //terrible hack to prevent a null return
    regexArray = myRegex.exec(searchinput); //performs regex operation on searchinput string to load result into regexArray
  } else {
    regexArray = ["dummy"];
  }
  
  console.log('Regex array is: ' + regexArray); // debug
  console.log('Search parameter is: ' + regexArray[0]); // debug

  let searchparameter = regexArray[0]; // copies first regex match from array to a string //TODO fix to be case insensitive

  let searchcontent = searchinput; // copies search input to a new string for manipulation
  searchcontent = searchcontent.replace(/\w+(?=:):/, ''); // removes search parameter and colon from string, leaving just search contents
  console.log('searchcontent is: ' + searchcontent); // debug

  console.log(importJSONFromWeb());

  let switchmatchedflag = false;

  switch (searchparameter) {
    case 'orderid':
      orderIDSearch();
      switchmatchedflag = true;
      console.log('orderid condition matched'); // debug
      break;

    case 'customerid':
      customerIDSearch();
      switchmatchedflag = true;
      console.log('customerid condition matched'); // debug
      break;

    case 'address':
      addressSearch();
      switchmatchedflag = true;
      console.log('address condition matched'); // debug
      break;

    case 'date':
      deliveryDateSearch();
      switchmatchedflag = true;
      console.log('date condition matched'); // debug
      break;

    case 'salesperson':
      repSalesPersonSearch();
      switchmatchedflag = true;
      console.log('salesperson condition matched'); // debug
      break;

    case 'productid':
      productCodeSearch();
      switchmatchedflag = true;
      console.log('productid condition matched'); // debug
      break;
  }

  if (!switchmatchedflag) {
    console.log('basic search condition matched'); // debug
    basicSearch();
  }
}

function basicSearch() {
  // basic search funtion, seaches for matches against orderid, customerid. Called when no search parameter is given, or if given parameter is invalid
}

function orderIDSearch() {
  // called with parameter "orderid"
}

function customerIDSearch() {
  // called with parameter "customerid"
}

function addressSearch() {
  // called with parameter "address"
}

function deliveryDateSearch() {
  // called with parameter "date"
}

function repSalesPersonSearch() {
  // called with parameter "salesperson"
}

function productCodeSearch() {
  // called with parameter "productid"
}
