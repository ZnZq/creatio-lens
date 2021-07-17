const babelTypes = require("@babel/types");
const helper = require("./creatio-lens-helper");
const _ = require("underscore");
const { Constants } = require("./creatio-lens-data");
const traverse = require("@babel/traverse");
const { constant } = require("underscore");

/**
 * @typedef {object} Resource
 * @property {string} descriptorTime
 * @property {Object.<string, Object.<string, string>>} cultures
 */

/**
 * @typedef {object} Highlight
 * @property {string} name
 * @property {{line: number, column: number}} location
 * @property {Object.<string, any>} props
 */

class HighlightRule {
	/** @type {string} */
	// @ts-ignore
	type = this.__proto__.constructor.name;

	/** @type {string} */
	attribute = null;

	/** @type {Object.<string, number>} */
	constantMap = null;

	/** @type {string|Array<string>} */
	parent = null;

	/**
	 * @param {{ attribute: string; constantMap: { [x: string]: number; }; parent?: string | string[]; }} config
	 */
	constructor(config) {
		this.attribute = config.attribute;
		this.constantMap = config.constantMap;
		this.parent = config.parent;
	}

	/**
	 * @param {traverse.NodePath<babelTypes.ObjectProperty>} path
	 * @returns {boolean}
	 */
	getIsValidNode(path) {
		const name = helper.getPropertyName(path.node);
		if (this.attribute !== name) {
			return false;
		}

		if (path.node.value.type !== "NumericLiteral") {
			return false;
		}

		if (this.parent && !helper.withParent(path, this.parent)) {
			return false;
		}

		return true;
	}

	/** 
	 * @param {traverse.NodePath<babelTypes.ObjectProperty>} path
	 * @returns {Highlight | null} 
	 */
	getHighlight(path) {
		if (path.node.value.type !== "NumericLiteral") {
			return null;
		}

		const text = helper.getKeyByValue(this.constantMap, path.node.value.value, Constants.defaultValue);

		return {
			name: text,
			location: path.node.loc.end,
			props: {}
		};
	}
}

class HighlightBusinessRule extends HighlightRule {
	constructor() {
		super({
			parent: "businessRules",
			constantMap: null,
			attribute: null
		});
	}

	/**
	 * @param {traverse.NodePath<babelTypes.ObjectProperty>} path
	 * @returns {boolean}
	 */
	getIsValidNode(path) {
		if (path.node.value.type !== "ObjectExpression") {
			return false;
		}

		if (this.parent && !helper.withParent(path, this.parent)) {
			return false;
		}

		const uId = helper.getPropertyStringValue(path.node.value, "uId");

		return !!uId;
	}

	/** 
	 * @param {traverse.NodePath<babelTypes.ObjectProperty>} path
	 * @returns {Highlight | null} 
	 */
	getHighlight(path) {
		if (path.node.value.type !== "ObjectExpression") {
			return null;
		}

		const object = path.node.value;
		const description = HighlightBusinessRule.getObjectDescription(
			path.parentPath, object
		);

		return {
			name: description,
			location: object.loc.start,
			props: {}
		};
	}

	/** 
	 * @param {traverse.NodePath<babelTypes.Node> | babelTypes.Node} path
	 * @param {babelTypes.ObjectExpression} object
	 * @returns {string}
	 */
	static getObjectDescription(path, object) {
		const ruleProperty = path instanceof traverse.NodePath ? path.parent : path;
		if (ruleProperty.type !== "ObjectProperty") {
			return Constants.defaultValue;
		}

		const ruleType = helper.getPropertyNumericValue(object, "ruleType");
		const type = helper.getPropertyNumericValue(object, "type");
		const property = helper.getPropertyNumericValue(object, "property");

		if (ruleType === 0 && property === 0) {
			return "Показывает элемент на странице";
		} else if (ruleType === 0 && property === 1) {
			return "Делает поле доступным";
		} else if (ruleType === 0 && property === 2) {
			return "Делает поле обязательным";
		} else if (ruleType === 0 && property === 3) {
			return "Делает поле только для чтения";
		} else if (ruleType === 1) {
			const parentName = helper.getPropertyName(ruleProperty);
			const baseAttributePatch = helper.getPropertyStringValue(object, "baseAttributePatch");
			const attribute = helper.getPropertyStringValue(object, "attribute");
			const attributePath = helper.getPropertyStringValue(object, "attributePath");
			const value = helper.getPropertyNodeValue(object, "value");

			if (type === 0) {
				return `Добавляет фильтр. ${parentName}.${baseAttributePatch} === ${value}`;
			} else if (type === 1 && attributePath) {
				return `Добавляет фильтр. ${parentName}.${baseAttributePatch} === ${attributePath}.${attribute}`;
			} else if (type === 1 && !attributePath) {
				return `Добавляет фильтр. ${parentName}.${baseAttributePatch} === ${attribute}`;
			}
		}

		return Constants.defaultValue;
	}
}

