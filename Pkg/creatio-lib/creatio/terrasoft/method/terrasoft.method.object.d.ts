/// <reference path="terrasoft.constant.d.ts" />
/// <reference path="terrasoft.enum.d.ts" />

namespace Terrasoft {

	/**
	 * Performs deep clone of object. Doesn't check for cyclic dependencies.
	 * @param source Source object.
	 * @returns Object copy.
	 */
	function deepClone(source: Object): Object

	/**
	 * Removes empty elements for object or array.
	 * @param items Source object or array.
	 * @returns Object or array without empty elements.
	 */
	function deleteEmptyItems(items: any[] | Object): any[] | Object

	/**
	 * Retuns array of property values for object.
	 * @param propertyNames Array of property names.
	 * @param object source object.
	 * @returns Array of property values.
	 */
	function getPropertyValuesArray(propertyNames: any[], object: Object): any[]

	/**
	 * Returns object copy with keys and values inverted.
	 * In order for function to work values should be uniqie and strings serializavle.
	 * 
	 * For example:
	 * 
	 * 		Terrasoft.invert({ Moe: "Moses", Larry: "Louis", Curly: "Jerome" });
	 *
	 * Result
	 * 
	 * 		{ Moses: "Moe", Louis: "Larry", Jerome: "Curly" };
	 * @param object 
	 */
	function invert(object: Object): Object

	/**
	 * Return a copy of the object only containing the whitelisted properties.
	 * 
	 * For example:
	 * 
	 * 		Terrasoft.pick({ Moe: "Moses", Larry: "Louis", Curly: "Jerome" }, "Larry", "Curly");
	 *
	 * Result
	 * 
	 * 		{ Larry: "Louis", Curly: "Jerome" }
	 * 
	 * @param object Entire object.
	 * @param properties White listed keys.
	 * @returns Object containing the whitelisted properties.
	 */
	function pick(object: Object, ...properties: String[]): Object

	/**
	 * Checks whether object contains own properties and methods.
	 * @param object Source object.
	 * @returns Returns true if object does not contain own properties and methods.
	 */
	function isEmptyObject(object: Object): Boolean

	/**
	 * Returns array of object property names (keys).
	 *
	 * For example:
	 * 
	 * 		Terrasoft.keys({ one: 1, two : 2, thre: 3 });
	 * 
	 * Result:
	 * 
	 * 		["one", "two", "three"]
	 * 
	 * @param object Source object.
	 * @returns Array of keys.
	 */
	function keys(object: Object): String[]

	/**
	 * Transforms object with array parameters in object array, which contains values of source object.
	 * @param object Source object.
	 * @returns Result array.
	 */
	function mapObjectToCollection(object: Object): any[]

	/**
	 * Returns string representation of object with given formatting.
	 * 
	 * For example:
	 * 
	 * 		serializeObject({
	 * 			source: {
	 * 				x: 5,
	 * 				y: 40,
	 * 				z: 10
	 * 			},
	 * 			properties: ["x", "y"],
	 * 			format: "X={x}; Y={y}",
	 * 			valueConverter: function(propertyValue, propertyName) {
	 * 				if (propertyName === "y") {
	 * 					return propertyValue / 2;
	 * 				}
	 * 				return propertyValue * 2;
	 * 			}
	 * 		});
	 *
	 * Result: 
	 * 
	 * 		"X=10; Y=20"
	 * 
	 * @param config Serialization config.
	 * @param config.source Object to serialize.
	 * @param config.properties Array of property names. If not specified, all properties are serialized (Object.keys()).
	 * @param config.format Serialization format. Each property passed in curly braces.
	 * @param config.valueConverter Function of value transformation. If not specified, toString() method will be called
	 * @returns Serialized object.
	 */
	function serializeObject(config: {
		source: Object,
		properties: String[],
		format: String,
		valueConverter: (propertyValue: Object, propertyName: String) => any
	}): String

