/// <reference path="terrasoft.constant.d.ts" />
/// <reference path="terrasoft.enum.d.ts" />

namespace Terrasoft {

	/**
	 * Creates a new instance of the filter group
	 * @returns Collection of filters
	 */
	function createFilterGroup(): Terrasoft.FilterGroup

	/**
	 * Creates a Compare-Filter instance
	 * @param comparisonType Type of comparison operation
	 * @param leftExpression Expression to check in the filter
	 * @param rightExpression Filter expression
	 * @returns Returns the created filter object
	 */
	function createCompareFilter(
		comparisonType: Terrasoft.ComparisonType,
		leftExpression: Terrasoft.BaseExpression,
		rightExpression: Terrasoft.BaseExpression
	): Terrasoft.CompareFilter

	/**
	 * Creates an instance of the Between-Filter
	 * @param leftExpression Expression to check in the filter
	 * @param rightLessExpression The initial expression of the filtering range
	 * @param rightGreaterExpression The final expression of the filtering range
	 * @returns Returns the created filter object
	 */
	function createBetweenFilter(
		leftExpression: Terrasoft.BaseExpression, 
		rightLessExpression: Terrasoft.BaseExpression, 
		rightGreaterExpression: Terrasoft.BaseExpression
	): Terrasoft.BetweenFilter

	/**
	 * Creates an IsNull filter instance
	 * @param leftExpression The expression to be checked for being "empty"
	 * @returns Returns the created filter object
	 */
	function createIsNullFilter(leftExpression: Terrasoft.BaseExpression): Terrasoft.IsNullFilter

	/**
	 * Creates an IsNull filter instance
	 * @param leftExpression The expression to be checked for "not empty"
	 * @returns Returns the created filter object
	 */
	function createIsNotNullFilter(leftExpression: Terrasoft.BaseExpression): Terrasoft.IsNullFilter

	/**
	 * Creates an instance of an "In" Filter
	 * @param leftExpression Expression to check in the filter
	 * @param rightExpressions An array of expressions, which will be compared with leftExpression
	 * @returns Returns the created filter object
	 */
	function createInFilter(
		leftExpression: Terrasoft.BaseExpression,
		rightExpressions: Terrasoft.BaseExpression[]
	): Terrasoft.InFilter

	/**
	 * Creates a Compare-Filter instance for comparing the values of two columns
	 * @param comparisonType Type of comparison operation
	 * @param leftColumnPath The path to the checked column relative to the rootSchema root schema
	 * @param rightColumnPath The path to the filter column relative to the rootSchema root schema
	 * @returns Returns the created filter object
	 */
	function createFilter(
		comparisonType: Terrasoft.ComparisonType, 
		leftColumnPath: String, 
		rightColumnPath: String
	): Terrasoft.CompareFilter

	/**
	 * Creates a Compare-Filter instance to compare the column with the specified value.
	 * @param comparisonType The type of comparison operation.
	 * @param columnPath The path to the column to be checked relative to the rootSchema root.
	 * @param paramValue The value of the filter.
	 * @param paramDataType The type of the parameter value.
	 * @returns Returns the created filter object.
	 */
	function createColumnFilterWithParameter(
		comparisonType: Terrasoft.ComparisonType,
		columnPath: String,
		paramValue: any,
		paramDataType: Terrasoft.DataValueType
	): Terrasoft.CompareFilter

	/**
	 * Creates a filter object to compare the primary display column with the value of the parameter.
	 * @param comparisonType Type of comparison.
	 * @param paramValue Parameter value.
	 * @param paramDataType Type of parameter value.
	 * @returns Returns the object of the created filter.
	 */
	function createPrimaryDisplayColumnFilterWithParameter(
		comparisonType: Terrasoft.ComparisonType,
		paramValue: any,
		paramDataType: Terrasoft.DataValueType
	): Terrasoft.CompareFilter

	/**
	 * Creates an instance of the Between-Filter to check whether the column hits the specified range.
	 * @param columnPath The path to the column to be checked relative to the rootSchema root.
	 * @param lessParamValue The initial value of the filter.
	 * @param greaterParamValue The final value of the filter.
	 * @param paramDataType The type of the parameter value.
	 * @returns Returns the created filter object.
	 */
	function createColumnBetweenFilterWithParameters(
		columnPath: String,
		lessParamValue: any,
		greaterParamValue: any,
		paramDataType: Terrasoft.DataValueType
	): Terrasoft.BetweenFilter

	/**
	 * Creates an IsNull filter instance to test the specified column
	 * @param columnPath The path to the checked column relative to the rootSchema root schema
	 * @returns Returns the created filter object
	 */
	function createColumnIsNullFilter(columnPath: String): Terrasoft.IsNullFilter

	/**
	 * Creates an IsNull filter instance to test the specified column
	 * @param columnPath The path to the checked column relative to the rootSchema root schema
	 * @returns Returns the created filter object
	 */
	function createColumnIsNotNullFilter(columnPath: String): Terrasoft.IsNullFilter

