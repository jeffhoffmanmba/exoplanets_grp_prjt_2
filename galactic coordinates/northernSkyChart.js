function

map = {
  const cx = width / 2;
  const cy = height / 2;

  const svg = d3.create("svg")
      .attr("viewBox", [0, 0, width, height])
      .attr("font-family", "sans-serif")
      .attr("font-size", 10)
      .attr("text-anchor", "middle")
      .attr("fill", "currentColor")
      .style("margin", "0 -14px")
      .style("color", "white")
      .style("background", "radial-gradient(#081f2b 0%, #061616 100%)")
      .style("display", "block");

  svg.append("path")
      .attr("d", path(graticule))
      .attr("fill", "none")
      .attr("stroke", "currentColor")
      .attr("stroke-opacity", 0.2);

  svg.append("path")
      .attr("d", path(outline))
      .attr("fill", "none")
      .attr("stroke", "currentColor");

  svg.append("g")
      .call(xAxis);

  svg.append("g")
      .call(yAxis);

  const focusDeclination = svg.append("circle")
      .attr("cx", cx)
      .attr("cy", cy)
      .attr("fill", "none")
      .attr("stroke", "yellow");

  const focusRightAscension = svg.append("line")
      .attr("x1", cx)
      .attr("y1", cy)
      .attr("x2", cx)
      .attr("y2", cy)
      .attr("stroke", "yellow");

  svg.append("g")
      .attr("stroke", "black")
    .selectAll("circle")
    .data(data)
    .join("circle")
      .attr("r", d => radius(d.magnitude))
      .attr("transform", d => `translate(${projection(d)})`);

  svg.append("g")
      .attr("pointer-events", "all")
      .attr("fill", "none")
    .selectAll("path")
    .data(data)
    .join("path")
      .on("mouseover", mouseovered)
      .on("mouseout", mouseouted)
      .attr("d", (d, i) => voronoi.renderCell(i))
    .append("title")
      .text(formatTitle);

  function mouseovered(event, d) {
    const [px, py] = projection(d);
    const dx = px - cx;
    const dy = py - cy;
    const a = Math.atan2(dy, dx);
    focusDeclination.attr("r", Math.hypot(dx, dy));
    focusRightAscension.attr("x2", cx + 1e3 * Math.cos(a)).attr("y2", cy + 1e3 * Math.sin(a));
  }

  function mouseouted(event, d) {
    focusDeclination.attr("r", null);
    focusRightAscension.attr("x2", cx).attr("y2", cy);
  }

  return svg.node();
}
// formatTitle = ƒ(…)
function formatTitle({ID, constellation, greek_letter}) {  
    return `HR${ID}${constellation === null ? ``
      : greek_letter === null ? `
  ${nominative[constellation]}` : `
  ${greek_letter
      .replace(/[a-z]+/g, w => letters[w])
      .replace(/\d/g, c => superscript[c])} ${genitive[constellation]}`}`;
  }
//   superscript = "⁰¹²³⁴⁵⁶⁷⁸⁹"
superscript = "⁰¹²³⁴⁵⁶⁷⁸⁹"

//
letters = ({alf: "α", bet: "β", gam: "γ", del: "δ", eps: "ε", zet: "ζ", eta: "η", tet: "θ",
    iot: "ι", kap: "κ", lam: "λ", mu: "μ", nu: "ν", xi: "ξ", omi: "ο", pi: "π", ro: "ρ",
    sig: "σ", tau: "τ", ups: "υ", phi: "φ", chi: "χ", psi: "ψ", omg: "ω"})

