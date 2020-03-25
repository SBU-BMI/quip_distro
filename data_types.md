# caMicroscope Data Types
A description of data types for use with caMicroscope

## Files

### Slides
All slides should be openslide compatible, but not all formats seem to work consistently. SVS and TIF file extensions seem to work most reliably.

### TFJS Models and Weights
The prediction and segmentation applications can use a suitable tensorflow.js formatted model and weights to operate. [This guide](https://www.tensorflow.org/js/guide/save_load) may be useful for the generation of these files.

### Data Associated with Mongo
Segmentations, Heatmaps, annotations, and Templates are all primarily mongo documents, and are described in the next section. Use mongoexport or mongoimport in a `docker exec -it ca-mongo` context.

## Mongo Data and Metadata

### Slide Metadata
Slides are identified by their uuid, which is automatically generated. Slides have a display name `name`, a file location in context `location`, a measurement scale conversion factor in micrometers per pixel `mpp`, and `study` and `specimen` fields.

### Marks/Annotations
Marks are extended [geoJson](https://geojson.org/) formatted items with [viewport coordinates](https://openseadragon.github.io/examples/viewport-coordinates/). The geojson component is contained within `geometries`. `provenance` describes the source `provenance.analysis.source` and associated slide uuid `provenance.image.slide` of the mark, as well as the mark's execution id `provenance.analysis.execution_id`, and the mark's display name `provenance.analysis.name`. `properties` has any filled out information associated with an active template.

### Heatmaps
Heatmaps are data on a grid. `data` is a list of grid elements, in the format `[x position, y position, variable 1 value, *any additional values, if any*]`. The associated fields are stored `provenance.analysis.fields` in a list of items of format `{"name":"FIELDNAME", "range":[min,max]}`. The x and y positions are translated according to `provenance.analysis.coordinateSystem`. The associated slide, as with marks, is `provenance.image.slide`. The heatmap relative id is `provenance.image.execution_id`.

## Sample Data

### Mongo Data
See https://github.com/camicroscope/Distro/blob/master/config/test_seed.js