	/**
	 * Creates an In-filter instance to verify that the value of the specified column matches the value of one of the parameters.
	 * @param columnPath The path to the column to be checked relative to the rootSchema root.
	 * @param parameterValues An array of parameter values.
	 * @param paramDataType The type of the parameter value.
	 * @throws {Terrasoft.UnsupportedTypeException} If parameterValues is not an array, an exception is thrown.
	 * @returns Returns the created filter object.
	 */
	function createColumnInFilterWithParameters(
		columnPath: String,
		parameterValues: any[],
		paramDataType: Terrasoft.DataValueType
	): Terrasoft.FilterGroup

	/**
	 * Creates an instance of the Exists filter for the type comparison [Exists according to the specified condition] and
	 * sets as the test value the expression of the column located along the specified path
	 * @param columnPath The path to the column for which the filter is built
	 * @param subFilters (Optional) Subquery filters
	 * @throws {Terrasoft.ArgumentNullOrEmptyException} An exception is thrown if no transfer is made columnPath.
	 * @returns Returns the created filter object
	 */
	function createExistsFilter(
		columnPath: String,
		subFilters?: Terrasoft.FilterGroup
	): Terrasoft.ExistsFilter

	/**
	 * Creates an instance of the Exists filter for comparing the type [Does not exist by the specified condition] and
	 * sets as the test value the expression of the column located along the specified path
	 * @param columnPath The path to the column for which the filter is built
	 * @param subFilters (Optional) Subquery filters
	 * @throws {Terrasoft.ArgumentNullOrEmptyException} An exception is thrown if no transfer is made columnPath.
	 * @returns Returns the created filter object
	 */
	function createNotExistsFilter(
		columnPath: String,
		subFilters?: Terrasoft.FilterGroup
	): Terrasoft.ExistsFilter

	/**
	 * Creates a Compare-Filter instance
	 * @param comparisonType Type of comparison operation
	 * @param columnPath Expression to check in the filter
	 * @param datePartType Filter expression
	 * @param datePartValue Parameter value
	 * @returns Returns the created filter object
	 */
	function createDatePartColumnFilter(
		comparisonType: Terrasoft.ComparisonType,
		columnPath: String,
		datePartType: Terrasoft.DatePartType,
		datePartValue: Number
	): Terrasoft.CompareFilter

	/**
	 * Returns the string representation of the right side of the expression
	 * @param filter Filter element
	 * @returns The string representation of the right side of expression
	 */
	function getRightExpressionDisplayValue(filter: Terrasoft.BaseFilter): String

	/**
	 * Returns the value of the right side of expression
	 * @param filter The filter item
	 */
	function getRightExpressionValue(filter: Terrasoft.CompareFilter): any | null

	/**
	 * Checks for the presence of a macro in the filter
	 * @param filter Filter element
	 * @returns Indicates the presence of a macro in the filter
	 */
	function isFilterWithMacros(filter: Terrasoft.BaseFilter): Boolean

	/**
	 * Returns the object of the displayed values of the filter macro
	 * @param filter Filter element
	 * @returns Object of the displayed values of the filter macro
	 */
	function GetRightExpressionMacrosDisplayValues(filter: Terrasoft.BaseFilter): {
		macrosCaption: String,
		macrosParameterCaption: String
	}

	/**
	 * Returns the configuration object for the filter macro type
	 * @param filter Filter element
	 * @throws {Terrasoft.UnsupportedTypeException} If for the filter function type, there is no method to determine the type of the filter macro
	 * @returns settings object for the type of filter macro
	 */
	function GetFilterMacrosConfig(filter: Terrasoft.BaseFilter): Object | undefined

	/**
	 * Returns the type of the filter macro
	 * @param datePartType the date part type
	 * @throws {Terrasoft.UnsupportedTypeException} If the method for determining the type of the filter macro is not found for the date part type
	 * @returns the type of filter macro
	 */
	function GetDatePartTypeFilterMacrosType(datePartType: Terrasoft.DatePartType): Terrasoft.FilterMacrosType

	/**
	 * Returns the configuration object for the specified macro type
	 * @param filterMacrosType macro type
	 * @throws {Terrasoft.UnsupportedTypeException} If no customization object was found for the specified macro type
	 * @returns configuration object
	 */
	function getMacrosTypeConfig(filterMacrosType): Object

	/**
	 * Returns the type of the filter macro
	 * @param queryMacrosType date fragment type
	 * @throws {Terrasoft.UnsupportedTypeException} If the type of the filter macro is not found for the specified query macro type to the object schema
	 * @returns filter macro type 
	 */
	function GetQueryMacrosTypeFilterMacrosType(queryMacrosType): Terrasoft.FilterMacrosType

	/**
	 * Returns the data type for the filter
	 * @param filter Filter
	 * @returns Filter data type
	 */
	function getFilterDataValueType(filter: Terrasoft.BaseFilter): Terrasoft.DataValueType
}