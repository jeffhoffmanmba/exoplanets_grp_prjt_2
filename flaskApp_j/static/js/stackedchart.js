// Setup svg using Bostock's margin convention
        
var margin_stacked = {top: 20, right: 160, bottom: 35, left: 30};
        
var width_stacked = 960 - margin_stacked.left - margin_stacked.right,
    height_stacked = 500 - margin_stacked.top - margin_stacked.bottom;

var svg_1 = d3v3.select("#stackedChart")
  .append("svg")
  .attr("width", width_stacked + margin_stacked.left + margin_stacked.right)
  .attr("height", height_stacked + margin_stacked.top + margin_stacked.bottom)
  .append("g")
  .attr("transform", "translate(" + margin_stacked.left + "," + margin_stacked.top + ")");


/* Data in strings like it would be if imported from a csv */
d3v3.json("/api", my_data => {
    data = my_data["stackedChart"];
    var parse = d3v3.time.format("%Y").parse;

    // Transpose the data into layers
    
    var dataset = d3v3.layout.stack()(["RadialVelocity", "Transit", "Imaging", "Microlensing"].map(function(detectionMethod) {
    return data.map(function(d) {
        return {x: parse(`${d.year}`), y: +d[detectionMethod]};
    });
    }));
    
    
    // Set x, y and colors
    var x = d3v3.scale.ordinal()
    .domain(dataset[0].map(function(d) { return d.x; }))
    .rangeRoundBands([10, width_stacked-10], 0.02);
    
    var y = d3v3.scale.linear()
    .domain([0, d3v3.max(dataset, function(d) {  return d3v3.max(d, function(d) { return d.y0 + d.y; });  })])
    .range([height_stacked, 0]);
    
    var colors = ["b33040", "#d25c4d", "#f2b447", "#d9d574"];
    
    
    // Define and draw axes
    var yAxis_stacked = d3v3.svg.axis()
    .scale(y)
    .orient("left")
    .ticks(5)
    .tickSize(-width_stacked, 0, 0)
    .tickFormat( function(d) { return d } );
    
    var xAxis_stacked = d3v3.svg.axis()
    .scale(x)
    .orient("bottom")
    .tickFormat(d3v3.time.format("%Y"));
    
    svg_1.append("g")
    .attr("class", "y axis")
    .call(yAxis_stacked);
    
    svg_1.append("g")
    .attr("class", "x axis")
    .attr("transform", "translate(0," + height_stacked + ")")
    .call(xAxis_stacked);
    
    
    // Create groups for each series, rects for each segment 
    var groups = svg_1.selectAll("g.cost")
    .data(dataset)
    .enter().append("g")
    .attr("class", "cost")
    .style("fill", function(d, i) { return colors[i]; });
    
    var rect = groups.selectAll("rect")
    .data(function(d) { return d; })
    .enter()
    .append("rect")
    .attr("x", function(d) { return x(d.x); })
    .attr("y", function(d) { return y(d.y0 + d.y); })
    .attr("height", function(d) { return y(d.y0) - y(d.y0 + d.y); })
    .attr("width", x.rangeBand())
    .on("mouseover", function() { tooltip_1.style("display", null); })
    .on("mouseout", function() { tooltip_1.style("display", "none"); })
    .on("mousemove", function(d) {
        var xPosition = d3v3.mouse(this)[0] - 15;
        var yPosition = d3v3.mouse(this)[1] - 25;
        tooltip_1.attr("transform", "translate(" + xPosition + "," + yPosition + ")");
        tooltip_1.select("text").text(d.y);
    });
    
    
    // Draw legend
    var legend = svg_1.selectAll(".legend")
    .data(colors)
    .enter().append("g")
    .attr("class", "legend")
    .attr("transform", function(d, i) { return "translate(30," + i * 19 + ")"; });
    
    legend.append("rect")
    .attr("x", width_stacked - 18)
    .attr("width", 18)
    .attr("height", 18)
    .style("fill", function(d, i) {return colors.slice().reverse()[i];});
    
    legend.append("text")
    .attr("x", width_stacked + 5)
    .attr("y", 9)
    .attr("dy", ".35em")
    .style("text-anchor", "start")
    .text(function(d, i) { 
        switch (i) {
        case 0: return "Microlensing";
        case 1: return "Imaging";
        case 2: return "Transit";
        case 3: return "RadialVelocity";
        }
    });
    
    
    // Prep the tooltip bits, initial display is hidden
    var tooltip_1 = svg_1.append("g")
    .attr("class", "tooltip")
    .style("display", "none");
        
    tooltip_1.append("rect")
    .attr("width", 30)
    .attr("height", 20)
    .attr("fill", "white")
    .style("opacity", 0.5);
    
    tooltip_1.append("text")
    .attr("x", 15)
    .attr("dy", "1.2em")
    .style("text-anchor", "middle")
    .attr("font-size", "12px")
    .attr("font-weight", "bold");
})