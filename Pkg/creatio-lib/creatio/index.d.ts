/// <reference path="terrasoft/index.d.ts" />
/// <reference path="global/global.d.ts" />
/// <reference path="schema/schema.d.ts" />
/// <reference path="extjs/index.d.ts" />

// declare function define(
// 	name: `${string}${"Detail" | "DetailV2"}`,
// 	deps: string[],
// 	callback: (...args: any) => DetailSchema
// ): void;

// declare function define(
// 	name: `${string}${"Page" | "PageV2"}`,
// 	deps: string[],
// 	callback: (...args: any) => PageSchema
// ): void;

// declare function define(
// 	name: `${string}${"Section" | "SectionV2"}`,
// 	deps: string[],
// 	callback: (...args: any) => SectionSchema
// ): void;

type BooleanFunction = (...args: any[]) => boolean;

declare type Schema = {
	entitySchemaName?: string
	mixins?: { [key: string]: string }
	messages?: { [key: string]: Message }
	attributes?: Attributes
	details?: { [key: string]: Detail }
	// methods?: Methods<Attributes>
	methods?: Methods
	diff?: { [key: string]: InsertDiff | RemoveDiff | MergeDiff | MoveDiff }
}

declare type Attributes = { [key: string]: Attribute }

declare type Methods = {
	[key: string]: (this: SchemaMethodContext, ...args: any[]) => any | void
}