	/**
	 * Returns string representation of object with given formatting.
	 * @param config Serialization config.
	 * @deprecated Use Terrasoft.serializeObject instead
	 */
	function serialzieObject(config: object): String

	/**
	 * Returns new object with same properties mapped by fn function.
	 * 
	 * For example:
	 * 
	 * 		var object = {
	 * 			prop1: 11,
	 * 			prop2: 22,
	 * 			prop3: 33
	 * 		};
	 * 		Terrasoft.mapObject(object, function(prop, name) {
	 * 			return prop * 2;
	 * 		}, this);

	 * Result:

	 * 		{
	 * 			prop1: 22,
	 * 			prop2: 44,
	 * 			prop3: 99
	 * 		}
	 * @param object Source object.
	 * @param fn Iteration function.
	 * @param scope Iteration function scope.
	 */
	function mapObject(object: Object, fn: (
		prop: any,
		name: String
	) => any, scope: any): Object

	/**
	 * Returns true if objects are equal.
	 * @param object1 First object.
	 * @param object2 Second object.
	 * @returns True if objects are equal.
	 */
	function isEqual(object1: Object, object2: Object): Boolean

	/**
	 * Removes properties from object.
	 * @param object Object.
	 * @param properties Properties.
	 */
	function removeProperties(object: Object, properties: String[]): void

	/**
	 * Finds value from object by path.
	 * 
	 * For example:
	 * 
	 * 		Terrasoft.findValueByPath({
	 * 			key1: {
	 * 				key2: {
	 * 					key3: {
	 * 						d1: "Value 1",
	 * 						d2: "Value 2"
	 * 					}
	 * 				}
	 * 			}
	 * 		}, "key1.key2.key3");
	 *
	 * Result: 
	 *
	 * 		{d1: "Value 1", d2: "Value 2"};
	 * @param object Object.
	 * @param path Path.
	 * @returns value, otherwise return undefined.
	 */
	function findValueByPath(object: Object, path: String): any

	/**
	 * Returns object with properties matched to filter.
	 * 
	 * For example:
	 * 
	 * 		Terrasoft.filterObject({
	 * 			"Field1": {
	 * 				prop1: true,
	 * 				prop2: 2
	 * 			},
	 * 			"Field2": {
	 * 				prop1: false,
	 * 				prop2: 5
	 * 			},
	 * 			"Field3": {
	 * 				prop2: 5,
	 * 				prop3: 10
	 * 			}
	 * 		}, { prop2: 5 });
	 *
	 * Result: 
	 * 
	 * 		{
	 * 			"Field2": {
	 * 				prop1: false,
	 * 				prop2: 5
	 * 			},
	 * 			"Field3": {
	 * 				prop2: 5
	 * 				prop3: 10
	 * 			}
	 * 		}
	 * 
	 * @param object Source object.
	 * @param filter Key-value pairs to filter.
	 */
	function filterObject(object: Object, filter: Object): Object

	/**
	 * Return the object whose property values are html encode.
	 * @param object The object to be encode.
	 * @returns Object whose property values are html encode.
	 */
	function encodeHtmlObjectValues(object: Object): Object

	/**
	 * Return all the elements that pass a truth test.
	 * @param list List.
	 * @param iterator Iterator function.
	 * @param context Context.
	 */
	function filterObjectList(list: Object, iterator: (
		value: any,
		key: any,
		list: Object
	) => Boolean, context: any): Object

	/**
	 * Sort object by property name or function.
	 * @param object Object to sort.
	 * @param property Property name of object or iterator function.
	 */
	function sortObj(object: Object, property: Object | ((
		pair: any
	) => any)): Object

	/**
	 * Return a copy of the object, filtered to omit the blacklisted keys (or array of keys).
	 * @param object Object.
	 * @param keys Blacklisted keys (or array of keys).
	 */
	function omit(object: Object, keys: any[]): Object
}