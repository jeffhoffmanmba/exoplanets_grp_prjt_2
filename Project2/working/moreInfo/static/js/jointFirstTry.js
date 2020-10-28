/////////////////////////////////////////////////////////////////////////////////////////////////
//  RUT-SOM-DATA-PT-06-2020-U-C                                                   Douglas High //
//   Project2                                                               October 2020 //
//  
/////////////////////////////////////////////////////////////////////////////////////////////////

////////////////////////////////////////////////////////////////
// T20        changeChart function
/////////////////////////////////////////////////////////


var chooseGlossary = false;

function change() { 
  if(chooseGlossary) {
    chooseGlossary = false;
    d3.select('#glossaryButton').style('fill', '#0033cc');
    d3.select('#furtherInfoButton').style('fill', 'white');
    d3.select('#glossaryButtonText').style('stroke', '#0033cc').style("font-size", "22px");
    d3.select('#furtherInfoButtonText').style('stroke', 'white').style("font-size", "18px");
    d3.select('#chartHeader').text("GLOSSARY").attr("x", 400);
    changeChart();
  } else {
    colorByDistance = true;
    d3.select('#furtherInfoButton').style('fill', '#0033cc');
    d3.select('#glossaryButton').style('fill', 'white');
    d3.select('#furtherInfoButtonText').style('stroke', '#0033cc').style("font-size", "22px");
    d3.select('#glossaryButtonText').style('stroke', 'white').style("font-size", "18px");
    d3.select('#chartHeader').text("FURTHER INFORMATION").attr("x", 320);
    changeChart();
  }
}


function changeChart() {


}

///////////////////////////////////////////////
//  Buttons for Table Choice                 //
//   a- 
//////////////////////////////////////////////

var choice = d3.select("#choice1").append("svg")
   .attr("width", 1200)
   .attr("height", 200);

var chartChoice = d3.select("#choice2").append("svg");


// choose table text
choice.append("text")
  .attr("id", "choiceText")
  .style("font-size", "18px")
  .attr("x", 20)
  .attr("y", 24)
  .style("stroke", 'white')
  .text("Choose Your Table --->");

// glossary button
choice.append("rect")
  .attr("id", "glossaryButton")
  .attr("x", 230)
  .attr("y", 10)
  .attr("width", 15)
  .attr("height", 15)
  .style("stroke", 'black')
  .style("fill", "#0033cc")
  .on("click", change);

// glossary text
choice.append("text")
  .attr("id", "glossaryButtonText")
  .style("font-size", "22px")
  .attr("x", 255)
  .attr("y", 24)
  .style("stroke", '#0033cc')
  .text("Glossary");

// further info button  
choice.append("rect")
  .attr("id", "furtherInfoButton")
  .attr("x", 370)
  .attr("y", 10)
  .attr("width", 15)
  .attr("height", 15)
  .style("stroke", 'black')
  .style("fill", 'white')
  .on("click", change);

// further info text
choice.append("text")
  .attr("id", "furtherInfoButtonText")
  .style("font-size", "18px")
  .attr("x", 395)
  .attr("y", 22)
  .style("stroke", 'white')
  .text("Further Information");


  choice.append("text").text("GLOSSARY")
  .attr("id", "chartHeader")
  .attr("y", 100)
  .attr("x", 400)
  .style("font-size", "33px")
  .style("stroke", 'white')
  .text("GLOSSARY");
        

chartChoice.append("th")
  .html('class="table-head">NAME');

///////////////////////////////////////////////////////////////
//       main process
//   - read in data and create default parameters  
////////////////////////////////////////////////////////////

d3.csv("../../../Xlcsv/glossary.csv").then(function(data) {
 
  var tableBody = d3.select("tbody");

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
  