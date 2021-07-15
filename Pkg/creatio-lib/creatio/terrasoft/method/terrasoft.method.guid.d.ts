/// <reference path="terrasoft.constant.d.ts" />
/// <reference path="terrasoft.enum.d.ts" />

namespace Terrasoft {

	/**
	 * Generates GUID value according to the provided format specifier.
	 * 
	 * The format parameter can be "N", "D", "B", "P". If format is null or an empty string (""), "D" is used.
	 * 
	 * For example:
	 * 
	 * 		Terrasoft.generateGUID();	   // 00000000-0000-0000-0000-000000000000
	 * 		Terrasoft.generateGUID("D");	// 00000000-0000-0000-0000-000000000000
	 * 		Terrasoft.generateGUID("N");	// 00000000000000000000000000000000
	 * 		Terrasoft.generateGUID("B");	// {00000000-0000-0000-0000-000000000000}
	 * 		Terrasoft.generateGUID("P");	// (00000000-0000-0000-0000-000000000000)
	 * 
	 * @param format A single format specifier that indicates how to format the value of this Guid.
	 */
	function generateGUID(format?: "" | "N" | "D" | "B" | "P"): String

	/**
	 * Returns formatted GUID value.
	 * 
	 * The format parameter can be "N", "D", "B", "P". If format is null or an empty string (""), "D" is used.
	 * 
	 * For example:
	 *
	 * 		Terrasoft.formatGUID(value);		 // 00000000-0000-0000-0000-000000000000
	 * 		Terrasoft.formatGUID(value, "D");	// 00000000-0000-0000-0000-000000000000
	 * 		Terrasoft.formatGUID(value, "N");	// 00000000000000000000000000000000
	 * 		Terrasoft.formatGUID(value, "B");	// {00000000-0000-0000-0000-000000000000}
	 * 		Terrasoft.formatGUID(value, "P");	// (00000000-0000-0000-0000-000000000000)
	 *
	 * @param value GUID value string.
	 * @param format A single format specifier that indicates how to format the value of this GUID.
	 */
	function formatGUID(value: String, format?: "" | "N" | "D" | "B" | "P"): String

	/**
	 * Checks whether string is empty GUID.
	 * @param value String representation of GUID.
	 * @returns Returns true if argument is empty GUID.
	 */
	function isEmptyGUID(value: String): Boolean

	/**
	 * Checks whether string is GUID.
	 * @param value String representation of GUID.
	 * @returns Returns true if argument is GUID.
	 */
	function isGUID(value: String): Boolean
}