declare type SchemaMethodContext = {
	/**
	 * Get the value of the field by name
	 * 
	 * For reference types, it returns a copy, it is necessary for correct work of tracking the change of model values
	 * @param key Field name
	 * @returns Field Value
	 */
	get: (key: String) => any

	/**
	 * Set a hash of attributes (one or many) on the model. If any of the attributes change the model's state, a
	 * "change" event will be triggered on the model. Change events for specific attributes are also triggered, and
	 * you can bind to those as well, for example: change:title, and change:content.
	 * 
	 * You may also pass individual keys and values.
	 * @param key Name of the field or multiple attributes.
	 * @param value Value of the field.
	 * @param options Options.
	 */
	set: (key: String, value: any, options?: {
		silent?: Boolean,
		preventValidation?: Boolean
	}) => void,

	/**
	 * Send `CardChanged` message to section for set value in key
	 * @param key Name of the field or multiple attributes.
	 * @param value Value of the field.
	 */
	publishPropertyValueToSection: (key: String, value: any) => void,

	/**
	 * Returns value of lookup.
	 * @param columnName Name of lookup column.
	 * @param safe Enable safe mode.
	 * @throws {Terrasoft.exceptions.UnsupportedTypeException} Throws exception UnsupportedTypeException if argument is not lookup and safe is false.
	 * @return Lookup value.
	 */
	getLookupValue: (columnName: String, safe?: Boolean) => any

	/**
	 * Fills lookup field.
	 * @param name Entity schema name
	 * @param value Entity value.
	 * @param callback Callback-function.
	 * @param scope Execution context.
	 */
	loadLookupDisplayValue: (name: String, value: any, callback?: Function, scope?: any) => void

	/**
	 * Displays an information window.
	 * @param aption Information in the window.
	 * @param handler The method is called when you press the button or the ESC key.
	 * @param cfg Config.
	 */
	showInformationDialog: (caption: String, handler?: Function, cfg?: Object) => void

	/**
	 * Returns true if the passed value is empty, false otherwise.
	 * @param value Expected value.
	 * @returns Check value is empty.
	 */
	isEmpty: (value: any) => Boolean

	/**
	 * Call the "parent" method of the current method. That is the method previously
	 * overridden by derivation or by an override.
	 *
	 *      Ext.define('My.Base', {
	 *          constructor: function (x) {
	 *              this.x = x;
	 *          },
	 *
	 *          statics: {
	 *              method: function (x) {
	 *                  return x;
	 *              }
	 *          }
	 *      });
	 *
	 *      Ext.define('My.Derived', {
	 *          extend: 'My.Base',
	 *
	 *          constructor: function () {
	 *              this.callParent([21]);
	 *          }
	 *      });
	 *
	 *      var obj = new My.Derived();
	 *
	 *      alert(obj.x);  // alerts 21
	 *
	 * This can be used with an override as follows:
	 *
	 *      Ext.define('My.DerivedOverride', {
	 *          override: 'My.Derived',
	 *
	 *          constructor: function (x) {
	 *              this.callParent([x*2]); // calls original My.Derived constructor
	 *          }
	 *      });
	 *
	 *      var obj = new My.Derived();
	 *
	 *      alert(obj.x);  // now alerts 42
	 *
	 * This also works with static methods.
	 *
	 *      Ext.define('My.Derived2', {
	 *          extend: 'My.Base',
	 *
	 *          statics: {
	 *              method: function (x) {
	 *                  return this.callParent([x*2]); // calls My.Base.method
	 *              }
	 *          }
	 *      });
	 *
	 *      alert(My.Base.method(10);     // alerts 10
	 *      alert(My.Derived2.method(10); // alerts 20
	 *
	 * Lastly, it also works with overridden static methods.
	 *
	 *      Ext.define('My.Derived2Override', {
	 *          override: 'My.Derived2',
	 *
	 *          statics: {
	 *              method: function (x) {
	 *                  return this.callParent([x*2]); // calls My.Derived2.method
	 *              }
	 *          }
	 *      });
	 *
	 *      alert(My.Derived2.method(10); // now alerts 40
	 *
	 * To override a method and replace it and also call the superclass method, use callSuper.
	 * This is often done to patch a method to fix a bug.
	 *
	 * @param args The arguments, either an array or the `arguments` object
	 * from the current method, for example: `this.callParent(arguments)`
	 * @return Returns the result of calling the parent method
	 */
	callParent: (...args: any[]) => any | void

	/**
	 * This method is used by an override to call the superclass method but bypass any
	 * overridden method. This is often done to "patch" a method that contains a bug
	 * but for whatever reason cannot be fixed directly.
	 * 
	 * Consider:
	 * 
	 *      Ext.define('Ext.some.Class', {
	 *          method: function () {
	 *              console.log('Good');
	 *          }
	 *      });
	 * 
	 *      Ext.define('Ext.some.DerivedClass', {
	 *          method: function () {
	 *              console.log('Bad');
	 * 
	 *              // ... logic but with a bug ...
	 *              
	 *              this.callParent();
	 *          }
	 *      });
	 * 
	 * To patch the bug in `DerivedClass.method`, the typical solution is to create an
	 * override:
	 * 
	 *      Ext.define('App.paches.DerivedClass', {
	 *          override: 'Ext.some.DerivedClass',
	 *          
	 *          method: function () {
	 *              console.log('Fixed');
	 * 
	 *              // ... logic but with bug fixed ...
	 *
	 *              this.callSuper();
	 *          }
	 *      });
	 * 
	 * The patch method cannot use `callParent` to call the superclass `method` since
	 * that would call the overridden method containing the bug. In other words, the
	 * above patch would only produce "Fixed" then "Good" in the console log, whereas,
	 * using `callParent` would produce "Fixed" then "Bad" then "Good".
	 *
	 * @param args The arguments, either an array or the `arguments` object
	 * from the current method, for example: `this.callSuper(arguments)`
	 * @return Returns the result of calling the superclass method
	 */
	callSuper: (...args: any[]) => any | void
}

// declare type Methods<TAttributes extends Attributes> = {
// 	[key: string]: (this: SchemaMethodContext<TAttributes>) => any
// }

// declare type SchemaMethodContext<T extends Attributes> = {
// 	get: (prop: keyof T) => any
// 	set: (prop: keyof T, value: any, options?: Object) => void
// }

