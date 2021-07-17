const babelTypes = require("@babel/types");
const path = require("path");
const fs = require("fs");
const types = require("./typedef");
const entities = require("html-entities");
const traverse = require("@babel/traverse");
const { Constants } = require("./creatio-lens-data");
const _ = require("underscore");

module.exports = {
	/** @type {Object.<string, types.Resource>} */
	resourceObjectCache: {},

	/**
	 * @param {Object.<string, number>} object
	 * @param {number} value
	 * @param {string} [defValue]
	 * @returns {string}
	 */
	getKeyByValue(object, value, defValue = null) {
		return Object.keys(object).find(key => object[key] === value) || defValue;
	},

	/**
	 * @param {babelTypes.ObjectExpression} objectExpression
	 * @param {string} name
	 * @returns {babelTypes.Node | null}
	 */
	getPropertyValue(objectExpression, name) {
		var properties = objectExpression.properties.filter(property => {
			if (property.type !== "ObjectProperty") {
				return false;
			}

			return this.getPropertyName(property) === name;
		});

		if (properties.length === 0) {
			return null;
		}

		// @ts-ignore
		return properties[0].value;
	},

	/**
	 * @param {babelTypes.ObjectExpression} objectExpression
	 * @param {string} name
	 * @returns {string | null}
	 */
	getPropertyStringValue(objectExpression, name) {
		var value = this.getPropertyValue(objectExpression, name);
		if (!value || value.type !== "StringLiteral") {
			return null;
		}

		return value.value;
	},

	/**
	 * @param {babelTypes.ObjectExpression} objectExpression
	 * @param {string} name
	 * @returns {number | null}
	 */
	getPropertyNumericValue(objectExpression, name) {
		var value = this.getPropertyValue(objectExpression, name);
		if (!value || value.type !== "NumericLiteral") {
			return null;
		}

		return value.value;
	},

	/**
	 * @param {babelTypes.ObjectExpression} objectExpression
	 * @param {string} name
	 * @returns {any | null}
	 */
	getPropertyNodeValue(objectExpression, name) {
		var value = this.getPropertyValue(objectExpression, name);
		if (!value) {
			return null;
		}

		// @ts-ignore
		return value.value;
	},

	/**
	 * @returns {string}
	 * @param {babelTypes.ObjectProperty} property
	 */
	getPropertyName(property) {
		switch (property.key.type) {
			case "Identifier": {
				return property.key.name;
			}
			case "StringLiteral": {
				return property.key.value;
			}
		}

		return "";
	},

	/**
	 * @param {object} config
	 * @property {string} config.filePath
	 * @property {string} [config.resourceName]
	 * @property {string} [config.line]
	 * @property {number} [config.index]
	 * @returns {Array<{key: string; value: string}> | null}
	 */
	getResourseValue(config) {
		if (!config.resourceName && !config.line) {
			return null;
		}

		var resourceName = config.resourceName;
		if (!resourceName) {
			resourceName = this.getResourceName(config.line, config.index || -1);
		}

		var resources = this.getResources(config.filePath);
		if (!resources) {
			return null;
		}

		var array = _.map(resources.cultures, (value, key) => {
			return { key, value: value[resourceName] };
		});

		return array.filter(values => values.value !== undefined);
	},

	/**
	 * @param {string} filePath
	 * @returns {types.Resource}
	 */
	getResources(filePath) {
		if (!fs.existsSync(filePath)) {
			return null;
		}

		var dir = path.dirname(filePath);
		var fileExt = path.extname(filePath);
		var fileName = path.basename(filePath, fileExt);
		var descriptionTime = this.getDescriptorTime(dir);

		if (!descriptionTime) {
			return null;
		}

		var resourceObject = this.resourceObjectCache[filePath];
		if (resourceObject && resourceObject.descriptorTime === descriptionTime) {
			return resourceObject;
		}

		var resourceTag = this.getResourceTag(fileExt);
		var resourceDir = path.normalize(`${dir}\\..\\..\\Resources\\${fileName}.${resourceTag}`);
		if (!fs.existsSync(resourceDir)) {
			return null;
		}

		var files = fs.readdirSync(resourceDir);
		var cache = {
			descriptorTime: descriptionTime,
			cultures: {}
		};

		const regex = /Name="LocalizableStrings\.(?<resourceName>\w+)\.Value" Value="(?<value>.*)"/gm;
		for (var file of files) {
			var filePath = path.join(resourceDir, file);
			var fileName = path.basename(filePath, ".xml");
			var content = fs.readFileSync(filePath, "utf-8").toString();

			// @ts-ignore
			var matches = content.matchAll(regex);

			for (var match of matches) {
				var resourceName = match[1];
				var resourceValue = entities.decode(match[2]);

				if (!cache.cultures[fileName]) {
					cache.cultures[fileName] = {};
				}

				cache.cultures[fileName][resourceName] = resourceValue;
			}
		}

		this.resourceObjectCache[filePath] = cache;

		return cache;
	},

	/**
	 * @param {string} ext 
	 */
	getResourceTag(ext) {
		switch(ext.toLocaleLowerCase()) {
			case ".cs": return "SourceCode";
			case ".js": return "ClientUnit";
			default: return "Unknown";
		}
	},

	/**
	 * @param {{ [x: string]: string; }} value
	 * @returns {Array<{key: string;value: string;}>}
	 */
	formatResourceValue(value) {
		if (!value) {
			return [{
				key: "unknown",
				value: Constants.defaultValue
			}];
		}

		var values = [];

		for (var key in value) {
			values.push({ key, value: value[key] });
		}

		return values;
	},

	/** @param {string} fileDir */
	getDescriptorTime(fileDir) {
		var descriptorPath = path.join(fileDir, "descriptor.json");

		if (!fs.existsSync(descriptorPath)) {
			return null;
		}

		const json = fs.readFileSync(descriptorPath, "utf-8").toString().trim();
		const time = JSON.parse(json);

		return time.Descriptor.ModifiedOnUtc;
	},

	/**
	 * @param {string} text
	 * @param {number} [index]
	 */
	getResourceName(text, index = -1) {
		const regex = /((\w+)?\.(Strings|localizableStrings)\.|"?captionName"?:\s+)"?(?<resource>\w+)"?/gm;

		// @ts-ignore
		var matches = text.matchAll(regex);

		// @ts-ignore
		for (var match of matches) {
			if (index === -1 || match.index < index) {
				return match.groups.resource;
			}
		}

		return "";
	},

	/**
	 * @param {string} filePath
	 * @returns {string | null}
	 */
	getDescriptorFilePath(filePath) {
		let fileDir = path.dirname(filePath);
		let descriptorPath = path.join(fileDir, "descriptor.json");

		if (!fs.existsSync(descriptorPath)) {
			return null;
		}

		return descriptorPath;
	},

	/**
	 * @param {traverse.NodePath<babelTypes.Node>} path
	 * @param {string|Array<string>} parentNames
	 */
	withParent(path, parentNames) {
		if (!parentNames) {
			return true;
		}

		if (!path) {
			return false;
		}

		const names = parentNames instanceof Array ? parentNames : [parentNames];

		if (path.node.type !== "ObjectProperty") {
			return this.withParent(path.parentPath, names);
		}

		let matched = path.node.key.type === "StringLiteral" && names.includes(path.node.key.value)
			|| path.node.key.type === "Identifier" && names.includes(path.node.key.name);

		if (!matched) {
			return this.withParent(path.parentPath, names);
		}

		return true;
	}
};