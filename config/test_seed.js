var slides = [{
    "_id": new ObjectId("5bec456369056d7e537c2a9b"),
    name: "CMU1",
    location: "/images/sample.svs",
    mpp: 0.499,
    study: '',
    specimen: ''
}]

var marks = [
    {
        "provenance": {
            "image": {
                "slide": "CMU1", 
                "specimen": "", 
                "study": ""
            }, 
            "analysis": {
                "source": "human", 
                "execution_id": "Gamma", 
                "name": "test 1"
            }
        }, 
        "properties": {
            "annotations": {
                "name": "test 1", 
                "digital_slide_quality": true, 
                "histology": "PDAC", 
                "hist_other_type": "Colloid carcinoma (mucinous noncystic carcinoma)", 
                "cellularity_10": "31-40%", 
                "tumor_cellularity": "<20%", 
                "tumor_necrosis": "<20%", 
                "adequacy": "Adequate", 
                "normal_tissue_type": "Duodenum", 
                "tumor_present": false, 
                "additional_notes": "test note"
            }
        }, 
        "geometries": {
            "type": "FeatureCollection", 
            "features": [
                {
                    "type": "Feature", 
                    "properties": {
                        "style": {
                            "color": "#7cfc00", 
                            "lineCap": "round", 
                            "lineJoin": "round", 
                            "lineWidth": 3
                        }
                    }, 
                    "geometry": {
                        "type": "Polygon", 
                        "coordinates": [
                            [
                                [
                                    0, 
                                    1.333075238564
                                ], 
                                [
                                    0.9211833251318, 
                                    1.333075238564
                                ], 
                                [
                                    0.9211833251318, 
                                    1.4056976389659
                                ], 
                                [
                                    0.84856092473, 
                                    1.4056976389659
                                ], 
                                [
                                    0, 
                                    1.333075238564
                                ]
                            ]
                        ]
                    }, 
                    "bound": {
                        "type": "Polygon", 
                        "coordinates": [
                            [
                                [
                                    0.0819138121014, 
                                    1.2558071323124
                                ], 
                                [
                                    0.987611451067, 
                                    1.2558071323124
                                ], 
                                [
                                    0.987611451067, 
                                    1.9173119035902
                                ], 
                                [
                                    0.0819138121014, 
                                    1.9173119035902
                                ], 
                                [
                                    0.0819138121014, 
                                    1.2558071323124
                                ]
                            ]
                        ]
                    }
                }
            ]
        }
    }
];

heatmap_data = []
for (var i = 0; i<1; i+=0.007243258749282846){
  for (var j = 0; j<1; j+=0.010489147367327867){
    heatmap_data.push([i,j,Math.random(),Math.floor(Math.random()*10)])
  }
}


var heatmaps = [{
    "provenance": {
        "image": {
            "slide": "CMU1",
            "study": "",
            "specimen": "",
            "case_id":"CMU1",
            "subject_id":"CMU1"
        },
        "analysis": {
            "study_id":"test",
            "type": "heatmap",
            "computation": "heatmap",
            "execution_id": "heatmap_test",
            "size": [0.007243258749282846,0.010489147367327867],
            "fields": [{"name":"necrosis", "range":[0,1]}, {"name":"tumor", "range":[0,10]}],
            "coordinateSystem": "image"
        }
    },
    "data": heatmap_data
}]