class SchemaItem {
	/** @type {string} */
	// @ts-ignore
	type = this.__proto__.constructor.name;

	/** @type {string} */
	name = null;

	/** @type {babelTypes.SourceLocation} */
	location = null;

	/** @type {string} */
	tooltip = null;

	/**
	 * @param {{name: string, location?: babelTypes.SourceLocation, tooltip?: string}} config
	 */
	constructor(config) {
		Object.assign(this, config);
	}

	/** @returns {Array<SchemaItem>} */
	getChildren() {
		return [];
	}

	/** @returns {boolean} */
	getHasChildren() {
		return false;
	}
}

/** @Region Dependency */

class DependencyRootItem extends SchemaItem {
	/** @type {Array<babelTypes.StringLiteral>} */
	dependencies = null;

	/** @type {Array<babelTypes.Identifier>} */
	identifiers = null;

	/**
	 * @param {{dependencies: Array<babelTypes.StringLiteral>, identifiers: Array<babelTypes.Identifier>}} config
	 */
	constructor(config) {
		super({ name: "Dependencies" });

		this.dependencies = config.dependencies;
		this.identifiers = config.identifiers;
	}

	/** @returns {Array<DependencyItem>} */
	getChildren() {
		return this.dependencies.map(
			(dep, index) => new DependencyItem(dep, this.identifiers[index])
		);
	}

	getHasChildren() {
		return this.dependencies.length > 0;
	}
}

class DependencyItem extends SchemaItem {
	/** @type {babelTypes.StringLiteral} */
	dependency = null;

	/** @type {babelTypes.Identifier} */
	identifier = null;

	/**
	 * @param {babelTypes.StringLiteral} dependency
	 * @param {babelTypes.Identifier} identifier
	 */
	constructor(dependency, identifier) {
		super({ name: dependency.value });
		this.tooltip = identifier?.name || Constants.defaultValue;

		this.dependency = dependency;
		this.identifier = identifier;

		this.location = dependency.loc;
	}
}

/** @EndRegion Dependency */

/** @Region Mixin */

class MixinRootItem extends SchemaItem {
	/** @type {traverse.NodePath<babelTypes.ObjectProperty>} */
	mixins = null;

	/** @type {Array<babelTypes.ObjectProperty>} */
	properties = null;

	/**
	 * @param {{ mixins: traverse.NodePath<babelTypes.ObjectProperty>; }} config
	 */
	constructor(config) {
		super({ name: "Mixins" });
		this.mixins = config.mixins;
		this._init();
	}

	_init() {
		if (this.mixins.node.value.type !== "ObjectExpression") {
			this.properties = [];
			return;
		}

		// @ts-ignore
		this.properties = this.mixins.node.value.properties.filter(prop => prop.type === "ObjectProperty");
	}

	/** @returns {Array<MixinItem>} */
	getChildren() {
		return this.properties.map(prop => new MixinItem(prop));
	}

	getHasChildren() {
		return this.properties.length > 0;
	}
}

class MixinItem extends SchemaItem {
	/** @type {babelTypes.ObjectProperty} */
	mixin = null;

	/**
	 * @param {babelTypes.ObjectProperty} mixin
	 */
	constructor(mixin) {
		super({
			name: mixin.key.type === "Identifier" && mixin.key.name || mixin.key.type === "StringLiteral" && mixin.key.value
		});

		this.tooltip = mixin.value.type === "StringLiteral" && mixin.value.value;
		this.mixin = mixin;
		this.location = mixin.loc;
	}
}

/** @EndRegion Mixin */

/** @Region Message */

class MessageRootItem extends SchemaItem {
	/** @type {traverse.NodePath<babelTypes.ObjectProperty>} */
	messages = null;

	/** @type {Array<MessageDirectionItem>} */
	directions = null;

