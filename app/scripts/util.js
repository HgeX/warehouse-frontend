async function importJSONFromWeb() {
  try {
    const resp = await fetch(ORDERS_URL);
    let jsonData = await resp.json();

    return jsonData;
  } catch (error) {
    console.log(`Failed to fetch data: ${error.message}`);
  }
}

export default function (searchinput, orders) {
  //determines what type of search to run and calls relevant function
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
      orderIDSearch(searchcontent);
      switchmatchedflag = true;
      console.log('orderid condition matched'); // debug
      break;

    case 'customerid':
      customerIDSearch(searchcontent);
      switchmatchedflag = true;
      console.log('customerid condition matched'); // debug
      break;

    case 'address':
      addressSearch(searchcontent);
      switchmatchedflag = true;
      console.log('address condition matched'); // debug
      break;

    case 'date':
      deliveryDateSearch(searchcontent);
      switchmatchedflag = true;
      console.log('date condition matched'); // debug
      break;

    case 'salesperson':
      repSalesPersonSearch(searchcontent);
      switchmatchedflag = true;
      console.log('salesperson condition matched'); // debug
      break;

    case 'productid':
      productCodeSearch(searchcontent);
      switchmatchedflag = true;
      console.log('productid condition matched'); // debug
      break;

    default:
      console.log('basic search condition matched'); // debug
      basicSearch(searchcontent);
  }
}

function basicSearch(searchTerm) {
  // basic search funtion, seaches for matches against orderid, customerid. Called when no search parameter is given, or if given parameter is invalid
}

function orderIDSearch(searchTerm) {
  // called with parameter "orderid"
}

function customerIDSearch(searchTerm) {
  // called with parameter "customerid"
}

function addressSearch(searchTerm) {
  // called with parameter "address"
}

function deliveryDateSearch(searchTerm) {
  // called with parameter "date"
}

function repSalesPersonSearch(searchTerm) {
  // called with parameter "salesperson"
}

function productCodeSearch(searchTerm) {
  // called with parameter "productid"
}

function populateFields() {
  let ordersObJ = getOrders();
  document.getElementById('outputParagraph').innerHTML = ordersObJ;
}