//
nominative = ({And: "Andromeda", Ant: "Antlia", Aps: "Apus", Aqr: "Aquarius", Aql: "Aquila", Ara: "Ara",
    Ari: "Aries", Aur: "Auriga", Boo: "Boötes", Cae: "Caelum", Cam: "Camelopardalis", Cnc: "Cancer",
    CVn: "Canes Venatici", CMa: "Canis Major", CMi: "Canis Minor", Cap: "Capricornus", Car: "Carina",
    Cas: "Cassiopeia", Cen: "Centaurus", Cep: "Cepheus", Cet: "Cetus", Cha: "Chamaeleon", Cir: "Circinus",
    Col: "Columba", Com: "Coma Berenices", CrA: "Corona Austrina", CrB: "Corona Borealis", Crv: "Corvus",
    Crt: "Crater", Cru: "Crux", Cyg: "Cygnus", Del: "Delphinus", Dor: "Dorado", Dra: "Draco", Equ: "Equuleus",
    Eri: "Eridanus", For: "Fornax", Gem: "Gemini", Gru: "Grus", Her: "Hercules", Hor: "Horologium", Hya: "Hydra",
    Hyi: "Hydrus", Ind: "Indus", Lac: "Lacerta", Leo: "Leo", LMi: "Leo Minor", Lep: "Lepus", Lib: "Libra",
    Lup: "Lupus", Lyn: "Lynx", Lyr: "Lyra", Men: "Mensa", Mic: "Microscopium", Mon: "Monoceros", Mus: "Musca",
    Nor: "Norma", Oct: "Octans", Oph: "Ophiuchus", Ori: "Orion", Pav: "Pavo", Peg: "Pegasus", Per: "Perseus",
    Phe: "Phoenix", Pic: "Pictor", Psc: "Pisces", PsA: "Piscis Austrinus", Pup: "Puppis", Pyx: "Pyxis",
    Ret: "Reticulum", Sge: "Sagitta", Sgr: "Sagittarius", Sco: "Scorpius", Scl: "Sculptor", Sct: "Scutum",
    Ser: "Serpens", Sex: "Sextans", Tau: "Taurus", Tel: "Telescopium", Tri: "Triangulum", TrA: "Triangulum Australe",
    Tuc: "Tucana", UMa: "Ursa Major", UMi: "Ursa Minor", Vel: "Vela", Vir: "Virgo", Vol: "Volans", Vul: "Vulpecula"})

//
genitive = ({And: "Andromedae", Ant: "Antliae", Aps: "Apodis", Aqr: "Aquarii", Aql: "Aquilae", Ara: "Arae",
    Ari: "Arietis", Aur: "Aurigae", Boo: "Boötis", Cae: "Caeli", Cam: "Camelopardalis", Cnc: "Cancri",
    CVn: "Canum Venaticorum", CMa: "Canis Majoris", CMi: "Canis Minoris", Cap: "Capricorni", Car: "Carinae",
    Cas: "Cassiopeiae", Cen: "Centauri", Cep: "Cephei", Cet: "Ceti", Cha: "Chamaeleontis", Cir: "Circini",
    Col: "Columbae", Com: "Comae Berenices", CrA: "Coronae Australis", CrB: "Coronae Borealis", Crv: "Corvi",
    Crt: "Crateris", Cru: "Crucis", Cyg: "Cygni", Del: "Delphini", Dor: "Doradus", Dra: "Draconis", Equ: "Equulei",
    Eri: "Eridani", For: "Fornacis", Gem: "Geminorum", Gru: "Gruis", Her: "Herculis", Hor: "Horologii", Hya: "Hydrae",
    Hyi: "Hydri", Ind: "Indi", Lac: "Lacertae", Leo: "Leonis", LMi: "Leonis Minoris", Lep: "Leporis", Lib: "Librae",
    Lup: "Lupi", Lyn: "Lyncis", Lyr: "Lyrae", Men: "Mensae", Mic: "Microscopii", Mon: "Monocerotis", Mus: "Muscae",
    Nor: "Normae", Oct: "Octantis", Oph: "Ophiuchi", Ori: "Orionis", Pav: "Pavonis", Peg: "Pegasi", Per: "Persei",
    Phe: "Phoenicis", Pic: "Pictoris", Psc: "Piscium", PsA: "Piscis Austrini", Pup: "Puppis", Pyx: "Pyxidis",
    Ret: "Reticuli", Sge: "Sagittae", Sgr: "Sagittarii", Sco: "Scorpii", Scl: "Sculptoris", Sct: "Scuti", Ser: "Serpentis",
    Sex: "Sextantis", Tau: "Tauri", Tel: "Telescopii", Tri: "Trianguli", TrA: "Trianguli Australis", Tuc: "Tucanae",
    UMa: "Ursae Majoris", UMi: "Ursae Minoris", Vel: "Velorum", Vir: "Virginis", Vol: "Volantis", Vul: "Vulpeculae"})

