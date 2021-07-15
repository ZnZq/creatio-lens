/// <reference path="terrasoft.constant.d.ts" />
/// <reference path="terrasoft.enum.d.ts" />

namespace Terrasoft {

	/**
	 * Template for empty abstract method.
	 * If method is not defined in child class, exception, which contains method name,
	 * interface name and child class name, will be thrown.
	 * @throws {@link Terrasoft.NotImplementedException}
	 */
	function abstractFn(): void

	/**
	 * Adds objects additionalItems into parent array of source object
	 * @param container Object array to start search.
	 * @param namePropertyValue value of property 'name' of object to search.
	 * @param additionalItems items to add.
	 */
	function addSchemaItems(container: Object[], namePropertyValue: String, additionalItems: any[]): any[]

	/**
	 * Adds attributes into source object.
	 * @param container Object array to start search.
	 * @param namePropertyValue value of attribute 'name' of object to search.
	 * @param additionalObjectProperties object attributes to add
	 */
	function applySchemaItemProperties(container: Object[], namePropertyValue: String, additionalObjectProperties: any[]): any

	type chainCallback = (next: chainCallback) => void

	/**
	 * Custom implementation of call chain. Next step starts after previous step calls next().
	 * @param callbacks Callbacks.
	 * @param scope Context.
	 */
	function chain(...callbacks: chainCallback[], scope: any): void

	/**
	 * Dynamically generates chain steps for array or collection items, using generator function.
	 * Also allows to set finally callback function after all steps will be executed.
	 * 
	 * Usage:
	 * 
	 * 		Terrasoft.chainForArray(states, function(item, i, list) {
	 * 			return [
	 * 				this.asyncFunction,
	 * 				function(next) {
	 * 					console.log(i); // (some operations)
	 * 					next();
	 * 				}
	 * 			];
	 * 		}, function() {
	 * 			Ext.callback(callback, scope || this);
	 * 		}, this);
	 * 
	 * @param list Array or collection of items
	 * @param generator Function which generates chain steps for each item of collection.
	 * @param callback Finally callback function.
	 * @param scope Chain executing context.
	 */
	function chainForArray(list: any[], generator: (
		item: any,
		index: number,
		collection: any[]
	) => any, callback: chainCallback, scope: any): void

	/**
	 * Creates a copy of sourceCollection, that doesn't contains elements from collectionToCompare.
	 * @param sourceCollection Collection of elements, the elements which are added to the resulting collection.
	 * @param collectionToCompare Collection of elements for comparison.
	 * @param comparator Comparison function for sourceCollection and collectionToCompare. Returns true, if the elements are the same.
	 * @param scope Scope of the comparator.
	 * @returns The resulting collection of elements.
	 */
	function collectionDifference(
		sourceCollection: Terrasoft.Collection,
		collectionToCompare: Terrasoft.Collection,
		comparator: (sourceItem: any, itemToCompare: any) => Boolean,
		scope: any
	): Terrasoft.Collection

	/**
	 * Combines arguments into string. Delimiter "/".
	 * 
	 * For example:
	 * 
	 * 		Terrasoft.combinePath("SectionModule", "ContactSection");
	 * 
	 * Result:
	 * 
	 * 		"SectionModule/ContactSection"
	 * 
	 * @param parts Parts.
	 */
	function combinePath(...parts: String[]): String

	/**
	 * Transforms string into BLOB array.
	 * @param str Source string.
	 * @returns Array with bytecodes of each symbol.
	 */
	function convertStringToBlobArray(str: String): number[]

	/**
	 * Returns version of function, which starts not earlier, than wait timespan elapses, after its last call.
	 * 
	 * Useful for logic, which depends on user actions.
	 * 
	 * E.g. it's better to check user's spelling after the end of input, it's better to dynamically recalculate
	 * markup after user finishes to resize the window.
	 * @param fn Callback function.
	 * @param wait Wait timespan from last call.
	 * @param immediate Indicates whether callback should be performed in the beginning of pause.
	 */
	function debounce(fn: Function, wait: Number, immediate: Boolean): Function

	/**
	 * Defers invoking the function until the current call stack has cleared, similar to using setTimeout with a delay of 0.
	 * @param fn Function.
	 * @param scope Function context.
	 */
	function defer(fn: Function, scope: any): void

	/**
	 * Invoke function with a specified delay.
	 * @param fn Function.
	 * @param scope Function context.
	 * @param timeout Function call timeout.
	 * @param args Function arguments.
	 */
	function delay(fn: Function, scope: ant, timeout: Number, args: any[]): void

	/**
	 * Generates unique key for filter.
	 * @returns Unique key.
	 */
	function generateFilterKey(): String

	/**
	 * Returns object by configuration. If object has property className, instance of required class will be created.
	 * otherwise config will be returned.
	 * @param config Item Configuration.
	 * @returns Initialized config.
	 */
	function getItemByConfig(config: Object): Object

	/**
	 * Retuns mouse button by passed event.
	 * @param event Mouse click event.
	 * @returns Mouse button.
	 */
	function getMouseButton(event: Ext.EventObject | MouseEvent): Terrasoft.MouseButton

	type MessageButton = {
		className: String,
		returnCode: String,
		style: String,
		caption: String
	};

