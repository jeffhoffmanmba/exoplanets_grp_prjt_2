//////////////////////////////////////////////////////////////////////////////////////////////////
// RUT-SOM-DATA-PT-06-2020-U-C                                                     Douglas High //
// D3-Challenge                                                                 October 5, 2020 //
//      >app.js                                                                                 //
//   - create scatterplot with circles using d3 svg, x and y axes are user driven variables.    //
//   - data points (circles) are states, tooltip popup displays current axes data.              //
//   - gridcomment: gridlines created upon initial load and transition off when their axis      //
//           changes, however they do not render with new values, so processing is commented.   //
//////////////////////////////////////////////////////////////////////////////////////////////////

///////////////////////////////////////////////////////////////////////////////
//00       SVG Setup                                                         //
//   a- set container dimensions, margins, and chart area dimensions.        //
//   b- create svg tag to encompass container.                               //
//   c- create group tag to offset chart area within margins.                //
//   d- set default values for input data fields used in chart generation.   //
///////////////////////////////////////////////////////////////////////////////

//a
const svgWidth = 1200;  const svgHeight = 600;
const margin = {top:0, right:40, bottom:80, left:90};
const width = svgWidth - margin.left - margin.right;
const height = svgHeight - margin.top - margin.bottom;

//b
const svg = d3.select("#scatter").append("svg")
  .attr("width", svgWidth).attr("height", svgHeight);