// xAxis = ƒ(g)
xAxis = g => g
  .call(g => g.append("g")
      .attr("stroke", "currentColor")
    .selectAll("line")
    .data(d3.range(0, 1440, 5)) // every 5 minutes
    .join("line")
      .datum(d => [
        projection([d / 4, 0]),
        projection([d / 4, d % 60 ? -1 : -2])
      ])
      .attr("x1", ([[x1]]) => x1)
      .attr("x2", ([, [x2]]) => x2)
      .attr("y1", ([[, y1]]) => y1)
      .attr("y2", ([, [, y2]]) => y2))
  .call(g => g.append("g")
    .selectAll("text")
    .data(d3.range(0, 1440, 60)) // every hour
    .join("text")
      .attr("dy", "0.35em")
      .text(d => `${d / 60}h`)
      .attr("font-size", d => d % 360 ? null : 14)
      .attr("font-weight", d => d % 360 ? null : "bold")
      .datum(d => projection([d / 4, -4]))
      .attr("x", ([x]) => x)
      .attr("y", ([, y]) => y))

// yAxis = ƒ(g)
yAxis = g => g
  .call(g => g.append("g")
    .selectAll("text")
    .data(d3.range(10, 91, 10)) // every 10°
    .join("text")
      .attr("dy", "0.35em")
      .text(d => `${d}°`)
      .datum(d => projection([0, d]))
      .attr("x", ([x]) => x)
      .attr("y", ([, y]) => y))

// 
// voronoi = Ia {
//     delaunay: Xa {_delaunator: Sa, inedges: Int32Array(1628), _hullIndex: Int32Array(1628), points: Float64Array(3256), halfedges: Int32Array(9690), hull: Uint32Array(8), triangles: Uint32Array(9690)}
//     _circumcenters: Float64Array(6512) [63.43380184677807, 540.1115471714438, 77.8351300896241, 534.6628428196683, 55.954965930188095, 538.9035207826653, 73.4841064478202, 500.94009005617784, 46.00525881242092, 527.3011884678822, 85.81764086123142, 501.49863758335204, 57.562262493006436, 507.8065307317031, 92.95215788636217, 505.1032001703659, 75.9472650005771, 486.9183684376875, 87.07429125097711, 483.08349521218537, …]
//     vectors: Float64Array(6512) [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, …]
//     xmax: 982
//     xmin: 0
//     ymax: 982
//     ymin: 0
//     circumcenters: Float64Array(6460) [63.43380184677807, 540.1115471714438, 77.8351300896241, 534.6628428196683, 55.954965930188095, 538.9035207826653, 73.4841064478202, 500.94009005617784, 46.00525881242092, 527.3011884678822, 85.81764086123142, 501.49863758335204, 57.562262493006436, 507.8065307317031, 92.95215788636217, 505.1032001703659, 75.9472650005771, 486.9183684376875, 87.07429125097711, 483.08349521218537, …]
//     <prototype>: Ia {}
//   }

voronoi = d3.Delaunay.from(data.map(projection)).voronoi([0, 0, width, height])

// radius = ƒ(n)
radius = d3.scaleLinear([6, -1], [0, 8])

// path = ƒ(t)
path = d3.geoPath(projection)

// projection = ƒ(t)
projection = d3.geoStereographic()
    .reflectY(true)
    .scale(scale)
    .clipExtent([[0, 0], [width, height]])
    .rotate([0, -90])
    .translate([width / 2, height / 2])
    .precision(0.1)

