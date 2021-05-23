const babelTypes = require("@babel/types");
const fs = require("fs");
const helper = require("./creatio-lens-helper");
const _ = require("underscore");

/**
 * @typedef {object} Resource
 * @property {string} time
 * @property {Object.<string, Object.<string, string>>} resources
 */

class SchemaItem {
	/** @type {string} */
	name = null;

	/** @type {babelTypes.SourceLocation} */
	location = null;

	/** @type {string} */
	tooltip = null;

	/**
	 * @param {string} name
	 * @param {babelTypes.SourceLocation} [location]
	 * @param {string} [tooltip]
	 */
	constructor(name, location, tooltip = null) {
		this.name = name;
		this.location = location;
		this.tooltip = tooltip;
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
	 * @param {Array<babelTypes.StringLiteral>} dependencies
	 * @param {Array<babelTypes.Identifier>} identifiers
	 */
	constructor(dependencies, identifiers) {
		super("Dependencies");

		this.dependencies = dependencies;
		this.identifiers = identifiers;
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
		super(dependency.value);
		this.tooltip = identifier?.name || "¯\\_(ツ)_/¯";

		this.dependency = dependency;
		this.identifier = identifier;

		this.location = dependency.loc;
	}
}

/** @EndRegion Dependency */

/** @Region Mixin */

class MixinRootItem extends SchemaItem {
	/** @type {Array<babelTypes.ObjectProperty>} */
	properties = null;

	/**
	 * @param {Array<babelTypes.ObjectProperty>} properties
	 */
	constructor(properties) {
		super("Mixins");
		this.properties = properties;
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
		super(mixin.key.type === "Identifier" && mixin.key.name || mixin.key.type === "StringLiteral" && mixin.key.value);

		this.tooltip = mixin.value.type === "StringLiteral" && mixin.value.value;
		this.mixin = mixin;
		this.location = mixin.loc;
	}
}

/** @EndRegion Mixin */

/** @Region Message */

class MessageRootItem extends SchemaItem {
	/** @type {Array<babelTypes.ObjectProperty>} */
	messages = null;

	/** @type {Array<MessageDirectionItem>} */
	directions = null;

	/**
	 * @param {Array<babelTypes.ObjectProperty>} messages
	 */
	constructor(messages) {
		super("Messages");
		this.messages = messages;
		this._init();
	}

	_init() {
		this.directions = [
			new MessageDirectionItem("SUBSCRIBE", this.messages),
			new MessageDirectionItem("PUBLISH", this.messages),
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
	 * @param {"SUBSCRIBE" | "PUBLISH"} mode
	 * @param {Array<babelTypes.ObjectProperty>} messages
	 */
	constructor(mode, messages) {
		super(mode);

		this.messages = messages.filter(message => {
			if (message.value.type !== "ObjectExpression") {
				return false;
			}

			/** @type {babelTypes.Node} */
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
		super(message.key.type === "Identifier" && message.key.name || message.key.type === "StringLiteral" && message.key.value);

		this.tooltip = message.value.type === "StringLiteral" && message.value.value;
		this.message = message;
		this.location = message.loc;
	}
}

/** @EndRegion Message */

/** @Region Attribute */

class AttributeRootItem extends SchemaItem {
	/** @type {Array<babelTypes.ObjectProperty>} */
	properties = null;

	/**
	 * @param {Array<babelTypes.ObjectProperty>} properties
	 */
	constructor(properties) {
		super("Attributes");
		this.properties = properties;
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
		super(attribute.key.type === "Identifier" && attribute.key.name || attribute.key.type === "StringLiteral" && attribute.key.value);

		this.attribute = attribute;
		this.location = attribute.loc;
	}
}

/** @EndRegion Attribute */

/** @Region Detail */

class DetailRootItem extends SchemaItem {
	/** @type {Array<babelTypes.ObjectProperty>} */
	properties = null;

	/** @type {string} filePath */
	filePath = null;

	/**
	 * @param {string} filePath
	 * @param {Array<babelTypes.ObjectProperty>} properties
	 */
	constructor(filePath, properties) {
		super("Details");
		this.properties = properties;
		this.filePath = filePath;
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
		super(detail.key.type === "Identifier" && detail.key.name || detail.key.type === "StringLiteral" && detail.key.value);

		this.detail = detail;
		this.location = detail.loc;

		const value = detail.value;
		if (value.type !== "ObjectExpression") {
			return;
		}

		/** @type {babelTypes.Node} */
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

/** @Region Diff */

class DiffRootItem extends SchemaItem {
	/** @type {Array<babelTypes.ObjectExpression>} */
	objects = null;

	/** @type {string} */
	filePath = null;

	/** @type {Array<DiffOperationItem>} */
	operations = null;

	/**
	 * @param {string} filePath
	 * @param {Array<babelTypes.ObjectExpression>} objects
	 */
	constructor(filePath, objects) {
		super("Diff");
		this.objects = objects;
		this.filePath = filePath;

		this._init();
	}

	_init() {
		this.operations = [
			new DiffOperationItem("remove", this.filePath, this.objects),
			new DiffOperationItem("merge", this.filePath, this.objects),
			new DiffOperationItem("insert", this.filePath, this.objects),
			new DiffOperationItem("move", this.filePath, this.objects),
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
		super(operation);
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
		super(name);

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
		super(helper.getPropertyStringValue(diff, "name"));

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
		const value = helper.getPropertyValue(this.diff, "value");
		if (value?.type !== "ObjectExpression") {
			return;
		}

		/** @type {babelTypes.Node} */
		const captionValue = helper.getPropertyValue(value, "captionValue");
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
				/** @type {babelTypes.Node} */
				const bindTo = helper.getPropertyValue(captionValue, "bindTo");
				if (!bindTo || bindTo.type !== "StringLiteral") {
					return;
				}

				resourceValues = helper.getResourseValue({
					filePath: this.filePath,
					resourceName: bindTo.value
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

module.exports = {
	SchemaItem,
	DependencyRootItem,
	MixinRootItem,
	MessageRootItem,
	AttributeRootItem,
	DetailRootItem,
	DiffRootItem,
};