	/**
	 * @param {{ messages: traverse.NodePath<babelTypes.ObjectProperty>; }} config
	 */
	constructor(config) {
		super({ name: "Messages" });
		this.messages = config.messages;
		this._init();
	}

	_init() {
		if (this.messages.node.value.type !== "ObjectExpression") {
			this.directions = [];
			return;
		}

		/** @type {Array<babelTypes.ObjectProperty>} */
		// @ts-ignore
		var properties = this.messages.node.value.properties.filter(prop => prop.type === "ObjectProperty");

		this.directions = [
			new MessageDirectionItem("SUBSCRIBE", properties),
			new MessageDirectionItem("PUBLISH", properties),
			new MessageDirectionItem("BIDIRECTIONAL", properties),
		];
	}

	/** @returns {Array<MessageDirectionItem>} */
	getChildren() {
		return this.directions;
	}

	getHasChildren() {
		return this.directions.filter(
			direction => direction.getHasChildren()
		).length > 0;
	}
}

class MessageDirectionItem extends SchemaItem {
	/** @type {Array<MessageItem>} */
	messages = null;

	/**
	 * @param {"SUBSCRIBE" | "PUBLISH" | "BIDIRECTIONAL"} mode
	 * @param {Array<babelTypes.ObjectProperty>} messages
	 */
	constructor(mode, messages) {
		super({ name: mode });

		this.messages = messages.filter(message => {
			if (message.value.type !== "ObjectExpression") {
				return false;
			}

			const directionValue = helper.getPropertyValue(message.value, "direction");
			const direction =
				directionValue.type === "MemberExpression"
				&& directionValue.property.type === "Identifier"
				&& directionValue.property.name
				|| directionValue.type === "StringLiteral"
				&& directionValue.value.toUpperCase();

			return direction === mode;
		}).map(message => new MessageItem(message));
	}

	/** @returns {Array<MessageItem>} */
	getChildren() {
		return this.messages;
	}

	getHasChildren() {
		return this.messages.length > 0;
	}
}

class MessageItem extends SchemaItem {
	/** @type {babelTypes.ObjectProperty} */
	message = null;

	/**
	 * @param {babelTypes.ObjectProperty} message
	 */
	constructor(message) {
		super({
			name: message.key.type === "Identifier" && message.key.name || message.key.type === "StringLiteral" && message.key.value
		});

		this.tooltip = message.value.type === "StringLiteral" && message.value.value;
		this.message = message;
		this.location = message.loc;
	}
}

/** @EndRegion Message */

/** @Region Attribute */

class AttributeRootItem extends SchemaItem {
	/** @type {traverse.NodePath<babelTypes.ObjectProperty>} */
	attributes = null;

	/** @type {Array<babelTypes.ObjectProperty>} */
	properties = [];

	/**
	 * @param {{ attributes: traverse.NodePath<babelTypes.ObjectProperty>; }} config
	 */
	constructor(config) {
		super({ name: "Attributes" });
		this.attributes = config.attributes;
		this._init();
	}

	_init() {
		if (this.attributes.node.value.type !== "ObjectExpression") {
			this.properties = [];
			return;
		}

		// @ts-ignore
		this.properties = this.attributes.node.value.properties.filter(prop => prop.type === "ObjectProperty");
	}

	/** @returns {Array<AttributeItem>} */
	getChildren() {
		return this.properties.map(prop => new AttributeItem(prop));
	}

	getHasChildren() {
		return this.properties.length > 0;
	}
}

class AttributeItem extends SchemaItem {
	/** @type {babelTypes.ObjectProperty} */
	attribute = null;

	/**
	 * @param {babelTypes.ObjectProperty} attribute
	 */
	constructor(attribute) {
		super({
			name: attribute.key.type === "Identifier" && attribute.key.name || attribute.key.type === "StringLiteral" && attribute.key.value
		});

		this.attribute = attribute;
		this.location = attribute.loc;
	}
}

/** @EndRegion Attribute */

/** @Region Detail */

class DetailRootItem extends SchemaItem {
	/** @type {traverse.NodePath<babelTypes.ObjectProperty>} */
	details = null;

	/** @type {string} filePath */
	filePath = null;

	/** @type {Array<babelTypes.ObjectProperty>} */
	properties = null;

	/**
	 * @param {{ details: traverse.NodePath<babelTypes.ObjectProperty>; filePath: string; }} config
	 */
	constructor(config) {
		super({ name: "Details" });
		this.details = config.details;
		this.filePath = config.filePath;
		this._init();
	}

