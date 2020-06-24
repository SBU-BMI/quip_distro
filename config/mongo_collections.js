// update to 3.6 commands
db.adminCommand( { setFeatureCompatibilityVersion: "3.6" } )
// create collections with jsonSchema Validation
db.createCollection("slide", {
    validator: {
        $jsonSchema: {
            bsonType: 'object',
            required: ['name', 'location'],
            properties: {
                name: {
                    bsonType: 'string',
                    description: 'Slide display name',
                },
                location: {
                    bsonType: 'string',
                    description: 'Slide location, used for opening',
                },
            },
        }
    }
})

db.createCollection("mark", {
    validator: {
        $jsonSchema: {
            bsonType: 'object',
            required: ['provenance'],
            properties: {
                provenance: {
                    bsonType: 'object',
                    required: ['image', 'analysis'],
                    properties: {
                        image: {
                            bsonType: 'object',
                            required: ['slide'],
                        },
                        analysis: {
                            bsonType: 'object',
                            required: ['execution_id'],
                        },
                    },
                },
            },
        }
    }
})

db.createCollection("heatmap", {
    validator: {
        $jsonSchema: {
            bsonType: 'object',
            required: ['provenance'],
            properties: {
                provenance: {
                    bsonType: 'object',
                    required: ['image', 'analysis'],
                    properties: {
                        image: {
                            bsonType: 'object',
                            required: ['slide'],
                        },
                        analysis: {
                            bsonType: 'object',
                            required: ['execution_id'],
                        },
                    },
                },
            },
        }
    }
})

db.createCollection("heatmapedit", {
    validator: {
        $jsonSchema: {
            bsonType: 'object',
            required: ['user_id', 'provenance'],
            properties: {
                provenance: {
                    bsonType: 'object',
                    required: ['image', 'analysis'],
                    properties: {
                        image: {
                            bsonType: 'object',
                            required: ['slide'],
                        },
                        analysis: {
                            bsonType: 'object',
                            required: ['fields', 'execution_id'],
                        },
                    },
                },
            },
        }
    }
})

db.createCollection("template", {
    validator: {
        $jsonSchema: {
            bsonType: 'object',
            required: ['id', 'name', 'properties'],
            properties: {
                id: {
                    bsonType: 'string',
                    description: 'template identifier',
                },
                name: {
                    bsonType: 'string',
                    description: 'template display name',
                },
                properties: {
                    bsonType: 'object',
                    description: 'pure-form questions object',
                    additionalProperties: {
                        bsonType: 'object',
                        required: ['title', 'type'],
                    },
                },
            },
        }
    }
})
