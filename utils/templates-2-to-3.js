// run with node
// take in a json file of templates
// convert templates to new form
// spit out result to stdout


var fs = require("fs");
let filename = process.argv[2] || "templates.json"
var templates = JSON.parse(fs.readFileSync(filename));
res = []
for (x in templates){
  template = templates[x]
  new_t = {}
  new_t.type = "object"
  new_t.id = "migrated-" + x
  new_t.name = "migrated-" + x
  new_t.links = []
  new_t.additionalProperties = false
  props = {}
  for (y in Object.keys(template)){
    yi = parseInt(y,10)+1
    k = Object.keys(template)[y]
    props['arg'+yi] = {id:yi, title: template[k].title, type:template[k].type}
    if ('enum' in template[k]){
      props['arg'+yi].enum = template[k].enum
    }
  }
  new_t.properties = props
  res.push(new_t)
}

console.log(JSON.stringify(res))