	_init() {
		if (this.details.node.value.type !== "ObjectExpression") {
			this.properties = [];
			return;
		}

		// @ts-ignore
		this.properties = this.details.node.value.properties.filter(prop => prop.type === "ObjectProperty");
	}

	/** @returns {Array<DetailItem>} */
	getChildren() {
		return this.properties.map(prop => new DetailItem(this.filePath, prop));
	}

	getHasChildren() {
		return this.properties.length > 0;
	}
}

class DetailItem extends SchemaItem {
	/** @type {babelTypes.ObjectProperty} */
	detail = null;

	/**
	 * @param {string} filePath
	 * @param {babelTypes.ObjectProperty} detail
	 */
	constructor(filePath, detail) {
		super({
			name: detail.key.type === "Identifier" && detail.key.name || detail.key.type === "StringLiteral" && detail.key.value
		});

		this.detail = detail;
		this.location = detail.loc;

		const value = detail.value;
		if (value.type !== "ObjectExpression") {
			return;
		}

		const captionName = helper.getPropertyValue(value, "captionName");
		if (!captionName || captionName.type !== "StringLiteral") {
			return;
		}

		var resourceValues = helper.getResourseValue({
			filePath: filePath,
			resourceName: captionName.value
		});

		this.tooltip = resourceValues.map(value => `${value.key}: ${value.value}`)
			.join("  \n");;
	}
}

/** @EndRegion Detail */

/** @Region BusinessRule */

class BusinessRuleRootItem extends SchemaItem {
	/** @type {traverse.NodePath<babelTypes.ObjectProperty>} */
	businessRules = null;

	/** @type {Array<babelTypes.ObjectProperty>} */
	properties = null;

	/**
	 * @param {{ businessRules: traverse.NodePath<babelTypes.ObjectProperty> }} config
	 */
	constructor(config) {
		super({ name: "BusinessRules" });
		this.businessRules = config.businessRules;
		this._init();
	}

	_init() {
		if (this.businessRules.node.value.type !== "ObjectExpression") {
			this.properties = [];
			return;
		}

		// @ts-ignore
		this.properties = this.businessRules.node.value.properties.filter(prop => prop.type === "ObjectProperty");
	}

	/** @returns {Array<BusinessRuleItem>} */
	getChildren() {
		return this.properties.map(prop => new BusinessRuleItem(prop));
	}

	getHasChildren() {
		return this.properties.length > 0;
	}
}

class BusinessRuleItem extends SchemaItem {
	/** @type {babelTypes.ObjectProperty} */
	businessRule = null;

	/** @type {Array<SchemaItem>} */
	children = [];

	/**
	 * @param {babelTypes.ObjectProperty} businessRule
	 */
	constructor(businessRule) {
		super({
			name: businessRule.key.type === "Identifier" && businessRule.key.name || businessRule.key.type === "StringLiteral" && businessRule.key.value
		});

		this.businessRule = businessRule;
		this.location = businessRule.loc;

		this._init();
	}

	_init() {
		if (this.businessRule.value.type !== "ObjectExpression") {
			return;
		}

		this.children = this.businessRule.value.properties.map(prop => {
			if (prop.type !== "ObjectProperty") {
				return;
			}
			if (prop.value.type !== "ObjectExpression") {
				return;
			}

			return new SchemaItem({
				name: HighlightBusinessRule.getObjectDescription(this.businessRule, prop.value),
				location: prop.value.loc
			});
		});
	}

	/** @returns {Array<SchemaItem>} */
	getChildren() {
		return this.children;
	}

	getHasChildren() {
		return this.children.length > 0;
	}
}

/** @EndRegion BusinessRule */

/** @Region Method */

class MethodRootItem extends SchemaItem {
	/** @type {traverse.NodePath<babelTypes.ObjectProperty>} */
	methods = null;

	/** @type {Array<babelTypes.ObjectProperty>} */
	properties = null;

	/**
	 * @param {{ methods: traverse.NodePath<babelTypes.ObjectProperty>; }} config
	 */
	constructor(config) {
		super({ name: "Methods" });
		this.methods = config.methods;
		this._init();
	}

	_init() {
		if (this.methods.node.value.type !== "ObjectExpression") {
			this.properties = [];
			return;
		}

		// @ts-ignore
		this.properties = this.methods.node.value.properties.filter(prop => prop.type === "ObjectProperty");
	}

