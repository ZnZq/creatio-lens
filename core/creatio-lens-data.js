const terrasoft = {
	DataValueType: {
		GUID: 0,
		TEXT: 1,
		INTEGER: 4,
		FLOAT: 5,
		MONEY: 6,
		DATE_TIME: 7,
		DATE: 8,
		TIME: 9,
		LOOKUP: 10,
		ENUM: 11,
		BOOLEAN: 12,
		BLOB: 13,
		IMAGE: 14,
		CUSTOM_OBJECT: 15,
		IMAGELOOKUP: 16,
		COLLECTION: 17,
		COLOR: 18,
		LOCALIZABLE_STRING: 19,
		ENTITY: 20,
		ENTITY_COLLECTION: 21,
		ENTITY_COLUMN_MAPPING_COLLECTION: 22,
		HASH_TEXT: 23,
		SECURE_TEXT: 24,
		FILE: 25,
		MAPPING: 26,
		SHORT_TEXT: 27,
		MEDIUM_TEXT: 28,
		MAXSIZE_TEXT: 29,
		LONG_TEXT: 30,
		FLOAT1: 31,
		FLOAT2: 32,
		FLOAT3: 33,
		FLOAT4: 34,
		LOCALIZABLE_PARAMETER_VALUES_LIST: 35,
		METADATA_TEXT: 36,
		STAGE_INDICATOR: 37,
		OBJECT_LIST: 38,
		COMPOSITE_OBJECT_LIST: 39,
		FLOAT8: 40
	},
	ComparisonType: {
		BETWEEN: 0,
		IS_NULL: 1,
		IS_NOT_NULL: 2,
		EQUAL: 3,
		NOT_EQUAL: 4,
		LESS: 5,
		LESS_OR_EQUAL: 6,
		GREATER: 7,
		GREATER_OR_EQUAL: 8,
		START_WITH: 9,
		NOT_START_WITH: 10,
		CONTAIN: 11,
		NOT_CONTAIN: 12,
		END_WITH: 13,
		NOT_END_WITH: 14,
		EXISTS: 15,
		NOT_EXISTS: 16
	},
	ViewItemType: {
		GRID_LAYOUT: 0,
		TAB_PANEL: 1,
		DETAIL: 2,
		MODEL_ITEM: 3,
		MODULE: 4,
		BUTTON: 5,
		LABEL: 6,
		CONTAINER: 7,
		MENU: 8,
		MENU_ITEM: 9,
		MENU_SEPARATOR: 10,
		SECTION_VIEWS: 11,
		SECTION_VIEW: 12,
		GRID: 13,
		SCHEDULE_EDIT: 14,
		CONTROL_GROUP: 15,
		RADIO_GROUP: 16,
		DESIGN_VIEW: 17,
		COLOR_BUTTON: 18,
		IMAGE_TAB_PANEL: 19,
		HYPERLINK: 20,
		INFORMATION_BUTTON: 21,
		TIP: 22,
		COMPONENT: 23,
		TIP_LABEL: 24,
		PROGRESS_BAR: 30,
		GRID_LAYOUT_EDIT: 31,
		IFRAMECONTROL: 32,
		EXTERNAL_WIDGET: 33
	},
	ViewModelColumnType: {
		ENTITY_COLUMN: 0,
		CALCULATED_COLUMN: 1,
		VIRTUAL_COLUMN: 2,
		RESOURCE_COLUMN: 3
	},
	LogicalOperatorType: {
		AND: 0,
		OR: 1
	}
}

const businessRuleEnum = {
	Property: {
		VISIBLE: 0,
		ENABLED: 1,
		REQUIRED: 2,
		READONLY: 3
	},
	RuleType: {
		DISABLED: -1,
		BINDPARAMETER: 0,
		FILTRATION: 1,
		AUTOCOMPLETE: 2,
		POPULATE_ATTRIBUTE: 3
	},
	AutocompleteType: {
		ASIS: 0,
		VALUE: 1,
		DISPLAYVALUE: 2
	},
	ValueType: {
		CONSTANT: 0,
		ATTRIBUTE: 1,
		SYSSETTING: 2,
		SYSVALUE: 3,
		CARDSTATE: 4,
		PARAMETER: 5
	}
}

const constants = {
	defaultValue: "¯\\_(ツ)_/¯"
}

module.exports = {
	Terrasoft: terrasoft,
	BusinessRuleEnum: businessRuleEnum,
	Constants: constants
};