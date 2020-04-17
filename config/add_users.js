// For use with caracal, this is really just a demo.

let admin = {'email':'viewer@camicroscope.org', 'userFilter':["Public"], 'userType':'Null'}
// users not added would have been represented by the below
let randomPerson = {'email':'randomperson@camicroscope.org', 'userFilter':["Public"], 'userType':'Null'}
users = [admin, randomPerson]
db.user.insertMany(users)
