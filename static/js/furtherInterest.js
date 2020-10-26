/////////////////////////////////////////////////////////////////////////////////////////////////
//  RUT-SOM-DATA-PT-06-2020-U-C                                                   Douglas High //
//   Project2                                                                  October 26 2020 //
//      >furtherInterest.js                                                                    //
//   - copied from glossaryTable.js.                                                           //
//   - display further information from csv into html table.                                   //
//   - Link key contains url, create as hyperlink to open in new tab (target="_blank")         //
//      with phishing prevention (rel="noopener noreferrer").                                  //
/////////////////////////////////////////////////////////////////////////////////////////////////

d3.json("/api").then(function(my_data) {
  var data = my_data["furtherInterest"];
  var tableBody = d3.select("tbody");

  data.forEach((record) => {
    var row = tableBody.append("tr");

    Object.entries(record).forEach(([key, value]) => {
        var cell = row.append("td");
        if (key === "Link") {
          var text = value;
          cell.html(`<a href="${value}" rel="noopener noreferrer" target="_blank"> ${text} </a>`);
        }
        else {
          cell.text(value);
        }
    });
  });
});