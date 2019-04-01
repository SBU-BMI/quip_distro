const express = require('express')
const rp = require('request-promise');
const app = express();
const fs = require("fs");
var jwt = require('jsonwebtoken');
var jwkToPem = require('jwk-to-pem');
var PORT = process.env.PORT || 8010
var BASE_USER_URL = "http://ca-data:9099/services/caMicroscope/Authorization/query/getAuth?name="
var SECRET = process.env.SECRET
var EXPIRY = process.env.EXPIRY || "1h"

try {
  let prikey_path = "/keys/key"
  if(fs.existsSync(prikey_path)){
    var PRIKEY = fs.readFileSync(prikey_path, 'utf8')
  }
} catch (err){
  console.error(err)
}

try {
  let cert_path = "/keys/certificate"
  if(fs.existsSync(cert_path)){
    var SECRET = fs.readFileSync(cert_path, 'utf8')
  }
} catch (err){
  console.error(err)
}
// jwks
try {
  let jwk_path = "/keys/jwk.json"
  if(fs.existsSync(jwk_path)){
    var SECRET = jwkToPem(JSON.parse(fs.readFileSync(jwk_path, 'utf8')))
  }
} catch (err){
  console.error(err)
}

const getToken = function(req) {
    if (req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Bearer') { // Authorization: Bearer g1jipjgi1ifjioj
        // Handle token presented as a Bearer token in the Authorization header
        return req.headers.authorization.split(' ')[1];
    } else if (req.query && req.query.token) {
        // Handle token presented as URI param
        return req.query.token;
    } else if (req.cookies && req.cookies.token) {
        // Handle token presented as a cookie parameter
        return req.cookies.token;
    }
}

app.get("/check", async function(req,res){
  var token = jwt.verify(getToken(req), SECRET)
  if (!(token && (token.email || token.sub))){
    // jwt doesn't say who you are, so bye
    res.sendStatus(401)
  } else {
    var name = token.email || token.sub
    user_detail = rp({
      uri: BASE_USER_URL + name,
      json: true
    })
    user_detail.then(x=>{
      console.log(x)
      if (x.length >= 1 && x[0].hasOwnProperty('name')){
        let attrs = x[0].attrs || []
        data = {
          'name':x[0].name,
          'attrs':attrs
        }
        // sign using the mounted key
        var token = jwt.sign(data, PRIKEY, {algorithm:"RS256", expiresIn: EXPIRY})
        res.send({'token':token})
      } else {
        res.sendStatus(401)
      }
    })
    user_detail.catch(e=>{
      console.log(e)
      res.sendStatus(401)
    })
  }
})
// get route for check
// does the user exist?
// are there attr options? what are they? do we have them?

app.listen(PORT, () => console.log('listening on ' + PORT))
