db.heatmap.find({"provenance.image.case_id":{ $exists: true}}).forEach(function(x){
  x.provenance.image.slide = x.provenance.image.case_id
  delete x.provenance.image.case_id
  x.provenance.image.study = x.provenance.image.study || ""
  delete x.provenance.image.subject_id
  db.heatmap.save(x)
})

db.heatmapEdit.find({"provenance.image.case_id":{ $exists: true}}).forEach(function(x){
  x.provenance.image.slide = x.provenance.image.case_id
  delete x.provenance.image.case_id
  x.provenance.image.study = x.provenance.image.study || ""
  delete x.provenance.image.subject_id
  db.heatmapEdit.save(x)
})
