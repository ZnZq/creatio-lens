const babelTypes = require("@babel/types");

module.exports = {
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
	}
};