type Message = {
	mode: "ptp" | "broadcast";
	direction: "publish" | "subscribe" | "bidirectional";
}

type Attribute = {
	dataValueType?: Terrasoft.DataValueType
	type?: Terrasoft.ViewModelColumnType
	caption?: BindTo | string
	isRequired?: boolean | string
	dependencies?: Dependency[]
	value?: any
	lookupListConfig?: LookupListConfig
	lookupConfig?: LookupConfig
	initMethod?: string
	referenceSchemaName?: string
	referenceSchema?: ReferenceSchema
	doAutoSave?: boolean
}

type ReferenceSchema = {
	name: string
	primaryColumnName: string
	primaryDisplayColumnName: string
}

type LookupConfig = {
	hierarchical?: boolean
}

type LookupListConfig = {
	columns?: string[]
	filters?: Function[]
	orders?: ColumnOrder[]
	filter?: Function | string
	hideActions?: boolean
}

type ColumnOrder = {
	columnPath: string
	direction?: number
}

type Dependency = {
	columns: string[]
	methodName: string
}

type BindTo = {
	bindTo: string
	bindConfig?: BindConfig
}

type BindConfig = {
	converter: string | BooleanFunction
}

type Detail = {
	schemaName: string
	entitySchemaName?: string
	captionName?: string
	filterMethod?: string
	filter?: {
		detailColumn: string
		masterColumn: string
	}
	defaultValues?: {
		[key: string]: {
			masterColumn: string
		}
	}
	options?: {
		[key: string]: any
	}
}

type Diff = {
	operation: "remove" | "merge" | "insert" | "move"
	name: string
}

type RemoveDiff = {
	operation: "remove"
	properties?: string[]
	parentName?: string
}

type MergeDiff = {
	operation: "merge"
}

type MoveDiff = {
	operation: "move"
	index: number
}

type InsertDiff = {
	operation: "insert"
	values:
	| DiffValues<Terrasoft.ViewItemType.GRID_LAYOUT, 0, ViewItemDefinitions>
	| DiffValues<Terrasoft.ViewItemType.TAB_PANEL, 1, ViewItemDefinitions>
	| DiffValues<Terrasoft.ViewItemType.DETAIL, 2, ViewItemDefinitions>
	| DiffValues<Terrasoft.ViewItemType.MODEL_ITEM, 3, ViewItemDefinitions>
	| DiffValues<Terrasoft.ViewItemType.MODULE, 4, ViewItemDefinitions>
	| DiffValues<Terrasoft.ViewItemType.BUTTON, 5, ViewItemDefinitions>
	| DiffValues<Terrasoft.ViewItemType.LABEL, 6, ViewItemDefinitions>
	| DiffValues<Terrasoft.ViewItemType.CONTAINER, 7, ViewItemDefinitions>
	| DiffValues<Terrasoft.ViewItemType.MENU, 8, ViewItemDefinitions>
	| DiffValues<Terrasoft.ViewItemType.MENU_ITEM, 9, ViewItemDefinitions>
	| DiffValues<Terrasoft.ViewItemType.MENU_SEPARATOR, 10, ViewItemDefinitions>
	| DiffValues<Terrasoft.ViewItemType.SECTION_VIEWS, 11, ViewItemDefinitions>
	| DiffValues<Terrasoft.ViewItemType.SECTION_VIEW, 12, ViewItemDefinitions>
	| DiffValues<Terrasoft.ViewItemType.GRID, 13, ViewItemDefinitions>
	| DiffValues<Terrasoft.ViewItemType.SCHEDULE_EDIT, 14, ViewItemDefinitions>
	| DiffValues<Terrasoft.ViewItemType.CONTROL_GROUP, 15, ViewItemDefinitions>
	| DiffValues<Terrasoft.ViewItemType.RADIO_GROUP, 16, ViewItemDefinitions>
	| DiffValues<Terrasoft.ViewItemType.DESIGN_VIEW, 17, ViewItemDefinitions>
	| DiffValues<Terrasoft.ViewItemType.COLOR_BUTTON, 18, ViewItemDefinitions>
	| DiffValues<Terrasoft.ViewItemType.IMAGE_TAB_PANEL, 19, ViewItemDefinitions>
	| DiffValues<Terrasoft.ViewItemType.HYPERLINK, 20, ViewItemDefinitions>
	| DiffValues<Terrasoft.ViewItemType.INFORMATION_BUTTON, 21, ViewItemDefinitions>
	| DiffValues<Terrasoft.ViewItemType.TIP, 22, ViewItemDefinitions>
	| DiffValues<Terrasoft.ViewItemType.COMPONENT, 23, ViewItemDefinitions>
	| DiffValues<Terrasoft.ViewItemType.PROGRESS_BAR, 30, ViewItemDefinitions>
}

