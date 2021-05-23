const { expose } = require("threads/worker");
const traverse = require("@babel/traverse");
const types = require("./typedef");
const babelTypes = require("@babel/types");
const helper = require("./creatio-lens-helper");
const _ = require("underscore");

expose({
	/**
	 * @param {babelTypes.File} ast
	 * @returns {types.DependencyRootItem | null}
	 */
	getDependencyRoot(ast) {
		if (!ast) {
			return null;
		}

		/** @type {types.DependencyRootItem} */
		let rootItem = null;

		traverse.default(ast, {
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

					rootItem = new types.DependencyRootItem({
						// @ts-ignore
						dependencies: node.node.elements.filter(el => el.type === "StringLiteral"),
						// @ts-ignore
						identifiers: func.params.filter(el => el.type === "Identifier")
					});
				}
			}
		});

		return rootItem;
	},

	/**
	 * @param {babelTypes.File} ast
	 * @param {string} propertyName
	 * @returns {Array<babelTypes.ObjectProperty> | null}
	 */
	getSchemaProperty(ast, propertyName) {
		if (!ast) {
			return null;
		}

		/** @type {Array<babelTypes.ObjectProperty>} */
		let array = [];

		traverse.default(ast, {
			ObjectProperty(node) {
				if (node.parentPath?.parent?.type !== "ReturnStatement") {
					return;
				}

				if (helper.getPropertyName(node.node) === propertyName) {
					if (node.node.value.type === "ObjectExpression") {
						// @ts-ignore
						array = node.node.value.properties.filter(prop => prop.type === "ObjectProperty");
					}
				}
			}
		});

		return array;
	},

	/**
	 * @param {babelTypes.File} ast
	 * @param {string} filePath
	 * @returns {types.DiffRootItem | null}
	 */
	getDiffRoot(ast, filePath) {
		if (!ast) {
			return null;
		}

		/** @type {types.DiffRootItem} */
		let rootItem = null;

		traverse.default(ast, {
			ObjectProperty(node) {
				if (node.parentPath?.parent?.type !== "ReturnStatement") {
					return;
				}

				if (helper.getPropertyName(node.node) === "diff") {
					if (node.node.value.type === "ArrayExpression") {
						rootItem = new types.DiffRootItem({
							filePath,
							// @ts-ignore
							objects: node.node.value.elements.filter(obj => obj.type === "ObjectExpression")
						});
					}
				}
			}
		});

		return rootItem;
	},

	/**
	 * @param {babelTypes.File} ast
	 * @param {Array<types.HighlightRule>} rules
	 * @returns {Array<types.Highlight> | null}
	 */
	getConstantHighlights(ast, rules) {
        if (!ast) {
            return null;
        }

		/** @type {Array<types.Highlight>} */
		const highlights = [];

        rules = rules.map(rule => {
            return types.create(rule);
        });

		traverse.default(ast, {
			ObjectProperty(path) {
				var ruleHighlights = _.flatten(
					rules.filter(rule => rule.getIsValidNode(path))
					.map(rule => rule.getHighlight(path))
				).filter(value => value !== null);

				highlights.push(...ruleHighlights);
			}
		});

        return highlights;
	}
});