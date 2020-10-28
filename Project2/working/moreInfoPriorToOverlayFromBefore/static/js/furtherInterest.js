/////////////////////////////////////////////////////////////////////////////////////////////////
//  RUT-SOM-DATA-PT-06-2020-U-C                                                   Douglas High //
//   Project2                                                               October 2020 //
//      >furtherInterest.js                                                                      //
//   - copied from glossaryTable.js.                                                //
//   - display further information from csv into html table.                                  //
//   - Link key contains url, create as hyperlink to open in new tab (target="_blank")    //
//      with phishing prevention (rel="noopener noreferrer").                                  //
/////////////////////////////////////////////////////////////////////////////////////////////////

console.log("in");
d3.csv("../../../Xlcsv/furtherInterest.csv").then(function(data) {
  
    var tableBody = d3.select("#table-area2");
  
    data.forEach((record) => {
      var row = tableBody.append("tr");
  
      Object.entries(record).forEach(([key, value]) => {
          var cell = row.append("td");
          if (key=== "Link") {
            var text = value;
            cell.html('<a href="' + value + ' rel="noopener noreferrer" target="_blank">' + text + '</a>');
          }
          else {
            cell.text(value);
          }
      });
    });
  });