type DiffValues<T, K, Info> = { itemType: K; } & Info[keyof Info & T];

interface ViewItemDefinitions {
	[Terrasoft.ViewItemType.GRID_LAYOUT]: {
		id?: String,
		items?: Array<Object>,
		tools?: Array<Object>,
		style?: Terrasoft.TipStyle,
		collapseEmptyRow?: boolean,
		behaviour?: {
			displayEvent?: Terrasoft.TipDisplayEvent
		}
		hideOnScroll?: boolean,
		allowOverlap?: boolean,
		isViewMode?: boolean,
		layout?: Layout,
		controlConfig?: Object,
		visible?: BindTo | Boolean,
		classes?: Classes,
		selectors?: {
			wrapEl?: String
		},
		markerValue?: BindTo | String,
		tag?: any,
		maskVisible?: BindTo | String,
	}
	[Terrasoft.ViewItemType.TAB_PANEL]: {
		generateId?: Boolean,
		id?: String,
		selectors?: {
			wrapEl?: String
		},
		classes?: Classes,
		collection?: BindTo | String,
		tabRender?: BindTo | String,
		activeTabChange?: BindTo | String,
		collapsedchanged?: BindTo | String,
		activeTabName?: BindTo | String,
		collapsed?: BindTo | String,
		collection?: BindTo | String,
		afterrerender?: BindTo | String,
		isScrollVisible?: BindTo | Boolean,
		visible?: BindTo | Boolean,
		activeTabClass?: String,
		defaultMarkerValueColumnName?: String,
		isCollapseButtonVisible?: Boolean,
		tabs?: Object[],
		controlConfig?: Object,
	}
	[Terrasoft.ViewItemType.DETAIL]: {
		markerValue?: BindTo | String,
		layout?: Layout,
		visible?: BindTo | Boolean,
		classes?: Classes,
	}
	[Terrasoft.ViewItemType.BUTTON]: {
		caption?: BindTo | string,
		hint?: BindTo | string,
		groupName?: string,
		tips?: Tip[],
		visible?: BindTo | Boolean,
		enabled?: BindTo | Boolean,
		click?: BindTo | String,
		pressed?: BindTo | String,
		imageConfig?: BindTo | String,
		style?: BindTo | Terrasoft.controls.ButtonEnums.style | string,
		styles?: Object,
		selectors?: {
			wrapEl?: String
		},
		iconAlign?: Terrasoft.controls.ButtonEnums.iconAlign,
		classes?: Classes,
		clickDebounceTimeout?: Number,
		layout?: Layout,
		id?: String,
		tag?: any,
		markerValue?: BindTo | String,
		prepareMenu?: BindTo | string,
		menu?: {
			classes?: Classes,
			ulClass?: String,
			items: BindTo | Object[]
		} | any[],
		extendedMenu?: {
			Name?: String,
			PropertyName?: String,
			Click?: BindTo
		},
		controlConfig?: Object,
		generateId?: Boolean,
		fileUpload?: Boolean,
		fileUploadMultiSelect?: Boolean,
		fileTypeFilter?: String[],
		filesSelected?: BindTo | string
	}
	[Terrasoft.ViewItemType.LABEL]: {
		generateId?: Boolean,
		id?: String,
		caption?: BindTo | string,
		markerValue?: BindTo | String,
		labelClass?: String[],
		visible?: BindTo | Boolean,
		click?: BindTo | String,
		isRequired?: Boolean,
		isMultiline?: Boolean,
		contentVisible?: Boolean,
		layout?: Layout,
		id?: String,
		className?: String,
		styles?: Object,
		classes?: Classes,
		tips?: Tip[],
		labelConfig?: {
			classes?: String[]
		},
		selectors?: {
			wrapEl?: String
		},
		items?: Array<Object>,
	}
	[Terrasoft.ViewItemType.CONTAINER]: {
		wrapClass?: String[]
		layout?: Layout,
		items?: Array<Object>,
		id?: String,
		visible?: BindTo | Boolean,
		selectors?: {
			wrapEl?: String
		},
		beforererender?: BindTo | string,
		afterrender?: BindTo | string,
		afterrerender?: BindTo | string,
		styles?: Object,
		controlConfig?: Object,
	}
}

