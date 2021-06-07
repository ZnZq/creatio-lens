const parser = require("@babel/parser");
const babelTypes = require("@babel/types");
const traverse = require("@babel/traverse");
const types = require("./typedef");
const { spawn, Thread, Worker } = require("threads");
const { Subject } = require("threads/observable");
const helper = require("./creatio-lens-helper");
const fs = require("fs");
const path = require("path");
const { Terrasoft, BusinessRuleEnum } = require("./creatio-lens-data");
const _ = require("underscore");

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

	/** @type {import("threads").FunctionThread<any, any> & import("threads/dist/types/master").ModuleProxy<any> & import("threads/dist/types/master").PrivateThreadProps} */
	astWalker = null;

	async activate() {
		this.astWalker = await spawn(new Worker("./creatio-lens-ast-walker"));
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

	/** @returns {Promise<Array<types.SchemaItem | object>>} */
	async getSchemaTreeRoots() {
		try {
			return [
				await this.getDependencyRoot(),
				await this.getMixinRoot(),
				await this.getMessageRoot(),
				await this.getAttributeRoot(),
				await this.getDetailRoot(),
				await this.getBusinessRuleRoot(),
				await this.getDiffRoot(),
			].filter(root => root != null);
		} catch (error) {
			this.onError.next(error);
			return [new types.SchemaItem({
				name: "error",
				tooltip: error.toString()
			})];
		}
	}

	/** @returns {Promise<types.DependencyRootItem | null>} */
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

						resolve(new types.DependencyRootItem({
							// @ts-ignore
							dependencies: node.node.elements.filter(el => el.type === "StringLiteral"),
							// @ts-ignore
							identifiers: func.params.filter(el => el.type === "Identifier")
						}));
					}
				}
			});

			resolve(null);
		});
	}

	/**
	 * @param {string} propertyName
	 * @returns {Promise<traverse.NodePath<babelTypes.ObjectProperty> | null>}
	 */
	async getSchemaProperty(propertyName) {
		if (!this.ast) {
			return null;
		}

		return new Promise(resolve => {
			traverse.default(this.ast, {
				ObjectProperty(path) {
					if (path.parentPath?.parent?.type !== "ReturnStatement") {
						return;
					}

					if (helper.getPropertyName(path.node) === propertyName) {
						resolve(path);
					}
				}
			});

			resolve(null);
		});
	}

	/** @returns {Promise<types.MixinRootItem | null>} */
	async getMixinRoot() {
		if (!this.ast) {
			return null;
		}

		const mixins = await this.getSchemaProperty("mixins");
		if (!mixins) {
			return null;
		}

		return new types.MixinRootItem({ mixins });
	}

	/** @returns {Promise<types.MessageRootItem | null>} */
	async getMessageRoot() {
		if (!this.ast) {
			return null;
		}

		const messages = await this.getSchemaProperty("messages");
		if (!messages) {
			return null;
		}

		return new types.MessageRootItem({ messages });
	}

	/** @returns {Promise<types.AttributeRootItem | null>} */
	async getAttributeRoot() {
		if (!this.ast) {
			return null;
		}

		const attributes = await this.getSchemaProperty("attributes");
		if (!attributes) {
			return null;
		}

		return new types.AttributeRootItem({ attributes });
	}

	/** @returns {Promise<types.DetailRootItem | null>} */
	async getDetailRoot() {
		if (!this.ast) {
			return null;
		}

		const details = await this.getSchemaProperty("details");
		if (!details) {
			return null;
		}

		return new types.DetailRootItem({
			filePath: this.filePath, details
		});
	}

	/** @returns {Promise<types.BusinessRuleRootItem | null>} */
	async getBusinessRuleRoot() {
		if (!this.ast) {
			return null;
		}

		const businessRules = await this.getSchemaProperty("businessRules");
		if (!businessRules) {
			return null;
		}

		return new types.BusinessRuleRootItem({ businessRules });
	}

	/** @returns {Promise<types.DiffRootItem | null>} */
	async getDiffRoot() {
		if (!this.ast) {
			return null;
		}

		let filePath = this.filePath;

		return new Promise(resolve => {
			traverse.default(this.ast, {
				ObjectProperty(path) {
					if (path.parentPath?.parent?.type !== "ReturnStatement") {
						return;
					}

					if (helper.getPropertyName(path.node) === "diff") {
						resolve(new types.DiffRootItem({ filePath, diff: path }));
					}
				}
			});

			resolve(null);
		});
	}

	/**
	 * @param {string} filePath
	 * @param {string} script
	 * @return {Promise<void>}
	 */
	async updateAST(filePath, script) {
		return new Promise(resolve => {
			try {
				this.filePath = filePath;
				this.onBeforeUpdateAST.next();

				if (script) {
					this.ast = parser.parse(script);
				} else {
					this.ast = null;
				}

				this.onAfterUpdateAST.next();
			} catch { } finally {
				resolve();
			}
		});
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
			const json = data.toString("utf8").trim();
			const jsonData = JSON.parse(json);
			jsonData.Descriptor.ModifiedOnUtc = `\\/Date(${new Date().getTime()})\\/`;
			const newJson = JSON.stringify(jsonData, null, "  ").replace(/\\\\/g, "\\");

			fs.writeFileSync(descriptorFile, newJson, { encoding: "utf8" });
		} catch (error) {
			this.onError.next(error);
		} finally {
			delete this.updatingDescriptor[filePath];
		}
	}

	/** @returns {Promise<Array<types.Highlight> | null>} */
	async getConstantHighlights() {
		var highlights = await this.astWalker.getConstantHighlights(this.ast, this.getHighlightRule());

		return highlights;
	}

	/** @returns {Array<types.HighlightRule>} */
	getHighlightRule() {
		return [
			new types.HighlightRule({ attribute: "itemType", constantMap: Terrasoft.ViewItemType }),
			new types.HighlightRule({ attribute: "comparisonType", constantMap: Terrasoft.ComparisonType }),
			new types.HighlightRule({ attribute: "dataValueType", constantMap: Terrasoft.DataValueType }),
			new types.HighlightRule({ attribute: "contentType", constantMap: Terrasoft.ContentType }),
			new types.HighlightRule({ attribute: "type", constantMap: Terrasoft.ViewModelColumnType, parent: "attributes" }),
			new types.HighlightRule({ attribute: "logical", constantMap: Terrasoft.LogicalOperatorType, parent: "businessRules" }),
			new types.HighlightRule({ attribute: "ruleType", constantMap: BusinessRuleEnum.RuleType, parent: "businessRules" }),
			new types.HighlightRule({ attribute: "type", constantMap: BusinessRuleEnum.ValueType, parent: "businessRules" }),
			new types.HighlightRule({ attribute: "property", constantMap: BusinessRuleEnum.Property, parent: "businessRules" }),
			new types.HighlightBusinessRule()
		];
	}

	/**
	 * @param {string} pattern
	 * @param {string} line
	 * @param {Object.<string, number>} data
	 * @returns {Array<string>}
	 */
	completionItems(pattern, line, data) {
		const regex = new RegExp(`${pattern.replace(".", "\\.")}(?<filter>\w+)?`);
		var m = regex.exec(line);

		if (!m) {
			return [];
		}

		var filter = m.groups.filter || "";
		var items = Object.keys(data).filter(
			item => item.toLowerCase().startsWith(filter.toLowerCase())
		);

		return items;
	}
}

module.exports = new CreatioLensCore();