	/**
	 * Shows input window.
	 * @param caption Window caption.
	 * @param handler Buttons handler and ESC key press handler.
	 * @param buttons Control buttons array.
	 * @param scope Context of handler execution.
	 * @param controls Custom control elements configuration
	 * @param cfg 
	 */
	function showInputBox(
		caption: String, 
		handler: (result: String, args: Object) => void,
		buttons: String[] | MessageButton[], 
		scope: any, 
		controls: {
			[key: String]: {
				dataValueType: Terrasoft.DataValueType,
				caption: String,
				value: any,
				renderTo: String,
			}
		}, 
		cfg: Object
	): void

	/**
	 * Add items into array after object with attribute namePropertyValue.
	 * @param container Object array to start search.
	 * @param namePropertyValue value of property 'name' of object to search.
	 * @param additionalItems Items to add.
	 */
	function insertSchemaItemsAfter(
		container: Object[],
		namePropertyValue: String,
		additionalItems: any[]
	): any[]

	/**
	 * Performs null check.
	 * @param value Value to check.
	 * @returns Returns true if value is null.
	 */
	function isNull(value: any): Boolean

	/**
	 * Performs undefined check.
	 * @param value Value to check.
	 * @returns Returns true if value is undefined.
	 */
	function isUndefined(value: any): Boolean

	/**
	 * Loads required modules.
	 * 
	 * Only string can serve as an argument to load module.
	 * @param deps Modules to load.
	 * @param callback Execution callback.
	 * @param scope Scope of callback execution.
	 */
	function require(deps: any[] | String, callback: (...args) => void, scope: any): void

	/**
	 * Saves user profile.
	 * @param key Profile key.
	 * @param profile User profile.
	 * @param isDefault (optional) Shows whether to save default profile of profile of current user.
	 * @param callback Execution callback.
	 * @param scope Scope of callback execution.
	 */
	function saveUserProfile(
		key: String,
		profile: Object,
		isDefault?: Boolean,
		callback: Function,
		scope: any
	): void

	/**
	 * Shows confirmation window.
	 * @param caption Window caption.
	 * @param handler Buttons handler and ESC key press handler.
	 * @param buttons Control buttons array.
	 * @param scope Handler execution context.
	 * @param cfg 
	 */
	function showConfirmation(
		caption: String,
		handler: (result: String, args: Object) => void,
		buttons: String[] | MessageButton[],
		scope: any,
		cfg: Object
	): void

	/**
	 * Shows information window.
	 * @param caption Window caption.
	 * @param handler Buttons handler and ESC key press handler.
	 * @param scope Handler execution context.
	 * @param cfg 
	 */
	function showInformation(
		caption: String,
		handler?: Function,
		scope?: any,
		cfg?: Object
	): void

	/**
	 * Shows error window.
	 * @param message Error message.
	 * @param handler Buttons handler and ESC key press handler.
	 * @param scope Handler execution context.
	 * @param cfg 
	 */
	function showErrorMessage(
		message: String,
		handler?: Function,
		scope?: any
	): void

	/**
	 * Shows dialog window.
	 * @param cfg Configuration object
	 * @param cfg.caption Window caption.
	 * @param cfg.buttons Control buttons array
	 * @param cfg.buttons Buttons array index for default button. Numeration starts from zero.
	 * @param cfg.handler Buttons handler and ESC key press handler.
	 * @param cfg.scope Handler execution context.
	 * @param cfg.style Control element style.
	 */
	function showMessage(cfg: {
		caption: String,
		buttons: String[] | MessageButton[] | Number,
		handler: (result: String, args: Object) => void,
		scope: any,
		style: Object
	}): void

	/**
	 * Returns function version, which if called repeatedly is executed at least at wait timespan.
	 * 
	 * Useful for events, which occur to frequently.
	 * @param fn Callback function.
	 * @param wait Timespan when event grouping is performed.
	 */
	function throttle(fn: Function, wait: Number): Object

	/**
	 * Returns mark of the right to left mode.
	 * @returns Mark of the right to left mode.
	 */
	function getIsRtlMode(): Boolean


	/**
	 * Returns entity column name in data model.
	 * @param entityColumn Column configuration information.
	 * @returns Entity column name in data model.
	 */
	function getEntityColumnValueName(entityColumn: Object): String

	/**
	 * Returns entity column predictable state.
	 * @param entitySchemaName Entity schema name.
	 * @param entityColumn Column configuration information.
	 * @returns Entity column predictable state.
	 */
	function getIsPredictableColumn(entitySchemaName: String, entityColumn: Object): Boolean

	/**
	 * Returns predictable columns.
	 * @param entitySchemaName Entity schema name.
	 * @param entityColumns Entity columns configuration information.
	 * @returns Predictable entity columns.
	 */
	function getPredictableColumns(entitySchemaName: String, entityColumns: Object): Object[]

	/**
	 * Checks whether string is empty or empty guid.
	 * @param value Value to check.
	 */
	function isEmpty(value: any): Boolean

	/**
	 * Destroy object if it is not destroyed already.
	 * For example:
	 * 
	 * 		Terrasoft.utils.common.safeDestroy(object1, object2, object3);
	 * @param objects Objects to destroy.
	 */
	function safeDestroy(...objects: ({
		destroyed: Boolean,
		destroy: () => void
	})[]): void

	
}