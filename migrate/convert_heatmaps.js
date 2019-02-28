//convert.js
//
var readline = require('readline');
const fs = require('fs');
const inputFolder = process.argv[2] || './input';
const outputFolder = process.argv[3] || './output';

let remainder = 0;
fs.readdirSync(inputFolder).forEach(fileName => {
  //const filePath = `${fileName}`;
  convert(fileName);
});

let filename = process.argv[2] || "heatmap_TCGA-28-1751-01Z-00-DX1.low_res.json";

let tempObject;

function convert(filename) {
  // read file
  const myInterface = readline.createInterface({
    input: fs.createReadStream(`${inputFolder}/${filename}`)
  })
  let lineno = 0;
  let data = [];
  let size = {};

  let fields = [];
  let ranges = [0, 1];

  remainder++;
  myInterface.on('line', function(line) {

    const record = JSON.parse(line);
    if (lineno == 1) {
      tempObject = record;
    };

    if (record.properties.metric_value == 0) return;
    lineno++;
    data.push([
      record.bbox[0],
      record.bbox[1],
      ...record.properties.multiheat_param.metric_array
    ]);
  }).on('close', () => {
    const content = generateDoc(data);
    if (!fs.existsSync(outputFolder)) fs.mkdirSync(outputFolder);
    fs.writeFile(`${outputFolder}/NEW_${filename}`, content, function(err) {
      if (err) throw err;
      remainder--;
      console.log(`${filename} completed`);
      if (remainder == 0) console.log('finished');
      else console.log(`${remainder} Files remaining`);
      //
    });

  });
}

function generateDoc(data) {
  const [x, y, x1, y1] = tempObject.bbox;
  const width = x1 - x;
  const height = y1 - y;
  const fields = tempObject.properties.multiheat_param.heatname_array.map(d => {
    return {
      name: d,
      range: [0, 1]
    }
  });
  return `{
"provenance":{
  "image":{
     "subject_id":"${tempObject.provenance.image.subject_id}",
     "case_id":"${tempObject.provenance.image.case_id}",
     "slide": "${tempObject.provenance.image.subject_id}",
     "specimen": "",
     "study": ""

  },
  "analysis":{
     "study_id":"${tempObject.provenance.analysis.study_id}",
     "computation":"heatmap",
     "size": [${width},${height}],
     "fields":${JSON.stringify(fields)},
     "execution_id":"${tempObject.provenance.analysis.execution_id}",
     "source":"computer"
  }
},
"data":${JSON.stringify(data)}
}`;
}
