/////////////////////////////////////////////////////////////////////////////////////////////////
//  RUT-SOM-DATA-PT-06-2020-U-C                                                   Douglas High //
//   Project2                                                               October 2020 //
//     
/////////////////////////////////////////////////////////////////////////////////////////////////



var innerCode = document.getElementById('inner-code');
while(innerCode.firstChild) { 
    innerCode.removeChild(innerCode.firstChild); 
}
innerCode.insertAdjacentHTML('afterend', '<div id="table-area" class=""> <table id="glossary-table" class="table  table-dark table-hover">  <thead class="thead-dark"> <tr> <th class="table-head">NAME</th> <th class="table-head">VALUE</th> <th class="table-head">DESCRIPTION</th> <th class="table-head">MORE INFORMATION</th> </tr> </thead> <tbody></tbody></table></div>');

var div = document.getElementById("inner-code"); 
              
            while(div.firstChild) { 
                div.removeChild(div.firstChild); }

innerCode.insertAdjacentHTML('beforebegin', '<div id="table-area" class=""> <table id="further-interest-table" class="table table-dark table-hover"> <thead class="thead-dark"> <tr> <th class="table-head">CAT</th> <th class="table-head">NAME</th> <th class="table-head">LENGTH</th> <th class="table-head">DESCRIPTION</th> <th class="table-head">LINK</th> </tr> </thead> <tbody></tbody> </table> </div>');

   
// function glossaryHeader() {
//     innerCode.insertAdjacentHTML('afterend', '<div id="table-area" class=""> <table id="glossary-table" class="table  table-dark table-hover">  <thead class="thead-dark"> <tr> <th class="table-head">NAME</th> <th class="table-head">VALUE</th> <th class="table-head">DESCRIPTION</th> <th class="table-head">MORE INFORMATION</th> </tr> </thead> <tbody></tbody></table></div>');
// }

// function removeInnerCode() {
//     while(innerCode.firstChild) { 
//         innerCode.removeChild(innerCode.firstChild); 
//     }
// }

// function furtherInfoHeader() {
//     innerCode.insertAdjacentHTML('afterend', '<div id="table-area" class=""> <table id="further-interest-table" class="table table-dark table-hover"> <thead class="thead-dark"> <tr> <th class="table-head">CAT</th> <th class="table-head">NAME</th> <th class="table-head">LENGTH</th> <th class="table-head">DESCRIPTION</th> <th class="table-head">LINK</th> </tr> </thead> <tbody></tbody> </table> </div>');
// }

// glossaryHeader()

// // removeInnerCode()

// furtherInfoHeader()


// d3.csv("../../../Xlcsv/glossary.csv").then(function(data) {
  
//     var tableBody = d3.select("tbody");
  
//     data.forEach((record) => {
//       var row = tableBody.append("tr");
  
//       Object.entries(record).forEach(([key, value]) => {
//           var cell = row.append("td");
//           if (key === "more_info") {
//             var text = value;
//             cell.html('<a href="' + value + ' rel="noopener noreferrer" target="_blank">' + text + '</a>');
//           }
//           else {
//             cell.text(value);
//           }
//       });
//     });
//   });
  