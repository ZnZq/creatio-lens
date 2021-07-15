/// <reference path="terrasoft.constant.d.ts" />
/// <reference path="terrasoft.enum.d.ts" />

namespace Terrasoft {

	/**
	 * Checks whether arrays are equal.
	 * @param array1 Array 1
	 * @param array2 Array 2
	 * @returns Returns true if arrays are equal.
	 */
	function areArraysEqual(array1: any[], array2: any[]): Boolean

	/**
	 * Returns copy of array with all falsy values (e.g. false, null, 0, "", undefined, NaN) deleted.
	 * For example:
	 *
	 * 		Terrasoft.compact([0, 1, false, 2, '', 3]);
	 *
	 * Result: 
	 * 
	 * 		[1, 2, 3]
	 * @param array Array
	 */
	function compact(array: any[]): any[]

	/**
	 * Checks whether array contains value.
	 * @param list Set of values
	 * @param value Search value.
	 * @returns Returns true if list contains value.
	 */
	function contains(list: any[], value: any): Boolean

	/**
	 * Returns copy of array with items of second array removed.
	 * @param array Source array.
	 * @param others Array with items to be removed.
	 * @returns A copy of the array from which the values of the second array are deleted.
	 */
	function difference(array: any[], others: any[]): any[]

	/**
	 * Returns iterator function for each element of array. Iterator is called with 3 parameters:
	 * element, index, list. If list - is JavaScript object, parameters are: value, key, list.
	 * @param list List.
	 * @param iterator Iterator function.
	 * @param context Context.
	 * @returns Returns undefined if iterator return true, true otherwise. 
	 */
	function each(list: any[] | Object | Terrasoft.Collection, iterator: (value: any, key: any, list: any[]) => Boolean | undefined, context: any): true | undefined

	/**
	 * Looks through each value in the list, returning the first one that passes a truth test (predicate),
	 * or undefined if no value passes the test.
	 * @param list The array to search.
	 * @param predicate The selection function to execute for each item.
	 * @param scope The scope (this reference) in which the function is executed.
	 */
	function find(list: any[], predicate: (
		value: any,
		index: any,
		list: any
	) => Boolean, scope?: any): any | undefined

	/**
	 * Finds object in array of any nested depth array-object-array.
	 * @param container Array to start search.
	 * @param filter Properties of object to search.
	 * @return result Search result.
	 * @return result.parent Link to array which contains parent object.
	 * @return result.index Index of found element in parent array.
	 * @return result.item Link to found object.
	 */
	function findItem(container: Object[], filter: Object): Object | Number | any[]

	/**
	 * Looks through the list and returns the first value that matches all of the key-value pairs listed in properties.
	 * @param list An array of objects.
	 * @param properties Key-value pairs to filter.
	 */
	function findWhere(list: Object[], properties: Object): Object

	/**
	 * Return all the elements that pass a truth test.
	 * @param list List.
	 * @param iterator Iterator function.
	 * @param context Context.
	 */
	function filter(list: any[], iterator: (
		value: any,
		index: any,
		list: any
	) => Boolean, context: any): any[]

	/**
	 * Checks if an object is an array.
	 * @param target The target to test.
	 * @returns Returns true if the passed value is a JavaScript Array, false otherwise.
	 */
	function isArray(target: any): Boolean

	/**
	 * Return the results of applying the iterator to each element.
	 * @param list List.
	 * @param iterator Iterator function.
	 * @param context Context.
	 */
	function map(list: any[], iterator: (
		value: any,
		index: any,
		list: any
	) => Boolean, context: any): any[]

	/**
	 * Rotate array.
	 * Generate an exception if the parameters are empty.
	 * 
	 * For example:
	 * 
	 * 		Terrasoft.utils.array.rotateArray([0, 1, 2, 3], 2);
	 *
	 * Result: 
	 * 
	 * 		[2, 3, 0, 1];
	 *
	 * For example:
	 * 
	 * 		Terrasoft.utils.array.rotateArray([0, 1, 2, 3, 4, 5, 6, 7, 8, 9], 7);
	 *
	 * Result: 
	 * 
	 * 		[7, 8, 9, 0, 1, 2, 3, 4, 5, 6];
	 *
	 * @param array Array to rotate.
	 * @param rotationCount Count rotation.
	 * @throws {Terrasoft.ArgumentNullOrEmptyException}
	 */
	function rotateArray(array: any[], rotationCount: number): any[]