//c
const chartGroup = svg.append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`);

const chartGroup2 = svg.append("g")
.attr("transform", `translate(${margin.left}, ${margin.top})`);

//d
var chosenXAxis = "gal_long";
var chosenYAxis = "gal_lat";

var showStars = true;
var showPotHabit1 = true;
var showPotHabit2 = true;

//////////////////////////////////////////////////////////////////////////////////
//01      Scale functions                                                       //
//   a- xScale: set the xLinearScale var used for bottomAxis and                //
//              data point placement: horizontal positioning.                   //
//   b- yScale: as above; yLinearScale, leftAxis: vertical positioning.         //
//    > chosen*Axis var's used to determine data to graph.  *LinearScales set   //
//      based on range of said data with offset away from axis lines.           //
//////////////////////////////////////////////////////////////////////////////////

//a
function xScale(dataIn, chosenXAxis) {
  var xLinearScale = d3.scaleLinear()
      // .domain (0, 355)
    .domain([d3.min(dataIn, d => d[chosenXAxis]) -5,
      d3.max(dataIn, d => d[chosenXAxis]) * 1.01
    ])
    .range([0, width]);
  return xLinearScale;
}
//b
function yScale(dataIn, chosenYAxis) {
  var yLinearScale = d3.scaleLinear()
  //  .domain (-80, 65)
    .domain([d3.min(dataIn, d => d[chosenYAxis])-5,
      d3.max(dataIn, d => d[chosenYAxis])+10
    ])
    .range([height, 0]);
  return yLinearScale;
}
////////////////////////////////////////////////////////////////////////////////////////////
//02      render* functions                                                               //
//   a- *XAxis- transition x axis values placement from previous data range.              //
//   b- *YAxis- as above for y axis.                                                      //
//   c- *XGridlines- transition horizontal gridlines to new tick locations.               //
//   d- *YGridlines- as above for vertical gridlines.                                     //
//        note- after left axis change, tick marks and values turn green, perhaps since   //
//        leftAXis and leftGridline both call d3.axisLeft, can we change tick color?      //
//   e- *CirclesXAxis- transition circle movement from previous grouping across x axis.   //
//   f- *CirclesYAxis- as above for y axis.                                               //
//   g- *TextXAxis- transition text within circles movement across x axis.                //
//   h- *TextYAxis- as above for y axis.                                                  //
////////////////////////////////////////////////////////////////////////////////////////////

//a
function renderXAxis(newXScale, xAxis) {
  var bottomAxis = d3.axisBottom(newXScale);
  xAxis.transition()
    .duration(1000)
    .call(bottomAxis);
  return xAxis;
}
//b
function renderYAxis(newYScale, yAxis) {
  var leftAxis = d3.axisLeft(newYScale);
  yAxis.transition()
    .duration(1000)
    .call(leftAxis);
  return yAxis;
}
//e
function renderCirclesXAxis(circlesGroup, newXScale, chosenXAxis) {
  circlesGroup.transition()
    .duration(1000)
    .attr("cx", d => newXScale(d[chosenXAxis]));
  return circlesGroup;
}
//f
function renderCirclesYAxis(circlesGroup, newYScale, chosenYAxis) {
  circlesGroup.transition()
    .duration(1000)
    .attr("cy", d => newYScale(d[chosenYAxis]));
  return circlesGroup;
}
//g
function renderTextXAxis(textGroup, newXScale, chosenXAxis) {
  textGroup.transition()
    .duration(1000)
    .attr("x", d => newXScale(d[chosenXAxis]))
  return textGroup;
}
//h
function renderTextYAxis(textGroup, newYScale, chosenYAxis) {
  textGroup.transition()
    .duration(1000)
    .attr("y", d => newYScale(d[chosenYAxis])+3)  // ?, why the offset?
  return textGroup;
}
///////////////////////////////////////////////////////////////////////
//03      updateToopTip function                                     //
//   a- create and set labelX and labelY based on chosen data.       //
//   b- create toolTip var, popup box with labelX and labelY data.   //
//   c- apply toolTip and mouseover/out actions to circlesGroup.     //
///////////////////////////////////////////////////////////////////////

function updateToolTip(chosenXAxis, chosenYAxis, circlesGroup) { console.log("tip")
  
  //b
  var toolTip = d3.tip().attr("class", "tooltip").offset([5, -75])
    // .html(function(d) {return (`${d.pl_name}`);
    .html(function(d) {return (`${d.star}`);

    });
  //c
  circlesGroup.call(toolTip);
  circlesGroup.on("mouseover", function(data) {toolTip.show(data);})
              .on("mouseout", function(data) {toolTip.hide(data);});

  return circlesGroup;
}
//////////////////////////////////////////////////////////////////////////////////////////////////
//10    Main Processing                                                                         //
//   a- read csv file with promise and throw if error, format data on good read.                //
//   b- generate linear scales and axes, append axes, circles, and circle text to chartGroup.   //
//   c- generate tooltip popup on mouseover.                                                    //
//10.1- x-axis labels.                                                                          //
//10.2- y-axis labels.                                                                          //
//10.3- x-axis label event listener.                                                            //
//10.4- y-axis label event listener.                                                            //
//////////////////////////////////////////////////////////////////////////////////////////////////

//a
// d3.csv("assets/data/new.csv").then(function(dataIn, err) {
d3.csv("../../../sql_extract.csv").then(function(dataIn, err) {

  if (err) throw err;

  dataIn.forEach(function(data) {
    data.gal_lat = +data.gal_lat;
    data.gal_long = +data.gal_long;

  });

  //b
  var xLinearScale = xScale(dataIn, chosenXAxis);
  var yLinearScale = yScale(dataIn, chosenYAxis);
  var bottomAxis = d3.axisBottom(xLinearScale);
  var leftAxis = d3.axisLeft(yLinearScale);
  
  var xAxis = chartGroup.append("g").classed("x-axis", true)
    .attr("transform", `translate(0, ${height})`)
    .call(bottomAxis);

  var yAxis = chartGroup.append("g").classed("y-axis", true)
    .call(leftAxis);
 
  if (habzone = 1) {
    var circlesGroup = chartGroup.selectAll("circle")
      .data(dataIn).enter().append("circle").attr("r", 2)
      .attr("cx", d => xLinearScale(d[chosenXAxis]))
      .attr("cy", d => yLinearScale(d[chosenYAxis]))
      .attr("fill", "orange").attr("opacity", ".8");

      circlesGroup = updateToolTip(chosenXAxis, chosenYAxis, circlesGroup);
  }

  // var textGroup = chartGroup.selectAll(".textLabels")
  //   .data(dataIn).enter().append("text").text(d => d.abbr)
  //   .attr("x", d => xLinearScale(d[chosenXAxis]))
  //   .attr("y", d => yLinearScale(d[chosenYAxis])+3)   //? offset?
  //   .classed("textLabels stateText", true);

  //c  
  
//     d3.csv("assets/data/new.csv").then(function(dataIn2, err) {
// console.log(dataIn2)
//     dataIn2.forEach(function(data2) {
//       data2.gal_lat = +data2.gal_lat;
//       data2.gal_long = +data2.gal_long;
//     });
  
//     //b
//     // var xLinearScale = xScale(dataIn, chosenXAxis);
//     // var yLinearScale = yScale(dataIn, chosenYAxis);
//     // var bottomAxis = d3.axisBottom(xLinearScale);
//     // var leftAxis = d3.axisLeft(yLinearScale);
   
//     // var xAxis = chartGroup.append("g").classed("x-axis", true)
//     //   .attr("transform", `translate(0, ${height})`)
//     //   .call(bottomAxis);
  
//     // var yAxis = chartGroup.append("g").classed("y-axis", true)
//     //   .call(leftAxis);
  
//     var planetGroup = chartGroup2.selectAll("circle")
//       .data(dataIn2).enter().append("circle").attr("r", 2)
//       .attr("cx", d => xLinearScale(d[chosenXAxis]))
//       .attr("cy", d => yLinearScale(d[chosenYAxis]))
//       .attr("fill", "red").attr("opacity", ".8");
//  });

 ////////////////////////////////////////////////////
  //10.1     x-axis labels                          //
  //   - create group tag for x axis labels.        //
  //   - append text for each x axis user option.   //
  ////////////////////////////////////////////////////
  var labelsGroupPot1 = chartGroup.append("g").attr("x", 20)
    .attr("transform", `translate(${width / 2}, ${height + 20})`)
    .classed("active", true)
    .text("Show Exoplanets Most likely to be Habitable");

  var labelsGroupPot2 = chartGroup.append("g").attr("x", 40)
  .attr("transform", `translate(${width / 2}, ${height + 20})`)
  .classed("active", true)
  .text("Show Exoplanets Less likely to be Habitable");


   ////////////////////////////////////////////////////
  //10.2     y-axis labels                          //
  //   - create group tag for y axis labels.        //
  //   - append text for each y axis user option.   //
  ////////////////////////////////////////////////////
  var labelsGroupY = chartGroup.append("g").attr("x",  (height / 2))
    .attr("transform", `translate(0, ${height / 2})`)
    .attr("y", -margin.left)
    .classed("active", true)
    .attr("dy", "1em")
    .attr("transform", "rotate(-90)")
    .text("Show Stars with Discovered Exoplanets");

  ////////////////////////////////////////////////////////////////////
  //10.3     x-axis label event listener                            //
  //   a- get value of selection, process if not new value.         //
  //   b- change axis mapping variables, transition their change.   //
  //   c- highlight chosen x axis label.                            //
  // ////////////////////////////////////////////////////////////////////
  // labelsGroupX.selectAll("text")
  //   .on("click", function() {
  //     //a
  //     var value = d3.select(this).attr("value");

  //     if (showPotHabit1 === true) {
  //       //b 
  //       showStars = false;
  //       starsLabel.classed("active", false).classed("inactive", true);
  //     }
  //     else {
  //       showStars = true;
  //       starsLabel.classed("active", true).classed("inactive", false);
  //     }
  //     renderChart;
        //c 
        // switch (chosenXAxis) {
        //   case "poverty":
        //     povertyLabel.classed("active", true).classed("inactive", false);
        //     ageLabel.classed("active", false).classed("inactive", true);
        //     incomeLabel.classed("active", false).classed("inactive", true);
        //     break;
        //   case "age":
        //     povertyLabel.classed("active", false).classed("inactive", true);
        //     ageLabel.classed("active", true).classed("inactive", false);
        //     incomeLabel.classed("active", false).classed("inactive", true);
        //     break; 
        //   case "income":
        //     povertyLabel.classed("active", false).classed("inactive", true);
        //     ageLabel.classed("active", false).classed("inactive", true);
        //     incomeLabel.classed("active", true).classed("inactive", false);
        //     break;       
  //       }
  //     }
  //   });
  ////////////////////////////////////////////////////////////////////
  //10.4     y-axis label event listener                            //
  //   a- determine if user is turning on or off displaying of stars.   //
  //   b- call fnuction to re-render graph.
  ////////////////////////////////////////////////////////////////////
  labelsGroupY.selectAll("text")
    .on("click", function() {
      //a
      var value = d3.select(this).attr("value");

      if (showStars === true) {
        //b 
        showStars = false;
        starsLabel.classed("active", false).classed("inactive", true);
      }
      else {
        showStars = true;
        starsLabel.classed("active", true).classed("inactive", false);
      }
      renderChart;
    }
  //   });

}).catch(function(error) {
  console.log(error);
});

// circlesGroup = renderCirclesYAxis(circlesGroup, yLinearScale, chosenYAxis);
        // textGroup = renderTextYAxis(textGroup, yLinearScale, chosenYAxis);
        // circlesGroup = updateToolTip(chosenXAxis, chosenYAxis, circlesGroup);