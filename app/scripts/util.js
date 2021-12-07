function searchHandler() { //determines what type of search to run and calls relevant function

    let searchinput = ""; //fetch from user input in search bar
    searchinput = searchinput.toLowerCase(); //terrible sanitization for the sake of simplified regex

    //let searchparameter = searchinput.REXE_HERE
    //regex ([a-z]*[A-Z]*[a-z]*)|([A-Z]*[a-z]*)(?=:) should probably maybe work even with bad casing, but fails on multiple separated capitals in the middle of the parameter string
    //otherwise [a-z]*(?=:) is fine

    let switchmatchedflag = false;

    switch (searchparameter) {
        case "orderid":
            orderIDSearch();
            switchmatchedflag = true;
            break;

        case "customerid":
            customerIDSearch();
            switchmatchedflag = true;
            break;

        case "address":
            addressSearch();
            switchmatchedflag = true;
            break;

        case "date":
            deliveryDateSearch();
            switchmatchedflag = true;
            break;

        case "salesperson":
            repSalesPersonSearch();
            switchmatchedflag = true;
            break;

        case "productid":
            productCodeSearch();
            switchmatchedflag = true;
            break;
    }

    if (!switchmatchedflag) {
        basicSearch();
    }

}

function basicSearch() { // basic search funtion, seaches for matches against orderid, customerid. Called when no search parameter is given, or if given parameter is invalid
    
}

function orderIDSearch() {

}

function customerIDSearch() {
    
}

function addressSearch() {
    
}

function deliveryDateSearch() {
    
}

function repSalesPersonSearch() {
    
}

function productCodeSearch() {
    
}