	/**
	 * Returns true if any of the values in the list pass the iterator truth test. Short-circuits and stops traversing
	 * the list if a true element is found. Delegates to the native method some, if present.
	 * @param list List.
	 * @param iterator Iterator function.
	 * @param context Context.
	 */
	function some(list: any[], iterator: (
		value: any,
		index: any,
		list: any
	) => Boolean, context: any): Boolean

	/**
	 * Returns position where value should be inserted, in order not to break order of sorted array.
	 * @param list Sorted array.
	 * @param value Value to be inserted.
	 * @param iterator Function used to calculate rank for sorting.
	 * @param context Context of iterator execution.
	 * @returns Position where value should be inserted.
	 */
	function sortedIndex(list: any[], value: any, iterator: (
		value: any
	) => any, context: any): Number

	/**
	 * Returns array of elements which contain key-value pairs of properties.
	 *
	 * For example:
	 * 
	 *  	Terrasoft.where(listOfPlays, {author: "Shakespeare", year: 1611});
	 * 
	 * Result:
	 * 
	 * 	[
	 * 		{title: "Cymbeline", author: "Shakespeare", year: 1611},
	 * 		{title: "The Tempest", author: "Shakespeare", year: 1611}
	 * 	]
	 * @param list Collection where search is performed.
	 * @param properties Key-value pairs.
	 * @returns Array of elements which contain key-value pairs of properties.
	 */
	function where(list: any[] | Object, properties: Object): any[]

	/**
	 * Returns copy of array with values of second array removed.
	 * @param array Array
	 * @param values Exclude values
	 */
	function without(array: any[], values: any[]): any[]

	/**
	 * Groups array by criteria.
	 * For example:
	 * 
	 * 	var list = [
	 * 		{
	 * 			author: "Shakespeare",
	 * 			year: 1564
	 * 		},
	 * 		{
	 * 			author: "d'Anthès",
	 * 			year: 1799
	 * 		},
	 * 		{
	 * 			author: "Pushkin",
	 * 			year: 1799
	 * 		},
	 * 		{
	 * 			author: "King"
	 * 		}
	 * 
	 * ];
	 * 
	 * 	Terrasoft.groupBy(list, "year");
	 * 
	 * Result:
	 * 
	 * 	{
	 * 		"1564": [
	 * 			{
	 * 				author: "Shakespeare",
	 * 				year: 1564
	 * 			}
	 * 		],
	 * 		"1799": [
	 * 			{
	 * 				author: "Pushkin",
	 * 				year: 1799
	 * 			},
	 * 			{
	 * 				author: "d'Anthès",
	 * 				year: 1799
	 * 			}
	 * 		],
	 * 		"undefined": [
	 * 			{
	 * 				author: "King"
	 * 			}
	 * 		]
	 * 	}
	 * 
	 * @param array Source array.
	 * @param criteria Group criteria.
	 * @param scope Context.
	 */
	function groupBy(array: any[], criteria: String | Function, scope: any): Object

	/**
	 * Reduce boils down a list of values into a single value.
	 * Memo is the initial state of the reduction, and each successive step of it should be returned by iteratee.
	 * @param list Source array.
	 * @param iteratee Transformation function.
	 * @param memo Initial state of the reduction.
	 * @param context Execution context.
	 */
	function reduce(list: any[], iteratee: (
		memo: Object,
		value: any,
		index: number,
		list: any[]
	) => Object, memo: Object, context: any): Object

	/**
	 * Returns last item in array.
	 * @param array Given array.
	 * @throws {Terrasoft.ArgumentNullOrEmptyException}
	 * @returns Last array item.
	 */
	function last(array: any[]): any

	/**
	 * Returns last item in array.
	 * @param array Given array.
	 * @returns Last array item.
	 */
	function lastOrDefault(array: any[]): any | undefined