const annotation_schema = {
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
        },
        "digital_slide_quality": {
            "id": "a1",
            "title": "Check if histology is able to be evaluated",
            "type": "boolean"
        },
        "histology": {
            "id": "a2",
            "title": "Histology: (For BL1 and BL2 only)",
            "type": "string",
            "enum": ["-", "PDAC", "PNET", "other"],
            "default": "-"
        },
        "hist_other_type": {
            "id": "a3",
            "title": "Other Histology: (For BL1 and BL2 only)",
            "type": "string",
            "enum": ["-", "N/A", "Colloid carcinoma (mucinous noncystic carcinoma)", "Signet-ring cell carcinoma", "Adenosquamous carcinoma", "Intraductal papillary-mucinous neoplasm with an associated invasive carcinoma", "Intraductal tubulopapillary neoplasm with an associated invasive carcinoma", "Mucinous cystic neoplasm with an associated invasive carcinoma", "Large cell neuroendocrine carcinoma", "Small cell neuroendocrine carcinoma", "Neuroendocrine carcinoma (poorly differentiated)", "Undifferentiated (anaplastic) carcinoma", "Undifferentiated carcinoma with osteoclast-like giant cells", "Acinar cell carcinoma", "Acinar cell cystadenocarcinoma", "Serous cystadenocarcinoma", "Mixed acinar-ductal carcinoma", "Mixed ductal-neuroendocrine carcinoma", "Mixed acinar-neuroendocrine carcinoma", "Mixed acinar-neuroendocrine-ductal carcinoma", "Solid-pseudopapillary neoplasm", "Hepatoid carcinoma", "Medullary carcinoma"],
            "default": "-"
        },
        "cellularity_10": {
            "id": "a4",
            "title": "Cellularity percentage",
            "type": "string",
            "enum": ["-", "0-10%", "11-20%", "21-30%", "31-40%", "41-50%", "51-60%", "61-70%", "71-80%", "81-90%", "91-100%"],
            "default": "-"
        },
        "tumor_cellularity": {
            "id": "a5",
            "title": "Tumor Cellularity: (For BL1 and BL2 only)",
            "type": "string",
            "enum": ["-", "<20% ", ">=20%"],
            "default": "-"
        },
        "tumor_necrosis": {
            "id": "a6",
            "title": "Tumor Necrosis: (For BL1 and BL2 only)",
            "type": "string",
            "enum": ["-", "<20% ", ">=20%"],
            "default": "-"
        },
        "adequacy": {
            "id": "a7",
            "title": "Adequacy: (For BL1 and BL2 only)",
            "type": "string",
            "enum": ["-", "Adequate", "Inadequate"],
            "default": "-"
        },
        "normal_tissue_type": {
            "id": "a8",
            "title": "Normal Tissue Type: (For BL3 only)",
            "type": "string",
            "enum": ["-", "Duodenum", "Lymph Node", "Spleen", "Other"],
            "default": "-"
        },
        "tumor_present": {
            "id": "a9",
            "title": "Check if tumor present (For BL3 only)",
            "type": "boolean"
        },
        "notes": {
            "id": "a10",
            "title": "Notes: ",
            "type": "string",
            "format":"textarea",
            "maxLength": 128
        }
    }
};

const algorithm_1_schema = {
    "type": "object",
    "id": "algorithm01",
    "name": "Alg1Schema",
    "description": "",
    "links": [],
    "additionalProperties": false,
    "properties": {
        "arg1": {
            "id": "01",
            "title": "Argument 01",
            "type": "boolean"
        },
        "arg2": {
            "id": "02",
            "title": "Argument 02",
            "type": "string",
            "enum": ["arg_01", "arg_02", "arg_03", "arg_04"],
            "default": "-"
        },
        "arg3": {
            "id": "03",
            "title": "Argument 03",
            "type": "textarea"
        }
    }
};
const algorithm_2_schema = {
    "type": "object",
    "id": "algorithm02",
    "name": "Alg1Schema",
    "description": "",
    "links": [],
    "additionalProperties": false,
    "properties": {
        "arg1": {
            "id": "01",
            "title": "Argument 01",
            "type": "boolean"
        },
        "arg2": {
            "id": "02",
            "title": "Argument 02",
            "type": "string",
            "enum": ["arg_01", "arg_02", "arg_03", "arg_04"],
            "default": "-"
        },
        "arg3": {
            "id": "03",
            "title": "Argument 03",
            "type": "boolean"
        },
        "arg4": {
            "id": "04",
            "title": "Argument 04",
            "type": "range"
        },
    }
};




var templates = [algorithm_2_schema, algorithm_1_schema, annotation_schema]
db.slide.insertMany(slides)
db.mark.insertMany(marks)
db.template.insertMany(templates)
//db.authorization.insertMany(auths)
db.heatmap.insertMany(heatmaps)
