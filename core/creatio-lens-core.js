// const acorn = require("acorn");
// const walk = require("acorn-walk");
const parser = require("@babel/parser");
const babelTypes = require("@babel/types");
const traverse = require("@babel/traverse");
const path = require("path");
const fs = require("fs");
const types = require("./typedef");
const { Subject } = require("threads/observable");
const entities = require("html-entities");
const helper = require("./creatio-lens-helper");

/** @type {Object.<string, types.Document>} */
const documents = {};

/** @type {acorn.Options} */
const options = {
	ecmaVersion: "latest",
	locations: true
};

class CreatioLensCore {
	/** @type {Object.<string, types.Resource>} */
	resourceCache = null;

	/** @type {Subject} */
	beforeUpdateAST = null;

	/** @type {Subject} */
	afterUpdateAST = null;

	/** @type {babelTypes.File} */
	ast = null;

	async activate() {
		this.resourceCache = {};
		this.beforeUpdateAST = new Subject();
		this.afterUpdateAST = new Subject();
	}

	async deactivate() {
		this.beforeUpdateAST.complete();
		this.afterUpdateAST.complete();
	}

	/** @returns {Promise<Array<types.SchemaItem>>} */
	async getSchemaTreeRoots() {
		return [
			await this.getDependencyRoot(),
			await this.getMixinRoot(),
			await this.getMessageRoot(),
		].filter(value => value !== null);
	}

	/** @returns {Promise<types.DependencyRootItem?>} */
	async getDependencyRoot() {
		if (!this.ast) {
			return Promise.resolve(null);
		}

		return new Promise(resolve => {
			traverse.default(this.ast, {
				ArrayExpression(node) {
					const parent = node.parent;
					if (parent.type === "CallExpression" && parent.callee.type === "Identifier" && parent.callee.name === "define") {
						if (parent.arguments.length !== 3) {
							return;
						}

						var func = parent.arguments[2];
						if (func.type !== "FunctionExpression") {
							return;
						}

						resolve(new types.DependencyRootItem(
							// @ts-ignore
							node.node.elements.filter(el => el.type === "StringLiteral"),
							func.params.filter(el => el.type === "Identifier")
						));
					}
				}
			});

			resolve(null);
		});
	}

	/** @returns {Promise<types.MixinRootItem?>} */
	async getMixinRoot() {
		if (!this.ast) {
			return Promise.resolve(null);
		}

		return new Promise(resolve => {
			traverse.default(this.ast, {
				ObjectProperty(node) {
					if (node.parentPath?.parent?.type !== "ReturnStatement") {
						return;
					}

					if (helper.getPropertyName(node.node) === "mixins") {
						if (node.node.value.type === "ObjectExpression") {
							resolve(new types.MixinRootItem(
								// @ts-ignore
								node.node.value.properties.filter(prop => prop.type === "ObjectProperty")
							));
						}
					}
				}
			});

			resolve(null);
		});
	}

	/** @returns {Promise<types.MessageRootItem?>} */
	async getMessageRoot() {
		if (!this.ast) {
			return Promise.resolve(null);
		}

		return new Promise(resolve => {
			traverse.default(this.ast, {
				ObjectProperty(node) {
					if (node.parentPath?.parent?.type !== "ReturnStatement") {
						return;
					}

					if (helper.getPropertyName(node.node) === "messages") {
						if (node.node.value.type === "ObjectExpression") {
							resolve(new types.MessageRootItem(
								// @ts-ignore
								node.node.value.properties.filter(prop => prop.type === "ObjectProperty")
							));
						}
					}
				}
			});

			resolve(null);
		});
	}

	/** @param {string} script */
	updateAST(script) {
		this.beforeUpdateAST.next();

		if (script) {
			this.ast = parser.parse(script, options);
		} else {
			this.ast = null;
		}

		this.afterUpdateAST.next();
	}

	/**
	 * @param {object} config
	 * @property {string} config.filePath
	 * @property {string} [config.resourceName]
	 * @property {string} [config.line]
	 * @property {number} [config.index]
	 * @returns {Promise<Array<{key: string; value: string}>?>}
	 */
	async getResourseValue(config) {
		return new Promise(resolve => {
			if (!fs.existsSync(config.filePath) && (!config.resourceName || !config.line)) {
				return resolve(null);
			}

			var resourceName = config.resourceName;

			if (!resourceName) {
				resourceName = this.getResourceName(config.line, config.index || -1);
			}

			var dir = path.dirname(config.filePath);
			var fileName = path.basename(config.filePath, ".js");
			var descriptionTime = this.getDescriptorTime(dir);

			if (!descriptionTime) {
				return resolve(null);
			}

			var cache = this.resourceCache[config.filePath];

			if (cache) {
				var cacheTime = cache.time;
				if (cacheTime === descriptionTime) {
					return resolve(this.formatResourceValue(cache.resources[resourceName]));
				}
			}

			var resourceDir = path.normalize(`${dir}\\..\\..\\Resources\\${fileName}.ClientUnit`);
			if (!fs.existsSync(resourceDir)) {
				return resolve(null);
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
			return resolve(this.formatResourceValue(cache.resources[resourceName]));
		});
	}

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
	}

	/** @param {string} fileDir */
	getDescriptorTime(fileDir) {
		var descriptorPath = path.join(fileDir, "descriptor.json");

		if (!fs.existsSync(descriptorPath)) {
			return null;
		}

		var time = JSON.parse(fs.readFileSync(descriptorPath).toString());

		return time.Descriptor.ModifiedOnUtc;
	}

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
	}

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
}

module.exports = new CreatioLensCore();