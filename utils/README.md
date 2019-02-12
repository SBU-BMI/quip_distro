# Migrating Data from QUIP 2.0 to QUIP 3.0

## Annotations

Since the annotation type has changed to allow for more dynamic options, the annotation type has undergone some changes.
Run the tool with `node annots-to-to-3.js annots.json > out.json`, where annots.json is a list of QUIP 2.0 style annotations (see debug-annot.json for a short example).
Use the result with `mongoimport --db camic --collection mark --file out.json --jsonArray` in the ca-mongo container.

**Please note that this should be run on a single image's annotations at a time, otherwise it will combine them incorrectly.**


## Slides

Most slide data is preserved, we've just added some fields to make things simpler for viewer interactions, and made 'name' the canonical form of the slide, replacing the often improperly used 'case_id'.
Run the tool with `node slides-to-to-3.js slides.json > out.json`, where slides.json is a list of QUIP 2.0 style slides (see debug-slide.json for a short example).
Use the result with `mongoimport --db camic --collection slide --file out.json --jsonArray` in the ca-mongo container.

## Templates

The template format is entirely different as a result of a switch from js-form to pure-form.
Run the tool with `node templates-to-to-3.js templates.json > out.json`, where templates.json is a list of QUIP 2.0 style templates (see debug-template.json for a short example).
Use the result with `mongoimport --db camic --collection template --file out.json --jsonArray` in the ca-mongo container.
