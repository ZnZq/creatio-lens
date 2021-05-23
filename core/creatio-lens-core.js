const parser = require("@babel/parser");
const babelTypes = require("@babel/types");
const traverse = require("@babel/traverse");
const types = require("./typedef");
const { Subject } = require("threads/observable");
const helper = require("./creatio-lens-helper");
const fs = require("fs");
const path = require("path");

class CreatioLensCore {
	/** @type {Subject} */
	onBeforeUpdateAST = null;

	/** @type {Subject} */
	onAfterUpdateAST = null;

	/** @type {Subject} */
	onError = null;

	/** @type {babelTypes.File} */
	ast = null;

	/** @type {string} */
	filePath = null;

	/** @type {Object.<string, boolean>} */
	updatingDescriptor = {};

	activate() {
		this.resourceCache = {};
		this.onBeforeUpdateAST = new Subject();
		this.onAfterUpdateAST = new Subject();
		this.onError = new Subject();
	}

	deactivate() {
		this.resourceCache = null;
		this.onBeforeUpdateAST.complete();
		this.onAfterUpdateAST.complete();
		this.onError.complete();
	}

	/** @returns {Promise<Array<types.SchemaItem>>} */
	async getSchemaTreeRoots() {
		try {
			return [
				await this.getDependencyRoot(),
				await this.getMixinRoot(),
				await this.getMessageRoot(),
				await this.getAttributeRoot(),
				await this.getDetailRoot(),
				await this.getDiffRoot(),
			].filter(value => value !== null);
		} catch (error) {
			this.onError.next(error);
			return [new types.SchemaItem("error", null, error.toString())];
		}
	}

	/** @returns {Promise<types.DependencyRootItem?>} */
	async getDependencyRoot() {
		if (!this.ast) {
			return null;
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

	/**
	 * @param {string} propertyName
	 * @returns {Promise<Array<babelTypes.ObjectProperty>?>}
	 */
	async getSchemaProperty(propertyName) {
		return new Promise(resolve => {
			traverse.default(this.ast, {
				ObjectProperty(node) {
					if (node.parentPath?.parent?.type !== "ReturnStatement") {
						return;
					}

					if (helper.getPropertyName(node.node) === propertyName) {
						if (node.node.value.type === "ObjectExpression") {
							// @ts-ignore
							resolve(node.node.value.properties.filter(prop => prop.type === "ObjectProperty"));
						}
					}
				}
			});

			resolve(null);
		});
	} 

	/** @returns {Promise<types.MixinRootItem?>} */
	async getMixinRoot() {
		if (!this.ast) {
			return null;
		}

		const properties = await this.getSchemaProperty("mixins");
		if (!properties) {
			return null;
		}

		return new types.MixinRootItem(properties);
	}

	/** @returns {Promise<types.MessageRootItem?>} */
	async getMessageRoot() {
		if (!this.ast) {
			return null;
		}

		const properties = await this.getSchemaProperty("messages");
		if (!properties) {
			return null;
		}

		return new types.MessageRootItem(properties);
	}

	/** @returns {Promise<types.AttributeRootItem?>} */
	async getAttributeRoot() {
		if (!this.ast) {
			return null;
		}

		const properties = await this.getSchemaProperty("attributes");
		if (!properties) {
			return null;
		}

		return new types.AttributeRootItem(properties);
	}

	/** @returns {Promise<types.DetailRootItem?>} */
	async getDetailRoot() {
		if (!this.ast) {
			return null;
		}

		const properties = await this.getSchemaProperty("attributes");
		if (!properties) {
			return null;
		}

		return new types.DetailRootItem(this.filePath, properties);
	}

	/** @returns {Promise<types.DiffRootItem?>} */
	async getDiffRoot() {
		if (!this.ast) {
			return null;
		}

		const filePath = this.filePath;

		return new Promise(resolve => {
			traverse.default(this.ast, {
				ObjectProperty(node) {
					if (node.parentPath?.parent?.type !== "ReturnStatement") {
						return;
					}

					if (helper.getPropertyName(node.node) === "diff") {
						if (node.node.value.type === "ArrayExpression") {
							resolve(new types.DiffRootItem(
								filePath,
								// @ts-ignore
								node.node.value.elements.filter(obj => obj.type === "ObjectExpression")
							));
						}
					}
				}
			});

			resolve(null);
		});
	}

	/**
	 * @param {string} filePath
	 * @param {string} script
	 */
	updateAST(filePath, script) {
		try {
			this.filePath = filePath;
			this.onBeforeUpdateAST.next();

			if (script) {
				this.ast = parser.parse(script);
			} else {
				this.ast = null;
			}

			this.onAfterUpdateAST.next();
		} catch (error) {
			this.onError.next(error);
		}
	}

	/**
	 * @param {string} filePath
	 */
	updateDescriptor(filePath) {
		if (this.updatingDescriptor[filePath]) {
			return;
		}
		this.updatingDescriptor[filePath] = true;

		try {
			const dir = path.dirname(filePath);
			const descriptorFile = path.join(dir, "descriptor.json");
			if (!fs.existsSync(descriptorFile)) {
				return;
			}

			const data = fs.readFileSync(descriptorFile);
			const jsonData = JSON.parse(data.toString("utf8").trim());
			jsonData.Descriptor.ModifiedOnUtc = `\\/Date(${new Date().getTime()})\\/`;
			const json = JSON.stringify(jsonData, null, "  ").replace(/\\\\/g, "\\");

			fs.writeFileSync(descriptorFile, json, { encoding: "utf8" });
		} catch (error) {
			this.onError.next(error);
		} finally {
			delete this.updatingDescriptor[filePath];
		}
	}
}

module.exports = new CreatioLensCore();