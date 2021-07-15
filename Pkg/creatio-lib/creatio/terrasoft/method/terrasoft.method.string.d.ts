/// <reference path="terrasoft.constant.d.ts" />
/// <reference path="terrasoft.enum.d.ts" />

namespace Terrasoft {

	/**
	 * Performs parametrized replace in string.
	 * 
	 * For example:
	 * 
	 * 		Terrasoft.getFormattedString('some {0} text {1}', 'good', 'allowed')
	 * 
	 * Result: 'some good text allowed'
	 * @param string String to format.
	 * @return Formatted string.
	 */
	function getFormattedString(string: String): String

	/**
	 * Returns string representation of value.
	 * @throws {Terrasoft.exceptions.ItemNotFoundException}
	 * @param value Value to transform.
	 * @param type Value datatype.
	 * @param config String format config.
	 * @returns Value string representation.
	 */
	function getTypedStringValue(value: Number | String | Object | Boolean | Date, type: Terrasoft.DataValueType, config: Object): String

	/**
	 * Creates string of given length consisting of given character.
	 * 
	 * For example: 
	 * 
	 * 		Terrasoft.getUniformString(5, 'a')
	 * Result: 'aaaaa'
	 * @param length String length.
	 * @param symbol Character to fill string.
	 * @return String of given length and given character.
	 */
	function getUniformString(length: Number, symbol: Symbol): String
	
	/**
	 * Checks whether string is valid URL.
	 * @param value String representation of URL.
	 * @returns Returns true if string is valid URL.
	 */
	function isUrl(value: String): Boolean

	/**
	 * Adds missing number of characters in the beginning of the string.
	 * @param value Source string.
	 * @param length Required length of result string.
	 * @param symbol Symbol to add to string (optional).
	 * @return String of required length.
	 */
	function pad(value: String, length: Number, symbol?: String): String

	/**
	 * Performs reverse of string.
	 *
	 * For example:
	 * 
	 * 		Terrasoft.reverseStr('1234')
	 * Result: '4321'
	 * @param str 
	 * @returns Reversed string.
	 */
	function reverseStr(str: String): String

	/**
	 * Returns copy of string transformed to lowerCamelCase.
	 * @param value Source string.
	 * @returns String transformed to lowerCamelCase.
	 */
	function toLowerCamelCase(value: String): String

	/**
	 * Returns copy of string transformed to camelCase.
	 * @param value Source string.
	 * @returns String transformed to camelCase.
	 */
	function toCamelCase(value: String): String

	/**
	 * Returns string with converted eol char to unix style.
	 * @param value Source string.
	 * @returns String converted eol char to unix style.
	 */
	function convertEolToUnix(value: String): String

	/**
	 * Checks whether string is serialized JSON object.
	 * @param value Value to check.
	 * @param checksPropertyNamesOnQuotes Flag that indicates whether to check property names on quotes. Default true.
	 * @returns String is serialized JSON object.
	 */
	function isJsonObject(value: String, checksPropertyNamesOnQuotes?: Boolean): Boolean

	/**
	 * Determines whether one string may be found within another string, returning true or false as appropriate.
	 * @param sourceString String to search inside.
	 * @param searchString String to search for.
	 * @returns True if the given string is found anywhere within the search string, otherwise, false if not.
	 */
	function includes(sourceString: String, searchString: String): Boolean

	/**
	 * Checks the string contains RTL characters.
	 * @param sourceString Source string.
	 * @returns True if string contains RTL characters.
	 */
	function containsRtlChars(sourceString: String): Boolean

	/**
	 * Gets direction of the source text.
	 * @param text Source text.
	 * @returns Direction of the source text.
	 */
	function getTextDirection(text: String): "rtl" | "ltr" | null

	/**
	 * Gets random string.
	 * @returns Random string.
	 */
	function randomString(): String

	/**
	 * Wraps a specified array of words into lines.
	 * @param text The text to wrap.
	 * @param config The configuration of text wrap.
	 * @param config.maxLinesCount The maximum number of lines.
	 * @param config.textSeparator The text separators. Default value is ' '.
	 * @param config.maxLineLength The maximum length of line. Default value is 10.
	 * @returns An array of lines, each line is an array of words.
	 */
	function wrapTextIntoLines(text: String, config: {
		maxLinesCount: Number, 
		textSeparator?: Number, 
		maxLineLength?: Number
	}): String[][]

	/**
	 * Determines whether a string ends with the characters of a specified string.
	 * @param source Source string.
	 * @param search Search string.
	 * @returns String ends with the characters of a specified string.
	 */
	function endsWith(source: String, search: String): Boolean
}