function searchHandler() {
  //determines what type of search to run and calls relevant function

  let searchinput = document.getElementById('userInput').value; //fetch from user input in search bar
  console.log('search input is: ' + searchinput); // debug

  let myRegex = /\w+(?=:)/; // finds whole word behind first colon in order to determine search parameter
  let regexArray = myRegex.exec(searchinput); //performs regex operation on searchinput string to load result into regexArray

  console.log('Regex array is: ' + regexArray); // debug
  console.log('Search parameter is: ' + regexArray[0]); // debug

  let searchparameter = regexArray[0]; // copies first regex match from array to a string //TODO fix to be case insensitive

  let searchcontent = searchinput; // copies search input to a new string for manipulation
  searchcontent = searchcontent.replace(/\w+(?=:):/, ''); // removes search parameter and colon from string, leaving just search contents
  console.log('searchcontent is: ' + searchcontent); // debug

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
    //TODO Basic search not called due to regex array = null
    console.log('basic search condition matched');
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
