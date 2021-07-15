// @ts-nocheck
define("SomePage", [
	"SomePageResources",
	"SomeConstants",
	"ServiceHelper"
], function(resources, constants, ServiceHelper) {
	return {
		entitySchemaName: "SomeEntity",
		attributes: {
			"SomeAttribute1": {
				"dataValueType": 12,
				"value": false
			}
		},
		messages: {
			"ChangeClickMessage": {
				"mode": Terrasoft.MessageMode.PTP,
				"direction": Terrasoft.MessageDirectionType.SUBSCRIBE
			},
			"ChangeVisibleMessage": {
				"mode": Terrasoft.MessageMode.PTP,
				"direction": Terrasoft.MessageDirectionType.PUBLISH
			}
		},
		details: /**SCHEMA_DETAILS*/ {
			"Files": {
				"schemaName": "FileDetailV2",
				"captionName": "FileDetailCaption",
				"entitySchemaName": "SomeFile",
				"filter": {
					"detailColumn": "Some",
					"masterColumn": "Id"
				}
			}
		} /**SCHEMA_DETAILS*/ ,
		businessRules: /**SCHEMA_BUSINESS_RULES*/ {
			"SomeField1": {
				"a9b22946-938b-4698-80f8-99cc9357de87": {
					"uId": "a9b22946-938b-4698-80f8-99cc9357de87",
					"enabled": true,
					"removed": false,
					"ruleType": 0,
					"property": 1,
					"logical": 0,
					"conditions": [
						{
							"comparisonType": 2,
							"leftExpression": {
								"type": 1,
								"attribute": "SomeField2"
							}
						}
					]
				}
			},
			"SomeField2": {
				"0956173a-f075-444b-87e4-e10c436ca3be": {
					"uId": "0956173a-f075-444b-87e4-e10c436ca3be",
					"enabled": true,
					"removed": false,
					"ruleType": 0,
					"property": 0,
					"logical": 0,
					"conditions": [
						{
							"comparisonType": 3,
							"leftExpression": {
								"type": 1,
								"attribute": "SomeAttribute1"
							},
							"rightExpression": {
								"type": 0,
								"value": true,
								"dataValueType": 12
							}
						}
					]
				},
				"6b54e84b-4d91-4239-86fa-c2ff8c47c20c": {
					"uId": "6b54e84b-4d91-4239-86fa-c2ff8c47c20c",
					"enabled": true,
					"removed": false,
					"ruleType": 1,
					"baseAttributePatch": "SomeColumn1",
					"comparisonType": 3,
					"autoClean": true,
					"autocomplete": false,
					"type": 1,
					"attribute": "SomeField3"
				}
			}
		} /**SCHEMA_BUSINESS_RULES*/ ,
		methods: {
			init: function() {
				this.callParent(arguments);

				resources.localizableStrings.SomeResource1;
				this.get("Resources.Strings.SomeResource2");
			}
		},
		dataModels: /**SCHEMA_DATA_MODELS*/ {} /**SCHEMA_DATA_MODELS*/ ,
		diff: /**SCHEMA_DIFF*/ [
			{
				"operation": "insert",
				"name": "SomeButton1",
				"values": {
					"itemType": 5,
					"caption": { "bindTo": "Resources.Strings.SomeButton1Caption" },
					"click": { "bindTo": "onSomeButton1Click" },
					"style": "blue",
					"classes": { "textClass": ["actions-button-margin-right"] }
				},
				"parentName": "LeftContainer",
				"propertyName": "items",
			},
			{
				"operation": "insert",
				"name": "SomeButton2",
				"values": {
					"itemType": 5,
					"caption": { "bindTo": "Resources.Strings.SomeButton2Caption" },
					"click": { "bindTo": "onSomeButton2Click" },
					"style": "blue",
					"classes": { "textClass": ["actions-button-margin-right"] }
				},
				"parentName": "LeftContainer",
				"propertyName": "items",
			},
			{
				"operation": "merge",
				"name": "Header",
				"values": {
					"itemType": 7
				}
			},
			{
				"operation": "remove",
				"name": "Header",
				"properties": [
					"collapseEmptyRow"
				]
			},
			{
				"operation": "insert",
				"name": "HeaderGridLayout",
				"values": {
					"itemType": 0,
					"items": [],
					"collapseEmptyRow": true
				},
				"parentName": "Header",
				"propertyName": "items",
				"index": 0
			},
			{
				"operation": "insert",
				"name": "Number",
				"values": {
					"layout": {
						"colSpan": 12,
						"rowSpan": 1,
						"column": 0,
						"row": 0,
						"layoutName": "HeaderGridLayout"
					},
					"bindTo": "Number",
					"enabled": false
				},
				"parentName": "HeaderGridLayout",
				"propertyName": "items",
				"index": 0
			},
			{
				"operation": "insert",
				"name": "Name",
				"values": {
					"layout": {
						"colSpan": 12,
						"rowSpan": 1,
						"column": 12,
						"row": 0,
						"layoutName": "HeaderGridLayout"
					},
					"bindTo": "Name",
					"enabled": false,
					"contentType": 3
				},
				"parentName": "HeaderGridLayout",
				"propertyName": "items",
			},
			{
				"operation": "insert",
				"name": "CreatedOn",
				"values": {
					"layout": {
						"colSpan": 12,
						"rowSpan": 1,
						"column": 0,
						"row": 1,
						"layoutName": "HeaderGridLayout"
					},
					"bindTo": "CreatedOn"
				},
				"parentName": "HeaderGridLayout",
				"propertyName": "items",
			},
			{
				"operation": "insert",
				"name": "Contact",
				"values": {
					"layout": {
						"colSpan": 12,
						"rowSpan": 1,
						"column": 12,
						"row": 1,
						"layoutName": "HeaderGridLayout"
					},
					"bindTo": "Contact",
					"enabled": {
						"bindTo": "IsChangeManagementProcessManagerRole"
					},
					"contentType": 3
				},
				"parentName": "HeaderGridLayout",
				"propertyName": "items",
			},
			{
				"operation": "insert",
				"name": "HeaderDetailContainer",
				"values": {
					"itemType": 7,
					"items": []
				},
				"parentName": "Header",
				"propertyName": "items"
			},
			{
				"operation": "insert",
				"name": "FileDetailV2",
				"values": {
					"itemType": 2
				},
				"parentName": "HeaderDetailContainer",
				"propertyName": "items",
			},
			{
				"operation": "remove",
				"name": "ESNTab"
			},
			{
				"operation": "remove",
				"name": "ESNFeedContainer"
			},
			{
				"operation": "remove",
				"name": "ESNFeed"
			},
		] /**SCHEMA_DIFF*/ ,
	};
});