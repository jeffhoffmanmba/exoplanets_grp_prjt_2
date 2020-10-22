/////////////////////////////////////////////////////////////////////////////////////////////////
//  RUT-SOM-DATA-PT-06-2020-U-C                                                   Douglas High //
//   Project2                                                               October 2020 //
//      >glossaryTable.js                                                                      //
//   - modified from js-challenge app.js(ufo1).                                                //
//   - display glossary information from csv into html table.                                  //
//   - more_info key contains url, create as hyperlink to open in new tab (target="_blank")    //
//      with phishing prevention (rel="noopener noreferrer").                                  //
/////////////////////////////////////////////////////////////////////////////////////////////////


d3.csv("static/js/glossary.csv").then(function(data) {
  
  var tableBody = d3.select("tbody");

  data.forEach((record) => {
    var row = tableBody.append("tr");

    Object.entries(record).forEach(([key, value]) => {
        var cell = row.append("td");
        if (key=== "more_info") {
          var text = value;
          cell.html('<a href="' + value + ' rel="noopener noreferrer" target="_blank">' + text + '</a>');
        }
        else {
          cell.text(value);
        }
    });
  });
});