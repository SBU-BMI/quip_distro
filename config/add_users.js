// For use with caracal.

let admin = {'email':'viewer@camicroscope.org', 'userFilter':["Public"], 'userType':'Admin'}
// users not added would have been represented by the below
let randomPerson = {'email':'randomperson@camicroscope.org', 'userFilter':["Public"], 'userType':'Null'}
users = [admin, randomPerson]

// uncomment the below to *actually* add these dummy users
//     (or, replace with your own users, this script will run on each startup)

//db.user.insertMany(users)
