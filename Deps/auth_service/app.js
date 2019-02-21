const express = require('express')
const rp = require('request-promise');
const app = express();
var jwt = require('jsonwebtoken');
var PORT = process.env.PORT || 8010
var BASE_USER_URL = "http://ca-data:9099/services/caMicroscope/Authorization/query/getAuth?name="

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
  var token = jwt.decode(getToken(req))
  if (!(token && (token.email || token.sub))){
    // jwt doesn't say who you are, so bye
    res.sendStatus(401)
  } else {
    var name = token.email || token.sub
    var attr = req.query.attr
    user_detail = rp({
      uri: BASE_USER_URL + name,
      json: true
    })
    user_detail.then(x=>{
      console.log(x)
      if (x.length >= 1){
        if (!attr || x[0].attrs.includes(attr)){
          res.sendStatus(200)
        } else {
          res.sendStatus(401)
        }
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