type Tip = {
	name?: String,
	content?: String
}

type Layout = {
	colSpan?: Number
	rowSpan?: Number
	column?: Number
	row?: Number
	layoutName?: String
}

type Classes = {
	wrapClassName?: String[],
	wrapperClass?: String[],
	pressedClass?: String[],
	imageClass?: String[],
	menuClass?: String[],
	textClass?: String[] | String
};

// type ComponentValues = {
// 	itemType: Terrasoft.ViewItemType
// 	visible?: BindTo | boolean,
// 	enabled?: BindTo | boolean,
// 	tag?: string,
// 	markerValue?: string,
// 	maskVisible?: BindTo | boolean,
// 	markerValue?: BindTo | boolean,
// 	domAttributes?: BindTo | boolean,
// 	wrapStyle?: BindTo | boolean,
// 	classes?: object
// 	styles?: object
// }

declare function define(name: string, deps: string[], callback: (...args: any) => Schema): void;

/**
 * @typedef {object} Diff
 * @property {"remove" | "merge" | "insert" | "move"} operation
 * @property {string} name
 * @property {string} [bindTo]
 * @property {number} [index]
 * @property {string} [parentName]
 * @property {string} [propertyName]
 * @property {DiffValues | ButtonValues | GridLayoutValues} [values]
 */

/**
 * @typedef {object} DiffValues
 * @property {Layout} [layout]
 * @property {number} [itemType] Terrasoft.ViewItemType
 * @property {number} [contentType] Terrasoft.ContentType
 * @property {string} [tag]
 * @property {string} [id]
 * @property {Object.<string, BindTo | number | string | boolean>} [controlConfig]
 */

/**
 * @typedef ButtonValues
 * @property {5} itemType  Terrasoft.ViewItemType.BUTTON
 * @property {BindTo | string} caption
 * @property {BindTo} click
 * @property {string} style Terrasoft.controls.ButtonEnums.style
 * @property {{textClass: Array<string>}} classes
 */

/**
 * @typedef GridLayoutValues
 * @property {0} itemType  Terrasoft.ViewItemType.GRID_LAYOUT
 * @property {Array} [items]
 * @property {boolean} [collapseEmptyRow]
 */

/**
 * @typedef {object} Layout
 * @property {number} [colSpan]
 * @property {number} [rowSpan]
 * @property {number} [column]
 * @property {number} [row]
 * @property {string} [layoutName]
 */

/**
 * @callback defineSchema
 * @param {string} name
 * @param {Array<string>} deps
 * @param {function(...): Schema} callback
 * @returns {void}
 */