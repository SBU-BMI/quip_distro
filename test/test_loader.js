// test the core loader function we can here, the info get.

// get info for the sample image, compare it to known info

const assert = require('assert');
const fetch = require("node-fetch")


const checkurl = "http://localhost:4010/load/Slide/info/sample.svs"


describe('Sample Slide Metadata Check', function () {
  // can we see it in find
  it('Gets correct metadata', function (done) {
    this.timeout(10000) // there's a case for speeding up the metadata extraction...
    let getProcess = fetch(checkurl)
    getProcess.then(x=>x.json()).then(x=>{
      console.log(x['mpp-x'])
      assert.equal(x['mpp-x'],"0.499", "Slide metadata matches known result")
      done()
    }).catch(e=>{
      console.log("err")
      console.log(e)
      done(e)
    })

  });
})
