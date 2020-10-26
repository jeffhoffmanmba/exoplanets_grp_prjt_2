/////////////////////////////////////////////////////////////////////////////////////////////////
//  RUT-SOM-DATA-PT-06-2020-U-C                                                   Douglas High //
//   Project2                                                                  October 26 2020 //
//      >glossaryTable.js                                                                      //
//   - modified from js-challenge app.js(ufo1).                                                //
//   - display glossary information from csv into html table.                                  //
//   - more_info key contains url, create as hyperlink to open in new tab (target="_blank")    //
//      with phishing prevention (rel="noopener noreferrer").                                  //
// ** hyperlink is appending first parameter to url (rel=) when openeing in new window or      //
// ** if removed then (target=) when opening in same window?? worked fine before...            // 
/////////////////////////////////////////////////////////////////////////////////////////////////


d3.json("/api").then(function(my_data) {
  var data = my_data["glossary"];
  var tableBody = d3.select("tbody");
  console.log(data);
  data.forEach((record) => {
    var row = tableBody.append("tr");

    Object.entries(record).forEach(([key, value]) => {
        var cell = row.append("td");
        if (key === "more_info") {
          var text = value;
          cell.html('<a href="' + value + ' rel="noopener noreferrer" target="_blank">' + text + '</a>');
        }
        else {
          cell.text(value);
        }
    });
  });
});