	/** @returns {Array<MethodItem>} */
	getChildren() {
		return this.properties.map(prop => new MethodItem(prop));
	}

	getHasChildren() {
		return this.properties.length > 0;
	}
}

class MethodItem extends SchemaItem {
	/** @type {babelTypes.ObjectProperty} */
	method = null;

	/**
	 * @param {babelTypes.ObjectProperty} method
	 */
	constructor(method) {
		super({
			name: method.key.type === "Identifier" && method.key.name || method.key.type === "StringLiteral" && method.key.value
		});

		this.tooltip = method.value.type === "StringLiteral" && method.value.value;
		this.method = method;
		this.location = method.loc;
	}
}

/** @EndRegion Method */

/** @Region Diff */

class DiffRootItem extends SchemaItem {
	/** @type {traverse.NodePath<babelTypes.ObjectProperty>} */
	diff = null;

	/** @type {string} */
	filePath = null;

	/** @type {Array<DiffOperationItem>} */
	operations = null;

	/**
	 * @param {{ diff: traverse.NodePath<babelTypes.ObjectProperty>; filePath: string; }} config
	 */
	constructor(config) {
		super({ name: "Diff" });
		this.diff = config.diff;
		this.filePath = config.filePath;

		this._init();
	}

	_init() {
		if (this.diff.node.value.type !== "ArrayExpression") {
			this.operations = [];
			return;		
		}

		/** @type {Array<babelTypes.ObjectExpression>} */
		// @ts-ignore
		var objects = this.diff.node.value.elements.filter(obj => obj.type === "ObjectExpression");

		this.operations = [
			new DiffOperationItem("remove", this.filePath, objects),
			new DiffOperationItem("merge", this.filePath, objects),
			new DiffOperationItem("insert", this.filePath, objects),
			new DiffOperationItem("move", this.filePath, objects),
		];
	}

	/** @returns {Array<DiffOperationItem>} */
	getChildren() {
		return _.filter(this.operations, operation => operation.getHasChildren());
	}

	getHasChildren() {
		return _.any(this.operations, operation => operation.getHasChildren());
	}
}

class DiffOperationItem extends SchemaItem {
	/** @type {Array<babelTypes.ObjectExpression>} */
	objects = null;

	/** @type {string} */
	filePath = null;

	/** @type {string} */
	operation = null;

	/** @type {Array<{name: string, parentName: string, operation: string, obj: babelTypes.ObjectExpression}>} */
	preparedDiffs = null;

	/** @type {Array<SchemaItem>} */
	children = null;

	/**
	 * @param {"remove" | "merge" | "insert" | "move"} operation
	 * @param {string} filePath
	 * @param {Array<babelTypes.ObjectExpression>} objects
	 */
	constructor(operation, filePath, objects) {
		super({ name: operation });
		this.objects = objects;
		this.operation = operation;
		this.filePath = filePath;

		this._init();
	}

	_init() {
		this.preparedDiffs = this.objects.filter(obj => {
			const operation = helper.getPropertyStringValue(obj, "operation");

			return operation && operation === this.operation;
		}).map(obj => {
			return {
				name: helper.getPropertyStringValue(obj, "name"),
				parentName: helper.getPropertyStringValue(obj, "parentName"),
				operation: helper.getPropertyStringValue(obj, "operation"),
				obj: obj
			};
		});

		if (this.operation !== "insert") {
			this.children = this.preparedDiffs.map(
				obj => new DiffItem(this.filePath, this, obj.obj)
			);
		} else {
			this.children = _.unique(this.preparedDiffs.filter(obj => {
					var parent = _.findWhere(this.preparedDiffs, { name: obj.parentName });

					return parent == null;
				}), false, obj => obj.parentName)
				.map(obj => new DiffParentItem(obj.parentName, this.filePath, this));
		}
	}

	/** @returns {Array<SchemaItem>} */
	getChildren() {
		return this.children;
	}

	getHasChildren() {
		return this.children.length > 0;
	}
}

class DiffParentItem extends SchemaItem {
	/** @type {string} */
	filePath = null;

	/** @type {DiffOperationItem} */
	operationItem = null;

	/** @type {Array<DiffItem>} */
	children = null;

	/**
	 * @param {string} name
	 * @param {string} filePath
	 * @param {DiffOperationItem} operationItem
	 */
	constructor(name, filePath, operationItem) {
		super({ name });

		this.filePath = filePath;
		this.operationItem = operationItem;

		this._init();
	}