// 
// outline = Object {
//     type: "Polygon"
//     coordinates: Array(1) [
//     0: Array(61) [
//     0: Array(2) [-3.4402247725420455e-15, -2.8203096947590293e-15]
//     1: Array(2) [-6.000000000000025, -4.6274464979070135e-16]
//     2: Array(2) [-11.999999999999984, -5.716272934102268e-17]
//     3: Array(2) [-17.999999999999968, 1.6788794507018887e-15]
//     4: Array(2) [-23.99999999999996, -1.778065060875157e-15]
//     5: Array(2) [-29.999999999999932, -1.2841469271171324e-15]
//     6: Array(2) [-35.99999999999991, -7.761594109005909e-16]
//     7: Array(2) [-41.9999999999999, -2.596681297564234e-16]
//     8: Array(2) [-47.99999999999988, 2.5966812975640437e-16]
//     9: Array(2) [-53.99999999999987, 7.761594109005722e-16]
//     10: Array(2) [-59.999999999999844, 1.2841469271171137e-15]
//     11: Array(2) [-65.99999999999983, 1.77806506087514e-15]
//     12: Array(2) [-71.99999999999982, 2.252502341742184e-15]
//     13: Array(2) [-77.99999999999979, 2.702260735586682e-15]
//     14: Array(2) [-83.99999999999977, 3.1224125953276787e-15]
//     15: Array(2) [-89.99999999999976, 3.5083546492674234e-15]
//     16: Array(2) [-95.99999999999976, 3.855858435499385e-15]
//     17: Array(2) [-101.99999999999973, 4.161116629821763e-15]
//     18: Array(2) [-107.99999999999972, 4.4207847595781795e-15]
//     19: Array(2) [-113.9999999999997, 4.6320178463999736e-15]
//     20: Array(2) [-119.99999999999969, 4.7925015763845576e-15]
//     21: Array(2) [-125.99999999999964, 4.900477656202844e-15]
//     22: Array(2) [-131.99999999999966, 4.954763077328894e-15]
//     23: Array(2) [-137.99999999999963, 4.954763077328897e-15]
//     24: Array(2) [-143.99999999999963, 4.9004776562028535e-15]
//     25: Array(2) [-149.99999999999957, 4.792501576384574e-15]
//     26: Array(2) [-155.99999999999957, 4.632017846399996e-15]
//     27: Array(2) [-161.99999999999957, 8.352166552022398e-15]
//     28: Array(2) [-167.99999999999952, 6.8062146360675826e-15]
//     29: Array(2) [-173.99999999999955, 6.515526381036606e-15]
//     30: Array(2) [-180, 3.533051969178137e-15]
//     31: Array(2) [174.0000000000005, 6.51552638103612e-15]
//     32: Array(2) [168.00000000000054, 6.806214636067313e-15]
//     33: Array(2) [162.00000000000057, 8.352166552022153e-15]
//     34: Array(2) [156.00000000000057, 4.632017846399965e-15]
//     35: Array(2) [150.0000000000006, 4.792501576384552e-15]
//     36: Array(2) [144.0000000000006, 4.900477656202839e-15]
//     37: Array(2) [138.0000000000006, 4.954763077328893e-15]
//     38: Array(2) [132.0000000000006, 4.9547630773288976e-15]
//     39: Array(2) [126.00000000000058, 4.900477656202856e-15]
//     40: Array(2) [120.00000000000058, 4.792501576384577e-15]
//     41: Array(2) [114.00000000000057, 4.6320178464e-15]
//     42: Array(2) [108.00000000000057, 4.4207847595782126e-15]
//     43: Array(2) [102.00000000000055, 4.161116629821803e-15]
//     44: Array(2) [96.00000000000054, 3.8558584354994284e-15]
//     45: Array(2) [90.00000000000054, 3.5083546492674707e-15]
//     46: Array(2) [84.00000000000053, 3.1224125953277292e-15]
//     47: Array(2) [78.00000000000051, 2.7022607355867343e-15]
//     48: Array(2) [72.00000000000051, 2.2525023417422378e-15]
//     49: Array(2) [66.0000000000005, 1.7780650608751937e-15]
//     50: Array(2) [60.00000000000049, 1.2841469271171673e-15]
//     51: Array(2) [54.00000000000048, 7.761594109006244e-16]
//     52: Array(2) [48.000000000000476, 2.596681297564552e-16]
//     53: Array(2) [42.00000000000047, -2.5966812975637434e-16]
//     54: Array(2) [36.000000000000455, -7.761594109005447e-16]
//     55: Array(2) [30.000000000000455, -1.284146927117089e-15]
//     56: Array(2) [24.00000000000046, -1.7780650608751175e-15]
//     57: Array(2) [18.000000000000462, 1.6788794507020315e-15]
//     58: Array(2) [12.00000000000044, -5.71627293408899e-17]
//     59: Array(2) [6.000000000000457, -4.627446497904811e-16]
//     60: Array(2) [3.508255741387069e-15, -3.482010806322365e-15]
//   ]
//   ]
//   }
outline = d3.geoCircle().radius(90).center([0, 90])()

// 
graticule = d3.geoGraticule().stepMinor([15, 10])()

//
data = (d3.csvParse(await FileAttachment("stars.csv").text(), d => {
    d3.autoType(d);
    d[0] = (d.RA_hour + d.RA_min / 60 + d.RA_sec / 3600) * 15; // longitude
    d[1] = d.dec_deg + d.dec_min / 60 + d.dec_sec / 3600; // latitude
    return d;
  })).sort((a, b) => d3.ascending(a.magnitude, b.magnitude))

//
scale = (width - 120) * 0.5

//
width = 954 + 28

//
height = width

//
d3 = require("d3@6")