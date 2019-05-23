//convert.js
//
const readline = require('readline');
const path = require('path')
const fs = require('fs');
const inputFolder = process.argv[2] || './input';
const outputFolder = process.argv[3] || './output';

const fileTemps = {};

let remainder = 0;
fs.readdirSync(inputFolder).forEach(fileName => {
  const ext = path.extname(`${inputFolder}/${fileName}`);
  if(ext!=='.json') return;
  fileTemps[fileName] = null;
  convert(fileName)
});

function convert(filename){

  let lineno = 0;
  let data = [];
  let size = {};

  let fields = [];
  let ranges = [0,1];  
  // read file
  const myInterface = readline.createInterface({
    input: fs.createReadStream(`${inputFolder}/${filename}`)
  });

  remainder++;
  myInterface.on('line', function (line) {
    const record = JSON.parse(line);
    if(record.properties.metric_value == 0)return;
    ++lineno;
    if(lineno==1) {
    	fileTemps[filename] = record;
    };

    data.push([
    	record.bbox[0],
    	record.bbox[1],
    	...record.properties.multiheat_param.metric_array]);
  }).on('close',()=>{
  	const content = generateDoc(data,filename);
    if(!fs.existsSync(outputFolder)) fs.mkdirSync(outputFolder);
  	fs.writeFile(`${outputFolder}/NEW_${filename}`, content, function(err) {
      	console.log('close');
        if (err) throw err;
        remainder--;
        console.log(`${filename} completed`);
        if(remainder == 0) console.log('finished');
        else console.log(`${remainder} Files remaining`);
      });
  });
}

function generateDoc(data,filename){
  	const [x,y,x1,y1] = fileTemps[filename].bbox;
  	const width = x1 - x;
  	const height = y1 - y;
  	const fields = fileTemps[filename].properties.multiheat_param.heatname_array.map(d =>{
      return{
        name:d,
        range:[0,1],
        value:[0.1,1]
      }});
return `{
"provenance":{  
  "image":{  
     "subject_id":"${fileTemps[filename].provenance.image.subject_id}",
     "case_id":"${fileTemps[filename].provenance.image.case_id}",
     "slide": "${fileTemps[filename].provenance.image.subject_id}", 
     "specimen": "", 
     "study": ""

  },
  "analysis":{  
     "study_id":"${fileTemps[filename].provenance.analysis.study_id}",
     "computation":"heatmap",
     "size": [${width},${height}],
     "fields":${JSON.stringify(fields)},
     "execution_id":"${fileTemps[filename].provenance.analysis.execution_id}",
     "source":"computer"
  }
},
"data":${JSON.stringify(data)}
}`;
}