	_init() {
		this.children = _.where(this.operationItem.preparedDiffs, {
			parentName: this.name
		}).map(obj => new DiffItem(this.filePath, this.operationItem, obj.obj));
	}

	/** @returns {Array<DiffItem>} */
	getChildren() {
		return this.children;
	}

	getHasChildren() {
		return this.children.length > 0;
	}
}

class DiffItem extends SchemaItem {
	/** @type {babelTypes.ObjectExpression} */
	diff = null;

	/** @type {string} */
	filePath = null;

	/** @type {string} */
	parentName = null;

	/** @type {DiffOperationItem} */
	operationItem = null;

	/** @type {Array<DiffItem>} */
	children = null;

	/**
	 * @param {string} filePath
	 * @param {DiffOperationItem} operationItem
	 * @param {babelTypes.ObjectExpression} diff
	 */
	constructor(filePath, operationItem, diff) {
		super({
			name: helper.getPropertyStringValue(diff, "name")
		});

		this.diff = diff;
		this.filePath = filePath;
		this.operationItem = operationItem;
		this.location = diff.loc;

		this._init();
	}

	_init() {
		this._initTooltip();

		this.children = _.where(this.operationItem.preparedDiffs, {
			parentName: this.name
		}).map(obj => new DiffItem(this.filePath, this.operationItem, obj.obj));
	}

	_initTooltip() {
		const values = helper.getPropertyValue(this.diff, "values");
		if (values?.type !== "ObjectExpression") {
			return;
		}

		const captionValue = helper.getPropertyValue(values, "caption");
		if (!captionValue) {
			return;
		}

		var resourceValues = [];

		switch (captionValue.type) {
			case "StringLiteral": {
				this.tooltip = captionValue.value;
				return;
			}
			case "MemberExpression": {
				resourceValues = helper.getResourseValue({
					filePath: this.filePath,
					resourceName: captionValue.property.type === "Identifier"
						&& captionValue.property.name
				});
				break;
			}
			case "ObjectExpression": {
				const bindTo = helper.getPropertyValue(captionValue, "bindTo");
				if (!bindTo || bindTo.type !== "StringLiteral") {
					return;
				}

				resourceValues = helper.getResourseValue({
					filePath: this.filePath,
					resourceName: _.last(bindTo.value.split("."))
				});
				break;
			}
		}

		this.tooltip = resourceValues.map(value => `${value.key}: ${value.value}`)
			.join("  \n");
	}

	/** @returns {Array<DiffItem>} */
	getChildren() {
		return this.children;
	}

	getHasChildren() {
		return this.children.length > 0;
	}
}

/** @EndRegion Diff */

/** @Region Region */

class Region {
	/** @type {string} */
	name = Constants.defaultValue;

	range = { start: 0, end: 0 };

	/** @type {babelTypes.SourceLocation} */
	location = null;

	/** @type {Array<Region>} */
	children = [];

	/**
	 * @param {string} name 
	 * @param {{start: number, end: number}} range 
	 * @param {babelTypes.SourceLocation} location 
	 */
	constructor(name, range, location) {
		this.name = name;
		this.range = range;
		this.location = location;
	}

	getHasChildren() {
		return this.children.length > 0;
	}
}

const RegionType = {
	Start: "Start",
	End: "End",
	Unknown: "Unknown"
};

/** @EndRegion Region */

/** @Region: Config */

const DefaultConfig = {
	descriptor: true,
	schema: true,
	resource: true,
	region: {
		rules: [
			{
				"beginRegex": "#region(:?\\s+(?<name>.*))?",
				"endRegex": "#endregion"
			},
			{
				"beginRegex": "@Region(:?\\s+(?<name>.*))?",
				"endRegex": "@EndRegion"
			}
		]
	},
	highlight: true,
}

/** @EndRegion: Config */

/**
 * @param {{ type: string; }} object
 */
function create(object) {
	if (typeof object !== "object") {
		return object;
	}

	const instance = eval(`new ${object.type}(object)`);
	return instance;
}

module.exports = {
	create,
	HighlightRule,
	HighlightBusinessRule,
	SchemaItem,
	DependencyRootItem,
	MixinRootItem,
	MessageRootItem,
	AttributeRootItem,
	DetailRootItem,
	BusinessRuleRootItem,
	DiffRootItem,
	MethodRootItem,
	Region,
	RegionType,
	DefaultConfig
};