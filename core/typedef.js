const babelTypes = require("@babel/types");
const fs = require("fs");
const helper = require("./creatio-lens-helper");

/**
 * @typedef {object} Document
 * @property {string} filePath
 * @property {string} descriptorPath
 * @property {fs.FSWatcher} fileWatcher
 * @property {fs.FSWatcher} descriptorWatcher
 * @property {acorn.Node} ast
 */

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
                ||
                directionValue.type === "StringLiteral"
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

module.exports = {
	SchemaItem,
	DependencyRootItem,
	MixinRootItem,
	MessageRootItem,
    AttributeRootItem,
    DetailRootItem,
};