
var my_data = data;
console.log(my_data);
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

    // Set chart area
    var chartGroup = svg.append("g")
                        .attr("transform", `translate(${margin.left}, ${margin.top})`);

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

    var xAxis = chartGroup.append("g")
                          .attr("transform", `translate(0, ${height})`)
                          .call(d3.axisBottom(xLinearScale));
    
    var yAxis = chartGroup.append("g")
                          .attr("transform", `translate(${width/2}, 0)`)
                          .call(d3.axisLeft(yLinearScale));
    
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
    starGroup.on("mouseover", toolTip.show)
             .on("mouseout", toolTip.hide);    
}

init();