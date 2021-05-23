const babelTypes = require("@babel/types");
const path = require("path");
const fs = require("fs");
const types = require("./typedef");
const entities = require("html-entities");

module.exports = {
	/** @type {Object.<string, types.Resource>} */
	resourceCache: {},

	/**
	 * @param {babelTypes.ObjectExpression} objectExpression
	 * @param {string} name
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
	 * @returns {Array<{key: string; value: string}>?}
	 */
	getResourseValue(config) {
		if (!fs.existsSync(config.filePath) && (!config.resourceName || !config.line)) {
			return null;
		}

		var resourceName = config.resourceName;

		if (!resourceName) {
			resourceName = this.getResourceName(config.line, config.index || -1);
		}

		var dir = path.dirname(config.filePath);
		var fileName = path.basename(config.filePath, ".js");
		var descriptionTime = this.getDescriptorTime(dir);

		if (!descriptionTime) {
			return null;
		}

		var cache = this.resourceCache[config.filePath];

		if (cache) {
			var cacheTime = cache.time;
			if (cacheTime === descriptionTime) {
				return this.formatResourceValue(cache.resources[resourceName]);
			}
		}

		var resourceDir = path.normalize(`${dir}\\..\\..\\Resources\\${fileName}.ClientUnit`);
		if (!fs.existsSync(resourceDir)) {
			return null;
		}

		var files = fs.readdirSync(resourceDir);

		cache = {
			time: descriptionTime,
			resources: {}
		};

		const regex = /Name="LocalizableStrings\.(?<resourceName>\w+)\.Value" Value="(?<value>.*)"/gm;
		for (var file of files) {
			var filePath = path.join(resourceDir, file);
			var fileName = path.basename(filePath, ".xml");
			var content = fs.readFileSync(filePath).toString();

			// @ts-ignore
			var matches = content.matchAll(regex);

			for (var match of matches) {
				var resource = match[1];

				if (!cache.resources[resource]) {
					cache.resources[resource] = {};
				}

				var value = entities.decode(match[2]);
				if (cache.resources[resource][fileName] || value === "") {
					continue;
				}

				cache.resources[resource][fileName] = value;
			}
		}

		this.resourceCache[filePath] = cache;
		return this.formatResourceValue(cache.resources[resourceName]);
	},

	/**
	 * @returns {Array<{key: string;value: string;}>}
	 * @param {{ [x: string]: string; }} value
	 */
	formatResourceValue(value) {
		if (!value) {
			return [{
				key: "unknown",
				value: "Ресурс родителя / не известный ресурс"
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

		var time = JSON.parse(fs.readFileSync(descriptorPath).toString());

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
	}
};