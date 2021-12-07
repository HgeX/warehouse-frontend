function searchHandler() { //determines what type of search to run and calls relevant function

    let searchinput = ""; //fetch from user input in search bar
    
    //DEPRECATED searchinput = searchinput.toLowerCase(); 
    //let searchparameter = searchinput.REGEX_HERE
    //regex ([a-z]*[A-Z]*[a-z]*)|([A-Z]*[a-z]*)(?=:) should probably maybe work even with bad casing, but fails on multiple separated capitals in the middle of the parameter string
    //otherwise [a-z]*(?=:) is fine
    //actually \w+(?=:) is better, turns out writing regex at 4am is a bad idea. Should remove need to convert lowercase
    //let searchcontent = searchinput;
    //let searchcontent = searchcontent.replace(REGEX_HERE);
    //proposed regex for content \w+(?=:): => ""
    // searchcontent should now be correct search string to search literally. Convert all to lower to make case insensitive??




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