// non-pathdb uuid fix attempt script
// run this script and it /should/ convert slide triple/case_id formats to the mongo object uuid slide references

db.slide.find({}).forEach(function(slide){
  db.mark.find({'provenance.image.slide':slide.name, 'provenance.image.study':slide.study, 'provenance.image.specimen':slide.specimen}).forEach(function(mark){
    delete mark.provenance.image.study
    delete mark.provenance.image.specimen
    mark.provenance.image.slide = slide._id.valueOf()
    db.mark.save(mark)
  })
  db.heatmap.find({'provenance.image.slide':slide.name, 'provenance.image.study':slide.study, 'provenance.image.specimen':slide.specimen}).forEach(function(hm){
    delete hm.provenance.image.study
    delete hm.provenance.image.specimen
    mark.provenance.image.slide = slide._id.valueOf()
    db.heatmap.save(hm)
  })
  db.heatmap.find({'provenance.image.case_id':slide.name}).forEach(function(hm){
    delete hm.provenance.image.case_id
    hm.slide = slide._id.valueOf()
    db.heatmap.save(hm)
  })
})
