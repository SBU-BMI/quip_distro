# 2.X -> 3.X Migration

## Summary
* The mongo database is camic instead of quip
* The heatmap format is vastly different
* Some slide fields have simpler names (e.g. study_id -> study)
* Templates use a different format entirely
* We do not have a separate collection for annotation metadata
* Authorization is handled differently

It's highly recommended to leave the original source documents alone until you've confirmed everything looks okay. Issues with these tools or conversions should be reported as github issues on the distribution repository.

## Templates
Since the new template method has different functionality, it's highly recommended that templates are re-made using (json-schema)[https://json-schema.org/]

## Heatmaps
Before migration, move heatmaps to a different collection, as to not confuse the object->mark conversion. Run the script with the input and output folders as arguments in node. Then, you should be able to import these converted documents to the camic database under the heatmap collection.

## Other Collections
The other collections use a single script which should run in mongo. This makes needed changes to the collections, and puts the results in the camic database. These utilities may behave strangely with non-standard or older form data.

## Authorization
Authorization is handled differently in the 3.0 version. See config/add_mongo_users.js for an example. Edit that file to add your original users. Name should match the subject of the jwt. This is not needed for deployments which rely on pathdb, or use another custom authorization service.
