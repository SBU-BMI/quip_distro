// run this against the quip (or otherwise source) database.
var dest_db = "camic"

// slide update metadata structure and copy over
db.images.find().forEach(function(x){
  //MOVE case_id to name
  x['name'] = x['case_id']
  delete (x['case_id'])
  //COPY mpp-x and -y to _x _y
  x['mpp_x'] = x['mpp-x']
  x['mpp_y'] = x['mpp-y']
  //MOVE study_id to study, else study as empty string
  x['study'] = x['study'] || x['study_id'] || ""
  delete (x['study_id'])
  //move specimen_id to specimen, else specimen as empty string
  x['specimen'] = x['specimen'] || x['specimen_id'] || ""
  delete (x['specimen_id'])
  db.getSiblingDB(dest_db)['slide'].insert(x);
});

// mark, update metadata structure and copy over
db.objects.find().forEach(function(x){
  // slidename and slide are old case_id
  x['provenance']['image']['slide'] = x['provenance']['image']['case_id']
  x['provenance']['image']['slidename'] = x['provenance']['image']['case_id']
  delete (x['provenance']['image']['case_id'])
  // specimen and study same conversion as in slide
  x['provenance']['image']['study'] = x['provenance']['image']['study'] || x['provenance']['analysis']['study_id'] || ""
  x['provenance']['image']['specimen'] = x['provenance']['image']['specimen'] || x['provenance']['analysis']['specimen_id'] || ""
  delete (x['provenance']['analysis']['specimen_id']);
  delete (x['provenance']['analysis']['study_id']);
  db.getSiblingDB(dest_db)['mark'].insert(x);
});
