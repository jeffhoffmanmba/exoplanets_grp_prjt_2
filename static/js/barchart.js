
d3v3.json("/api", function(error, my_data){
    var data = my_data["barChart"];

    data.forEach(function (d) {
      d.number = +d.number;
    });
    // console.log(data)
    var margin_bar = {top: 65, bottom: 50, left: 80, right: 30}, axisPadding = 10;
    var Width_bar = 500, Height_bar = 300;
    var svgWidth_bar = Width_bar + margin_bar.left + margin_bar.right,
        svgHeight_bar = Height_bar + margin_bar.top + margin_bar.bottom;
    var maxNumber = d3v3.max(data, function(d){ return d.number; });
    
    
    // define scales and axises
    var xScale_bar = d3v3.scale.ordinal()
        .domain(data.map(function(d){ return d.type; }))
        .rangeBands([0, Width_bar], 0.1);
    var yScale_bar = d3v3.scale.linear()
        .domain([0, maxNumber])
        .range([0, Height_bar]);
    var color = d3v3.scale.category10();
    
    var xAxis_bar = d3v3.svg.axis()
        .scale(xScale_bar)
        .tickSize(0,0)
        .orient('bottom');
    var yAxis_bar = d3v3.svg.axis()
        .scale(yScale_bar.copy().domain([maxNumber, 0]))
        .tickSize(6,0)
        .ticks(5)
        .orient('left');
    
    // create a svg canvas
    var svg_bar = d3v3.select('#barChart')
        .append('svg')
        .attr({width: svgWidth_bar, height: svgHeight_bar})
    
    
    // Drawing for axises
    var xGroup = svg_bar.append('g')
        .attr('class', 'xGroup')
        .attr('transform', 'translate(' + [margin_bar.left, margin_bar.top + Height_bar + axisPadding] + ')');
    xGroup.call(xAxis_bar);
    styleAxis(xGroup);
    var yGroup = svg_bar.append('g')
        .attr('class', 'yGroup')
        .attr('transform', 'translate(' + [margin_bar.left - axisPadding, margin_bar.top] + ')');
    yGroup.call(yAxis_bar);
    styleAxis(yGroup);


    // Label layer
    var label = svg_bar.append('g')
        .attr('transform', 'translate(' + [margin_bar.left - axisPadding, margin_bar.top] + ')');
    label.append('text')
        .text('Planet Type')
        .attr('transform', 'rotate(-90)')
        .attr({
            'text-anchor': 'start',
            x: -75,
            y: 20,
        })
    label.append('text')
        .text('PlanetTypes - d3 BarChart w Tooltip')
        .attr('transform', 'translate(' + [Width_bar / 2, - margin_bar.top / 2] + ')')
        .attr({
            'text-anchor': 'middle',
            'font-size': '1.5em',
            fill: 'steelblue',
        });


    // Drawing for graph body
    var graph = svg_bar.append('g')
        .attr('class', 'graph')
        .attr('transform', 'translate(' + [margin_bar.left, margin_bar.top + Height_bar] + ')');
    var bars = graph.selectAll('g')
        .data(data)
        .enter()
        .append('g')
        .attr('transform', function(d,i){ return 'translate(' + [xScale_bar(d.type), -1 * yScale_bar(d.number)] + ')'; });
    bars.append('rect')
        .each(function(d,i){
            d3v3.select(this).attr({
                fill: color.range()[i],
                width: xScale_bar.rangeBand(),
                height: yScale_bar(d.number),
            })
        })
        .on('mouseover', mouseover)
        .on('mousemove', mousemove)
        .on('mouseout', mouseout);
    
    bars.append('text')
    .text(function(d){ return d.number; })
    .each(function(d,i){
        d3v3.select(this).attr({
            fill: color.range()[i],
            stroke: 'none',
            x: xScale_bar.rangeBand() / 2,
            y: -5,
            'text-anchor': 'middle',
        });
    })
    
    
    
    // tooltips
    var div = d3v3.select('#barChart').append('div')
        .attr('class', 'tooltip')
        .style('display', 'none');
    function mouseover(){
        div.style('display', null);
    }
    function mousemove(){
        var d = d3v3.select(this).data()[0]
        div
            .html(d.type + '<hr/>' + d.percent)
            .style('left', (d3v3.event.pageX - 34) + 'px')
            .style('top', '600 px');
    }
    
    function mouseout(){
        div.style('display', 'none');
    }
})


function styleAxis(axis){
    // style path
    axis.select('.domain').attr({
        fill: 'none',
        stroke: '#888',
        'stroke-width': 1
    });
    // style tick
    axis.selectAll('.tick line').attr({
        stroke: '#000',
        'stroke-width': 1,
    })
}