// admin users
let admins = [{"name":"admin@camicroscope.org", "attrs": ['admin', 'write']}]
// edit users
let editors = [{"name":"editor@camicroscope.org", "attrs": ['write']}]
// normal users
let viewers = [{"name":"someone@camicroscope.org", "attrs": []}]
// prep for mongo

db.authorization.insertMany(admins)
db.authorization.insertMany(editors)
db.authorization.insertMany(viewers)
