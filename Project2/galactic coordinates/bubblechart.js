function one ()
chart = {
  const svg = d3.create("svg")
      .attr("viewBox", [0, 0, size, size]);

  const circle = svg.selectAll("circle")
    .data(pack(data).descendants().slice(1))
    .join("circle")
      .attr("r", d => d.r)
      .attr("cx", d => d.x)
      .attr("cy", d => d.y);

  circle.filter(d => d.data)
      .attr("fill", d => color(d.data.radius))
    .append("title")
      .text(d => `${d.data.name}
Planet radius: ${d.data.radius} EU
Star distance: ${isNaN(d.data.distance) ? "N/A" : `${d.data.distance} pc`}`);

  circle.filter(d => d.children)
      .attr("fill", "none")
      .attr("stroke", "#000")
      .attr("stroke-width", 1.5);

  return svg.node();
}

//
pack = {
    const pack = d3.pack().size([size, size]).padding(5);
    const planets = [{children: data.filter(d => d.distance === 0)}];
    const exoplanets = data.filter(d => d.distance !== 0);
    const root = {children: planets.concat(exoplanets)};
    return data => {
      return pack(d3.hierarchy(root)
        .sum(d => d.radius * d.radius)
        .sort((a, b) => {
          return !a.children - !b.children
              || isNaN(a.data.distance) - isNaN(b.data.distance)
              || a.data.distance - b.data.distance;
        }));
    };
  }

//
size = 954

//
color = d3.scaleQuantize()
    .domain(d3.extent(data, d => d.radius))
    .range(["#156b87", "#876315", "#543510", "#872815"])

//
data = d3.csvParse(await FileAttachment("exoplanets.csv").text(), d3.autoType)  //name,radius,distance

//
d3 = require("d3@5")
    // yields
        // Object {
        //     event: null
        //     format: ƒ(t)
        //     formatPrefix: ƒ(t, n)
        //     timeFormat: ƒ(t)...
        //     ...

