let defaultTemplate = {
    "_id": "0",
    "type": "object",
    "id": "annotation-form",
    "name": "AnnotSchema",
    "description": "",
    "links": [],
    "additionalProperties": false,
    "properties": {
        "name": {
            "id": "a0",
            "title": "Identity Name",
            "type": "string",
            "required": true,
            "description": "note name"
            },"notes": {
            "id": "a1",
            "title": "Notes: ",
            "type": "string",
            "format":"textarea",
            "maxLength": 128
        }
    }
}

db.template.insert(defaultTemplate)
