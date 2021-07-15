/// <reference path="terrasoft.constant.d.ts" />
/// <reference path="terrasoft.enum.d.ts" />

namespace Terrasoft {

	/**
	 * Adds days to date.
	 * @param date Date to change.
	 * @param days Number of days.
	 * @returns New date.
	 */
	function addDays(date: Date, days: Number): Date

	/**
	 * Adds minutes to date.
	 * @param date Date to change.
	 * @param minutes Number of minutes.
	 * @returns New date.
	 */
	function addMinutes(date: Date, minutes: Number): Date

	/**
	 * Compares two dates (checks year month and day).
	 * @param date1 Date to compare.
	 * @param date2 Date to compare.
	 * @returns Returns true if values are equal.
	 */
	function areDatesEqual(date1: Date, date2: Date): Boolean

	/**
	 * Returns parameter without seconds and milliseconds.
	 * @param dateValue Date value.
	 * @throws {Terrasoft.exceptions.UnsupportedTypeException} Throws exception UnsupportedTypeException if argument type neither dateValue nor Date.
	 * @returns Parameter without seconds and milliseconds.
	 */
	function clearSeconds(dateValue: Date): Date

	/**
	 * Clears time of date.
	 * @param dateValue Date value.
	 * @returns value with cleared time.
	 */
	function clearTime(dateValue: Date): Date

	/**
	 * Returns date diff in days.
	 * @param startDate Start date value.
	 * @param endDate End date value.
	 * @returns Diff in days.
	 */
	function dateDiffDays(startDate: Date, endDate: Date): Number

	/**
	 * Returns end of day.
	 * @param dateValue Date value.
	 * @returns Date value of end of day (time 23:59:59.999).
	 */
	function endOfDay(dateValue: Date): Date

	/**
	 * Returns end of today.
	 * @returns Date value of end of today (time 23:59:59.999).
	 */
	function endOfToday(): Date

	/**
	 * Returns end of month.
	 * @param dateValue Date value.
	 * @returns Date value of end of month (time 23:59:59.999).
	 */
	function endOfMonth(dateValue: Date): Date

	/**
	 * Returns end of quarter.
	 * @param dateValue Date value.
	 * @returns Date value of end of quarter (time 23:59:59.999).
	 */
	function endOfQuarter(dateValue: Date): Date

	/**
	 * Returns end of week.
	 * @param dateValue Date value.
	 * @returns Date value of end of week (time 23:59:59.999).
	 */
	function endOfWeek(dateValue: Date): Date

	/**
	 * Returns end of year.
	 * @param dateValue Date value.
	 * @returns Date value of end of year (time 23:59:59.999).
	 */
	function endOfYear(dateValue: Date): Date

	/**
	 * Returns number of minutes from midnight.
	 * @param date Date value.
	 * @returns Number of minutes from midnight.
	 */
	function getMinutesFromMidnight(date: Date): Number

	/**
	 * Checks whether date is midnight.
	 * @param date Date to check.
	 * @returns Returns true if date is midnight.
	 */
	function isMidnight(date: Date): Boolean

	/**
	 * Returns string to date.
	 * @param value Date to serialize.
	 * @param format date format.
	 * @param strict flag.
	 * @returns Deserialized date.
	 */
	function parseDate(value: String, format: String, strict: Boolean): Date

	/**
	 * Returns start of day.
	 * @param dateValue Date value.
	 * @returns Date value with empty time.
	 */
	function startOfDay(dateValue: Date): Date

	/**
	 * Returns start of month.
	 * @param dateValue Date value.
	 * @returns Date value with empty month.
	 */
	function startOfMonth(dateValue: Date): Date

	/**
	 * Returns start of quarter.
	 * @param dateValue Date value.
	 * @returns Date value of start of quarter.
	 */
	function startOfQuarter(dateValue: Date): Date

	/**
	 * Returns start of week.
	 * @param dateValue Date value.
	 * @returns Date value of start of week.
	 */
	function startOfWeek(dateValue: Date): Date

	/**
	 * Returns start of year.
	 * @param dateValue Date value.
	 * @returns Date value of start of year.
	 */
	function startOfYear(dateValue: Date): Date

	/**
	 * Returns string with date in locale format.
	 * 
	 * For example:
	 *
	 * 		var date = new Date(Date.UTC(2016, 01, 20));
	 * 		var options = { weekday: "long", year: "numeric", month: "short", day: "numeric" };
	 * 		Terrasoft.toLocaleDate(date, "en-US", options);
	 *
	 * Returns: 
	 * 
	 * 		"Saturday, Feb 20, 2016"
	 * @param date Date value.
	 * @param culture A string with a BCP 47 language tag.
	 * @param options Converting options.
	 * @returns String with date in locale format.
	 */
	function toLocaleDate(date: Date, culture?: String, options?: Object): String

	/**
	 * Returns date in target time zone.
	 * For example:
	 *
	 * 		var date = new Date(Date.UTC(2016, 01, 20));
	 * 		var timeZone = "UTC";
	 * 		Terrasoft.convertToTimeZone(date, timeZone);
	 * @param date Date value.
	 * @param targetTimeZone time zone name.
	 * @param currentUserTimeZoneOffset time zone offset in minutes
	 * @returns instance of Date in target time zone.
	 */
	function convertToTimeZone(
		date: Date,
		targetTimeZone: String,
		currentUserTimeZoneOffset: Number
	): Date

	/**
	 * string represent of date in ISO 8601 without time zone specification.
	 * For example:
	 *
	 * 		var date = new Date(2018, 01, 20, 15, 10, 30);
	 * 		Terrasoft.toLocalISOString(date);
	 * 
	 * Returns:
	 * 
	 * 		"2018-02-20T15:10:30"
	 * @param date Date value.
	 * @returns string represent of date in ISO 8601.
	 */
	function toLocalISOString(date: Date): String

	/**
	 * String represent of date in user culture settings.
	 * For example:
	 *
	 * 		Terrasoft.Resources.CultureSettings.dateFormat = "Y/m/d";
	 * 		Terrasoft.Resources.CultureSettings.timeFormat = "G|i|s";
	 * 		var date = new Date(2018, 0, 29, 20, 57, 1);
	 * 		Terrasoft.toCultureDateTime(date);
	 *
	 * Returns:
	 * 
	 * 		"2018/01/29 20|57|01"
	 * @param date Date value.
	 * @returns string represent of date in user culture settings.
	 */
	function toCultureDateTime(date: Date): String
}