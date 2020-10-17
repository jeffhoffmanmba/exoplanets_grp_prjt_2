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
//gridcomment
// //c
// function renderXGrid(newXScale, xGrid) {
//   var xGridlines = d3.axisTop(newXScale);
//   xGrid.transition()
//     .duration(1000)
//     .call(xGridlines);
//   return xGrid;
// }
// //d
// function renderYGrid(newYScale, yGrid) {
//   var yGridlines = d3.axisLeft(newYScale);
//   yGrid.transition()
//     .duration(1000)
//     .call(yGridlines);
//   return yGrid;
// }

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

function updateToolTip(chosenXAxis, chosenYAxis, circlesGroup) {
  
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
d3.csv("assets/data/stars.csv").then(function(dataIn, err) {

  if (err) throw err;

console.log (dataIn)

  dataIn.forEach(function(data) {
    data.gal_lat = +data.gal_lat;
    data.gal_long = +data.gal_long;

    // data.age = +data.age;
    // data.income = +data.income;
  //   data.healthcare = +data.healthcare;
  //   data.obesity = +data.obesity;
  //   data.smokes = +data.smokes;
  });

  //b
  var xLinearScale = xScale(dataIn, chosenXAxis);
  var yLinearScale = yScale(dataIn, chosenYAxis);
  var bottomAxis = d3.axisBottom(xLinearScale);
  var leftAxis = d3.axisLeft(yLinearScale);
  //gridcomment
  // var xGridlines = d3.axisTop(xLinearScale).tickFormat("").tickSize(-height).scale(xLinearScale);
  // var yGridlines = d3.axisLeft(yLinearScale).tickFormat("").tickSize(-width).scale(yLinearScale);

  var xAxis = chartGroup.append("g").classed("x-axis", true)
    .attr("transform", `translate(0, ${height})`)
    .call(bottomAxis);

  var yAxis = chartGroup.append("g").classed("y-axis", true)
    .call(leftAxis);

  //gridcomment
  // var xGrid = chartGroup.append("g").attr("class", "grid")
  //   .attr("opacity", ".4").attr("color", "green")
  //   .call(xGridlines);

  // var yGrid = chartGroup.append("g").attr("class", "grid")
  //   .attr("opacity", ".4").attr("color", "green")
  //   .call(yGridlines);
 
  var circlesGroup = chartGroup.selectAll("circle")
    .data(dataIn).enter().append("circle").attr("r", 2)
    .attr("cx", d => xLinearScale(d[chosenXAxis]))
    .attr("cy", d => yLinearScale(d[chosenYAxis]))
    .attr("fill", "orange").attr("opacity", ".8");

  // var textGroup = chartGroup.selectAll(".textLabels")
  //   .data(dataIn).enter().append("text").text(d => d.abbr)
  //   .attr("x", d => xLinearScale(d[chosenXAxis]))
  //   .attr("y", d => yLinearScale(d[chosenYAxis])+3)   //? offset?
  //   .classed("textLabels stateText", true);

  //c  
  circlesGroup = updateToolTip(chosenXAxis, chosenYAxis, circlesGroup);

  d3.csv("assets/data/new.csv").then(function(dataIn2, err) {
console.log(dataIn2)
    dataIn2.forEach(function(data2) {
      data2.gal_lat = +data2.gal_lat;
      data2.gal_long = +data2.gal_long;
    });
  
    //b
    // var xLinearScale = xScale(dataIn, chosenXAxis);
    // var yLinearScale = yScale(dataIn, chosenYAxis);
    // var bottomAxis = d3.axisBottom(xLinearScale);
    // var leftAxis = d3.axisLeft(yLinearScale);
   
    // var xAxis = chartGroup.append("g").classed("x-axis", true)
    //   .attr("transform", `translate(0, ${height})`)
    //   .call(bottomAxis);
  
    // var yAxis = chartGroup.append("g").classed("y-axis", true)
    //   .call(leftAxis);
  
    var planetGroup = chartGroup2.selectAll("circle")
      .data(dataIn2).enter().append("circle").attr("r", 2)
      .attr("cx", d => xLinearScale(d[chosenXAxis]))
      .attr("cy", d => yLinearScale(d[chosenYAxis]))
      .attr("fill", "red").attr("opacity", ".8");
 });

 // ////////////////////////////////////////////////////
  // //10.1     x-axis labels                          //
  // //   - create group tag for x axis labels.        //
  // //   - append text for each x axis user option.   //
  // ////////////////////////////////////////////////////
  // var labelsGroupX = chartGroup.append("g").attr("x", 0)
  //   .attr("transform", `translate(${width / 2}, ${height + 20})`);

  // var ageLabel = labelsGroupX.append("text")
  //   .attr("y", 20)
  //   .attr("value", "age") // value to grab for event listener
  //   .classed("active", true)
  //   .text("Age (Median)");

  // var povertyLabel = labelsGroupX.append("text")
  //   .attr("y", 40)
  //   .attr("value", "poverty") // value to grab for event listener
  //   .classed("inactive", true)
  //   .text("In Poverty (%)");

  // var incomeLabel = labelsGroupX.append("text")
  //   .attr("y", 60)
  //   .attr("value", "income") // value to grab for event listener
  //   .classed("inactive", true)
  //   .text("Household Income (Median)");

  // ////////////////////////////////////////////////////
  // //10.2     y-axis labels                          //
  // //   - create group tag for y axis labels.        //
  // //   - append text for each y axis user option.   //
  // ////////////////////////////////////////////////////
  // var labelsGroupY = chartGroup.append("g").attr("x",  (height / 2))
  //   .attr("transform", `translate(0, ${height / 2})`);

  // var smokesLabel = labelsGroupY.append("text")
  //   .attr("y", -margin.left)
  //   .classed("inactive", true)
  //   .attr("dy", "1em")
  //   .attr("value", "smokes") // value to grab for event listener
  //   .attr("transform", "rotate(-90)")
  //   .text("Smokes (%)");

  // var obesityLabel = labelsGroupY.append("text")
  //   .attr("y", 20 - margin.left)
  //   .classed("inactive", true)
  //   .attr("dy", "1em")
  //   .attr("value", "obesity") // value to grab for event listener
  //   .attr("transform", "rotate(-90)")
  //   .text("Obesity (%)");

  // var healthcareLabel = labelsGroupY.append("text")
  //   .attr("y", 40 - margin.left)
  //   .classed("active", true)
  //   .attr("dy", "1em")
  //   .attr("value", "healthcare") // value to grab for event listener
  //   .attr("transform", "rotate(-90)")
  //   .text("Lacks Healthcare (%)");

  // ////////////////////////////////////////////////////////////////////
  // //10.3     x-axis label event listener                            //
  // //   a- get value of selection, process if not new value.         //
  // //   b- change axis mapping variables, transition their change.   //
  // //   c- highlight chosen x axis label.                            //
  // ////////////////////////////////////////////////////////////////////
  // labelsGroupX.selectAll("text")
  //   .on("click", function() {
  //     //a
  //     var value = d3.select(this).attr("value");

  //     if (value !== chosenXAxis) {
  //       //b 
  //       chosenXAxis = value;
  //       xLinearScale = xScale(dataIn, chosenXAxis);
  //       xAxis = renderXAxis(xLinearScale, xAxis);
  //       //gridcomment
  //       // xGrid = renderXGrid(xLinearScale, xGrid);
  //       circlesGroup = renderCirclesXAxis(circlesGroup, xLinearScale, chosenXAxis);
  //       textGroup = renderTextXAxis(textGroup, xLinearScale, chosenXAxis);
  //       circlesGroup = updateToolTip(chosenXAxis, chosenYAxis, circlesGroup);

  //       //c 
  //       switch (chosenXAxis) {
  //         case "poverty":
  //           povertyLabel.classed("active", true).classed("inactive", false);
  //           ageLabel.classed("active", false).classed("inactive", true);
  //           incomeLabel.classed("active", false).classed("inactive", true);
  //           break;
  //         case "age":
  //           povertyLabel.classed("active", false).classed("inactive", true);
  //           ageLabel.classed("active", true).classed("inactive", false);
  //           incomeLabel.classed("active", false).classed("inactive", true);
  //           break; 
  //         case "income":
  //           povertyLabel.classed("active", false).classed("inactive", true);
  //           ageLabel.classed("active", false).classed("inactive", true);
  //           incomeLabel.classed("active", true).classed("inactive", false);
  //           break;       
  //       }
  //     }
  //   });
  // ////////////////////////////////////////////////////////////////////
  // //10.4     y-axis label event listener                            //
  // //   a- get value of selection, process if not new value.         //
  // //   b- change axis mapping variables, transition their change.   //
  // //   c- highlight chosen y axis label.                            //
  // ////////////////////////////////////////////////////////////////////
  // labelsGroupY.selectAll("text")
  //   .on("click", function() {
  //     //a
  //     var value = d3.select(this).attr("value");

  //     if (value !== chosenYAxis) {
  //       //b 
  //       chosenYAxis = value;
  //       yLinearScale = yScale(dataIn, chosenYAxis);
  //       yAxis = renderYAxis(yLinearScale, yAxis);
  //       //gridcomment
  //       // yGrid = renderYGrid(yLinearScale, yGrid);
  //       circlesGroup = renderCirclesYAxis(circlesGroup, yLinearScale, chosenYAxis);
  //       textGroup = renderTextYAxis(textGroup, yLinearScale, chosenYAxis);
  //       circlesGroup = updateToolTip(chosenXAxis, chosenYAxis, circlesGroup);

  //       //c 
  //       switch (chosenYAxis) {
  //         case "obesity":
  //           obesityLabel.classed("active", true).classed("inactive", false);
  //           smokesLabel.classed("active", false).classed("inactive", true);
  //           healthcareLabel.classed("active", false).classed("inactive", true);
  //           break;
  //         case "smokes":
  //           obesityLabel.classed("active", false).classed("inactive", true);
  //           smokesLabel.classed("active", true).classed("inactive", false);
  //           healthcareLabel.classed("active", false).classed("inactive", true);
  //           break; 
  //         case "healthcare":
  //           obesityLabel.classed("active", false).classed("inactive", true);
  //           smokesLabel.classed("active", false).classed("inactive", true);
  //           healthcareLabel.classed("active", true).classed("inactive", false);
  //           break;       
  //       }
  //     }
  //   });

}).catch(function(error) {
  console.log(error);
});