	/**
	 * Returns first item in array.
	 * @param array Given array.
	 * @throws {Terrasoft.ArgumentNullOrEmptyException}
	 * @returns First array item.
	 */
	function first(array: any[]): any

	/**
	 * Returns first item in array.
	 * @param array Given array.
	 * @param defaultValue Default value if array not has first element.
	 * @returns First array item, or defaultValue.
	 */
	function firstOrDefault(array: any[], defaultValue?: any): any

	/**
	 * Returns enumerator over array.
	 * @param array Array to enumerate over.
	 * @returns Array enumerator.
	 */
	function getEnumerator(array: any[]): {
		array: any[],
		currentIndex: number,
		hasNext: () => Boolean,
		next: () => any
	}

	type asyncIteratorFn = (
		value: any,
		next: asyncIteratorFn | null,
		options: {
			break: () => void
		}
	) => void;

	/**
	 * Enumerates async over an array.
	 * @param enumerable Enumerable object to enumerate over.
	 * @param iteratorFn Iteration function.
	 * @param callback Callback in the end of iteration.
	 * @param scope Callback scope.
	 */
	function eachAsync(enumerable: Object, iteratorFn: asyncIteratorFn, callback: (...any) => void, scope: any): void

	/**
	 * Enumerates async over an array asynchronously in parallel.
	 * @param enumerable Enumerable object to enumerate over.
	 * @param iteratorFn Iteration function.
	 * @param callback Callback in the end of iteration.
	 * @param scope Callback scope.
	 */
	function eachAsyncAll(enumerable: Object, iteratorFn: (
		item: any,
		resolve: (any) => void
	) => void, callback: (results: any[]) => void, scope: any): void

	/**
	 * Append values to the array.
	 * @param array An array to add values.
	 * @param items Value or array of values to add.
	 * @param appendIfNotExist Flag that indicates whether adds only unique values.
	 * @throws {Terrasoft.exceptions.ArgumentNullOrEmptyException} array is null.
	 * @throws {Terrasoft.exceptions.UnsupportedTypeException} array is not array.
	 */
	function append(array: any[], items: any | any[], appendIfNotExist: Boolean): void

	/**
	 * Append values to the array if they don't already exist.
	 * @param array An array to add values.
	 * @param items Value or array of values to add.
	 * @throws {Terrasoft.exceptions.ArgumentNullOrEmptyException} array is null.
	 * @throws {Terrasoft.exceptions.UnsupportedTypeException} array is not array.
	 */
	function appendIf(array: any[], items: any | any[]): void


	/**
	 *  Merges duplicate items into new array.
	 * @param array An array to merge.
	 * @param equalityFn Equality function that determines duplicates.
	 * @param mergeFn Merge function that combines duplicates into one item.
	 * @param scope Functions scope.
	 */
	function mergeSame(array: any[], equalityFn: (
		item: any,
		searchItem: any
	) => any[], mergeFn: (
		duplicate: any,
		item: any
	) => any, scope: any): any[]

	/**
	 * Generates unique value.
	 * 
	 * For example:
	 *
	 * 		Terrasoft.getUniqueValue(["item", "item1", "item2"], "item");
	 *
	 * Result: 
	 * 
	 * 		"item3"
	 * @param list 
	 * @param prefix 
	 */
	function getUniqueValue(list: String[], prefix: String): String

	/**
	 * Returns an array that contains elements included in both given arrays.
	 * For example:
	 *
	 * 		Terrasoft.intersect([1, 2, 3], [2, 3, 4]);
	 *
	 * Result:
	 * 
	 * 		[2, 3]
	 * @param array1 First array.
	 * @param array2 Second array.
	 * @returns Intersection of the given arrays.
	 */
	function intersect(array1: any[], array2: any[]): any[]

	/**
	 * Flattens a nested array (the nesting can be to any depth).
	 * @param array Array to flatten.
	 * @param shallow If specified the array will only be flattened a single level.
	 */
	function flatten(array: any[], shallow: Boolean): any[]
}