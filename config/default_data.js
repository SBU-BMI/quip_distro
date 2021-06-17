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
		}, "notes": {
			"id": "a1",
			"title": "Notes: ",
			"type": "string",
			"format": "textarea",
			"maxLength": 128
		}
	}
}

db.template.insert(defaultTemplate)

var defaultConfigs = [{
	"configuration": [
		{
			"id": "001",
			"color": "#ff6296",
			"mode": "grid",
			"type": "Lymph-Positive",
			"size": 100
		},
		{
			"id": "002",
			"color": "#ff6296",
			"mode": "point",
			"type": "Lymph-Positive"
		},
		{
			"id": "003",
			"color": "#62ffcb",
			"mode": "grid",
			"type": "Lymph-Negative",
			"size": 100
		},
		{
			"id": "004",
			"color": "#62ffcb",
			"mode": "point",
			"type": "Lymph-Negative"
		},
		{
			"id": "005",
			"color": "#ffcb62",
			"mode": "grid",
			"type": "Neutrophil-Positive",
			"size": 50
		},
		{
			"color": "#6296ff",
			"mode": "grid",
			"type": "Neutrophil-Negative",
			"size": 50,
			"id": "006"
		},
		{
			"color": "#ff00d9",
			"mode": "grid",
			"type": "Necrosis-Positive",
			"size": 100,
			"id": "007"
		},
		{
			"color": "#ff00d9",
			"mode": "grid",
			"type": "Necrosis-Positive",
			"size": 500,
			"id": "008"
		},
		{
			"color": "#00ff26",
			"mode": "grid",
			"type": "Necrosis-Negative",
			"size": 100,
			"id": "009"
		},
		{
			"color": "#00ff26",
			"mode": "grid",
			"type": "Necrosis-Negative",
			"size": 500,
			"id": "010"

		},
		{
			"color": "#790cff",
			"mode": "grid",
			"type": "Tumor-Positive",
			"size": 100,
			"id": "011"
		},
		{
			"color": "#790cff",
			"mode": "grid",
			"type": "Tumor-Positive",
			"size": 300,
			"id": "012"
		},
		{
			"color": "#790cff",
			"mode": "grid",
			"type": "Tumor-Positive",
			"size": 1000,
			"id": "013"
		},
		{
			"color": "#790cff",
			"mode": "grid",
			"type": "Tumor-Positive",
			"size": 2000,
			"id": "014"
		},
		{
			"color": "#92ff0c",
			"mode": "grid",
			"type": "Tumor-Negative",
			"size": 100,
			"id": "015"
		},
		{
			"color": "#92ff0c",
			"mode": "grid",
			"type": "Tumor-Negative",
			"size": 300,
			"id": "016"
		},
		{
			"color": "#92ff0c",
			"mode": "grid",
			"type": "Tumor-Negative",
			"size": 1000,
			"id": "017"
		},
		{
			"color": "#92ff0c",
			"mode": "grid",
			"type": "Tumor-Negative",
			"size": 2000,
			"id": "018"
		}, {
			"color": "#8dd3c7",
			"mode": "free",
			"type": "Prostate-Benign",
			"id": "019"
		}, {
			"color": "#ffffb3",
			"mode": "free",
			"type": "Prostate-Gleason3",
			"id": "020"
		}, {
			"color": "#bebada",
			"mode": "free",
			"type": "Prostate-Gleason4",
			"id": "021"
		}, {
			"color": "#fb8072",
			"mode": "free",
			"type": "Prostate-Gleason5",
			"id": "022"
		}, {
			"color": "#80b1d3",
			"mode": "free",
			"type": "Prostate-CancerNOS",
			"id": "023"
		}, {
			"color": "#fdb462",
			"mode": "free",
			"type": "NSCLC-Benign",
			"id": "024"
		}, {
			"color": "#b3de69",
			"mode": "free",
			"type": "NSCLC-SquamousCA",
			"id": "025"
		}, {
			"color": "#fccde5",
			"mode": "free",
			"type": "NSCLC-AdenoCA(all)",
			"id": "026"
		}, {
			"color": "#d9d9d9",
			"mode": "free",
			"type": "NSCLC-Acinar",
			"id": "027"
		}, {
			"color": "#bc80bd",
			"mode": "free",
			"type": "NSCLC-Lapidic",
			"id": "028"
		}, {
			"color": "#ccebc5",
			"mode": "free",
			"type": "NSCLC-Solid",
			"id": "029"
		}, {
			"color": "#ffed6f",
			"mode": "free",
			"type": "NSCLC-Papillary",
			"id": "030"
		}, {
			"color": "#6a3d9a",
			"mode": "free",
			"type": "NSCLC-Micropapillary",
			"id": "031"
		}
	],
	"config_name": "preset_label",
	"version": "1.0.0"
}];


db.configuration.insertMany(defaultConfigs)

var defaultLinks = {
	"configuration": [
		{
			"displayName": "Bug Report",
			"url": "https://goo.gl/forms/mgyhx4ADH0UuEQJ53",
			"icon": "bug_report",
			"openInNewTab": true
		}
	],
	"config_name": "additional_links",
	"version": "1.0.0"
}
db.configuration.insert(defaultLinks)

var evaluation_form = {
	"config_name": "evaluation_form",
	"enable": true,
	"configuration": {
		"schema": {
			"type": "object",
			"properties": {
				"slide_quality": {
					"type": "string",
					"title": "Slide Quality",
					"enum": ["satisfactory", "unsatisfactory"],
					"default": "satisfactory",
					"required": true,
				},
				"tumor_presence": {
					"type": "string",
					"title": "Tumor Presence",
					"enum": ["presence", "absent"],
					"default": "presence",
					"required": true,
				},
				"informativeness": {
					"type": "string",
					"title": "Informativeness",
					"enum": ["informative", "uninformative"],
					"default": "informative",
					"required": true,
				},
				"score": {
					"minimum": 0,
					"maximum": 100,
					"default": 50,
				},
				"wrong_tumor_type": {
					"type": "boolean",
					"default": false,
				},
				"tumor_note": {
					"type": "string",
					"required": true,
				},

			},
			"dependencies": {
				"tumor_note": ["wrong_tumor_type"],
				"score": ["informativeness"],
			},
		},
		"options": {
			"fields": {
				"score": {
					"type": "integer",
					"label": "Score",
					"slider": true,
					"dependencies": {
						"informativeness": "informative",
					},
				},
				"wrong_tumor_type": {
					"rightLabel": "Wrong Tumor Type",
					"helper": "Check If Tumor Type Is Wrong",
					"helpersPosition": "above",
				},
				"tumor_note": {
					"type": "textarea",
					"label": "Tumor Note",
					"helper": "Please Enter the Correct Tumor Type",
					"helpersPosition": "above",
					"rows": 2,
					"dependencies": {
						"wrong_tumor_type": true,
					},
				},
			},
		},
	},
	"version": "1.0.0",
}
db.configuration.insert(evaluation_form)