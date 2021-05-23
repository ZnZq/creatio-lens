const parser = require("@babel/parser");
const babelTypes = require("@babel/types");
const traverse = require("@babel/traverse");
const types = require("./typedef");
const { Subject } = require("threads/observable");
const helper = require("./creatio-lens-helper");

class CreatioLensCore {

	/** @type {Subject} */
	beforeUpdateAST = null;

	/** @type {Subject} */
	afterUpdateAST = null;

	/** @type {babelTypes.File} */
	ast = null;

    /** @type {string} */
	filePath = null;

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
			await this.getAttributeRoot(),
			await this.getDetailRoot(),
			await this.getDiffRoot(),
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

    /** @returns {Promise<types.AttributeRootItem?>} */
	async getAttributeRoot() {
		if (!this.ast) {
			return Promise.resolve(null);
		}

		return new Promise(resolve => {
			traverse.default(this.ast, {
				ObjectProperty(node) {
					if (node.parentPath?.parent?.type !== "ReturnStatement") {
						return;
					}

					if (helper.getPropertyName(node.node) === "attributes") {
						if (node.node.value.type === "ObjectExpression") {
							resolve(new types.AttributeRootItem(
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

    /** @returns {Promise<types.DetailRootItem?>} */
	async getDetailRoot() {
		if (!this.ast) {
			return Promise.resolve(null);
		}

        const filePath = this.filePath;

		return new Promise(resolve => {
			traverse.default(this.ast, {
				ObjectProperty(node) {
					if (node.parentPath?.parent?.type !== "ReturnStatement") {
						return;
					}

					if (helper.getPropertyName(node.node) === "details") {
						if (node.node.value.type === "ObjectExpression") {
							resolve(new types.DetailRootItem(
                                filePath,
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

    /** @returns {Promise<types.DiffRootItem?>} */
	async getDiffRoot() {
		if (!this.ast) {
			return Promise.resolve(null);
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

	/** @param {string} script */
	updateAST(filePath, script) {
        this.filePath = filePath;
		this.beforeUpdateAST.next();

		if (script) {
			this.ast = parser.parse(script);
		} else {
			this.ast = null;
		}

		this.afterUpdateAST.next();
	}
}

module.exports = new CreatioLensCore();