// run with node
// take in a json file of annotations
// convert annots to new form
// spit out result to stdout


var fs = require("fs");
let filename = process.argv[2] || "annots.json"
var annots = JSON.parse(fs.readFileSync(filename));
names = new Set()
res = {}
var available_colors = ['#a6cee3', '#1f78b4', '#b2df8a', '#33a02c', '#fb9a99', '#e31a1c', '#fdbf6f', '#ff7f00', '#cab2d6', '#6a3d9a', '#ffff99', '#b15928'];
for (x in annots){
  annot = annots[x]
  name = annot.provenance.analysis.execution_id
  names.add(name)
  // pick a color, default style
  color = available_colors[x%available_colors.length]
  annot.provenance.image.slide = annot.provenance.image.case_id
  annot.properties = {annotations:{name:  annot.provenance.analysis.execution_id}}
  annot.provenance.analysis.execution_id = "_a" + x
  props = {footprint: annot.footprint, style: {color:color, "lineJoin": "round", "lineCap": "round", lineWidth:"30"}}
  if (name in res){
    // recalculate bounds
    s = annot.geometry.coordinates[0].concat(res[name].geometries.features[0].bound)
    xs = s.map(x=>x[0])
    ys =  s.map(x=>x[1])
    // get bounds
    x0 = Math.min.apply(null, xs)
    x1 = Math.max.apply(null, xs)
    y0 = Math.min.apply(null, ys)
    y1 = Math.max.apply(null, ys)
    res[name].geometries.features[0].bound = {type:"Polygon", coordinates: coords}
    // add polygon
    props.style.color = res[name].geometries.features[0].properties.style.color
    res[name].geometries.features.push({type:"Feature", properties:props, geometry: annot.geometry})
  } else {
    // convert geometry
    props.style.color = available_colors[x%available_colors.length]
    annot.geometries = {type:"FeatureCollection", features:[{type:"Feature", properties:props, geometry: annot.geometry}]}
    s = annot.geometry.coordinates[0]
    xs = s.map(x=>x[0])
    ys =  s.map(x=>x[1])
    // get bounds
    x0 = Math.min.apply(null, xs)
    x1 = Math.max.apply(null, xs)
    y0 = Math.min.apply(null, ys)
    y1 = Math.max.apply(null, ys)
    coords = [[[x0,y0], [x0,y1], [x1,y1], [x1,y0], [x0,y0]]]
    annot.geometries.features[0].bound = {type:"Polygon", coordinates: coords}
    // remove old geometry
    delete annot['geometry']
    delete annot['_id']
    res[name] = annot
  }
}
var values = Object.keys(res).map(function(key){
    return res[key];
});
console.log(JSON.stringify(values))
