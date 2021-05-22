const babelTypes = require("@babel/types");
const fs = require("fs");

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

module.exports = {
	SchemaItem,
	DependencyRootItem,
    MixinRootItem
};