// run with node
// take in a json file of slides/images metadata
// convert slides to new form
// spit out result to stdout


var fs = require("fs");
let filename = process.argv[2] || "slides.json"
var slides = JSON.parse(fs.readFileSync(filename));
res = []
for (x in slides){
  slide = slides[x]
  delete slide['_id']
  slide.location = slide['file-location'] || slide.filename
  slide.name = slide.case_id
  slide.mpp = slide['mpp-x'] || slide['mpp-y'] || slide.mpp
  res.push(slide)
}

console.log(JSON.stringify(res))
