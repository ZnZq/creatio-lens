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
			];
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
		const root = await this.astWalker.getDependencyRoot(this.ast);

		return root;
	}

	/**
	 * @param {string} propertyName
	 * @returns {Promise<Array<babelTypes.ObjectProperty> | null>}
	 */
	async getSchemaProperty(propertyName) {
		var array = await this.astWalker.getSchemaProperty(this.ast, propertyName);

		return array;
	}

	/** @returns {Promise<types.MixinRootItem | null>} */
	async getMixinRoot() {
		if (!this.ast) {
			return null;
		}

		const properties = await this.getSchemaProperty("mixins");
		if (!properties) {
			return null;
		}

		return new types.MixinRootItem({ properties });
	}

	/** @returns {Promise<types.MessageRootItem | null>} */
	async getMessageRoot() {
		if (!this.ast) {
			return null;
		}

		const properties = await this.getSchemaProperty("messages");
		if (!properties) {
			return null;
		}

		return new types.MessageRootItem({ messages: properties });
	}

	/** @returns {Promise<types.AttributeRootItem | null>} */
	async getAttributeRoot() {
		if (!this.ast) {
			return null;
		}

		const properties = await this.getSchemaProperty("attributes");
		if (!properties) {
			return null;
		}

		return new types.AttributeRootItem({ properties });
	}

	/** @returns {Promise<types.DetailRootItem | null>} */
	async getDetailRoot() {
		if (!this.ast) {
			return null;
		}

		const properties = await this.getSchemaProperty("details");
		if (!properties) {
			return null;
		}

		return new types.DetailRootItem({
			filePath: this.filePath,
			properties
		});
	}

	/** @returns {Promise<types.BusinessRuleRootItem | null>} */
	async getBusinessRuleRoot() {
		if (!this.ast) {
			return null;
		}

		const properties = await this.getSchemaProperty("businessRules");
		if (!properties) {
			return null;
		}

		return new types.BusinessRuleRootItem({properties});
	}

	/** @returns {Promise<types.DiffRootItem | null>} */
	async getDiffRoot() {
		const root = await this.astWalker.getDiffRoot(this.ast, this.filePath);

		return root;
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
			} catch (error) {
				this.onError.next(error);
			} finally {
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