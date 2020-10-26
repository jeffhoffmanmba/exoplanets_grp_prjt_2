
var my_data = data;

// Set axes margin
const adj = 1.1;

// Set svg width and height
const svgWidth = 960;
const svgHeight = 500;

// Set chart margins
const margin = {
    top: 20,
    right: 20,
    bottom: 20,
    left: 40
};

// Get chart's width and height
const width = svgWidth - (margin.left + margin.right);
const height = svgHeight - (margin.top + margin.bottom);

// function running initially
function init(){
    // Set svg area
    var svg = d3.select("#chart")
                // Set the div as a svg container for responsive design
                .classed("svg-container", true)
                .append("svg")
                .attr("preserveAspectRatio", "xMinYMin meet")
                .attr("viewBox", `0 0 ${svgWidth} ${svgHeight}`)
                // CSS for responsive design
                .classed("svg-content-responsive", true);
    

                        

    // Change data types to be able to calculate
    my_data["stars"].forEach(d => {
        d.temp_k = +d.temp_k;
        d.radius_s = +d.radius_s;
        d.gravity = +d.gravity;
        d.gal_lat = +d.gal_lat;
        d.gal_long = +d.gal_long;
        d.distance = +d.distance;
    });

    my_data["planets"].forEach(d => {
        d.radius_e = +d.radius_e;
        d.temp_f = +d.temp_f;
        d.circumference_k = +d.circumference_k;
    });

    // Make a tooltip function using d3.tip()
    var toolTip = d3.tip()
                    .attr("class", "d3-tip")
                    .offset([-8, 0])
                    .html(d => {
                        var tip = `${d.star}<br><ul>
                                   <li>Temperature: ${d.temp_k}</li>
                                   <li>Gravity: ${d.gravity}<br></li>
                                   <li>Radius: ${d.radius_s}<br></li>
                                   <li>Distance: ${d.distance}</li></ul>`;
                            
                        return tip;
                        });

    d3.select("svg").call(toolTip);

    lat = d3.max(my_data["stars"].map(d => d.gal_lat > 0 ? d.gal_lat : d.gal_lat*-1));
    lon = d3.extent(my_data["stars"].map(d => d.gal_long > 0 ? d.gal_long : d.gal_long*-1));

    // Make scaling functions and rendering initial X and Y axes

    var xLinearScale = d3.scaleLinear()
                         .domain([lat*adj*-1, lat*adj])
                         .range([0, width]);

    var yLinearScale = d3.scaleLinear()
                         .domain([lon[0]*adj, lon[1]*adj])
                         .range([height, 0]);

    var xAxis = svg.append("g")
                          .attr("transform", `translate(${margin.left}, ${height+margin.top})`)
                          .call(d3.axisBottom(xLinearScale));
    
    var yAxis = svg.append("g")
                          .attr("transform", `translate(${margin.left}, ${margin.top})`)
                          .call(d3.axisLeft(yLinearScale));
    
    // Add a clipPath: everything out of this area won't be drawn.
    var clip = svg.append("defs").append("svg:clipPath")
                                 .attr("id", "clip")
                                 .append("svg:rect")
                                 .attr("width", width )
                                 .attr("height", height )
                                 .attr("x", 0)
                                 .attr("y", 0);

    // Set chart area
    var chartGroup = svg.append("g")
                        .attr("clip-path", "url(#clip)")
                        .attr("transform", `translate(${margin.left}, ${margin.top})`);

    // Set the zoom and Pan features: how much you can zoom, on which part, and what to do when there is a zoom
    var zoom = d3.zoom()
                 .scaleExtent([.5, 20])  // This control how much you can unzoom (x0.5) and zoom (x20)
                 .extent([[0, 0], [width, height]])
                 .on("zoom", updateChart);

    svg.append("rect")
       .attr("width", width)
       .attr("height", height)
       .style("fill", "none")
       .style("pointer-events", "all")
       .attr('transform', `translate(${margin.left},${margin.top}`)
       .call(zoom);

    // Render stars
    var starGroup = chartGroup.append("g")
                              .selectAll("circle")
                              .data(my_data["stars"])
                              .enter()
                              .append("circle")
                              .attr("cx", d => xLinearScale(d.gal_lat))
                              .attr("cy", d => yLinearScale(d.gal_long))
                              .attr("r", d => Math.sqrt(d.radius_s))
                              .classed("stateCircle", true);
    
    // Set listeners for showing and hiding tooltips
    chartGroup.selectAll("circle")
              .on("mouseover", toolTip.show)
              .on("mouseout", toolTip.hide);

    function updateChart() {
        // recover the new scale
        var newX = d3.event.transform.rescaleX(xLinearScale);
        var newY = d3.event.transform.rescaleY(yLinearScale);

        // update axes with these new boundaries
        xAxis.call(d3.axisBottom(newX));
        yAxis.call(d3.axisLeft(newY));

        // update circle position
        chartGroup.selectAll("circle")
                  .attr('cx', function(d) {return newX(d.gal_lat)})
                  .attr('cy', function(d) {return newY(d.gal_long)});
    }
}

init();