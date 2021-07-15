Ext.ns("Terrasoft.utils.guid");

/**
 * @singleton
 */

/**
 * Generates GUID value according to the provided format specifier.
 * @param {String} [format] A single format specifier that indicates how to format the value of this Guid.
 * The format parameter can be "N", "D", "B", "P". If format is null or an empty string (""), "D" is used.
 * Example:
 *
 *     Terrasoft.formatGUID(value) returns 00000000-0000-0000-0000-000000000000
 *     Terrasoft.formatGUID(value, "N") returns 00000000000000000000000000000000
 *     Terrasoft.formatGUID(value, "B") returns {00000000-0000-0000-0000-000000000000}
 *     Terrasoft.formatGUID(value, "P") returns (00000000-0000-0000-0000-000000000000)
 *
 */
Terrasoft.generateGUID = function (format) {
  var idGenerator = Ext.data.IdGenerator.get("uuid");
  var id = idGenerator.generate();
  return Terrasoft.formatGUID(id, format);
};

/**
 * Alias for {@link Terrasoft#generateGUID}
 * @member Terrasoft.utils.guid
 * @method generateGUID
 * @inheritdoc Terrasoft#generateGUID
 */
Terrasoft.utils.guid.generateGUID = Terrasoft.generateGUID;

/**
 * Returns formatted GUID value.
 * @param {String} value GUID value string.
 * @param {String} format A single format specifier that indicates how to format the value of this GUID.
 * The format parameter can be "N", "D", "B", "P". If format is null or an empty string (""), "D" is used.
 * Example:
 *
 *     Terrasoft.formatGUID(value) returns 00000000-0000-0000-0000-000000000000
 *     Terrasoft.formatGUID(value, "D") returns 00000000-0000-0000-0000-000000000000
 *     Terrasoft.formatGUID(value, "N") returns 00000000000000000000000000000000
 *     Terrasoft.formatGUID(value, "B") returns {00000000-0000-0000-0000-000000000000}
 *     Terrasoft.formatGUID(value, "P") returns (00000000-0000-0000-0000-000000000000)
 *
 */
Terrasoft.formatGUID = function (value, format) {
  switch (format) {
    case "N":
      return value.replace(/-/g, "");
    case "B":
      return "{" + value + "}";
    case "P":
      return "(" + value + ")";
    case "D":
      return value;
    default:
      return value;
  }
};

/**
 * Checks whether string is empty GUID.
 * @param {String} value String representation of GUID.
 * @return {Boolean} Returns true if argument is empty GUID.
 */
Terrasoft.isEmptyGUID = function (value) {
  var reg = new RegExp("^(0){8}-(0){4}-(0){4}-(0){4}-(0){12}$");
  return reg.test(value);
};

/**
 * Alias for {@link Terrasoft.utils.guid#isEmptyGUID}
 * @member Terrasoft.utils.guid
 * @method isEmptyGUID
 * @inheritdoc Terrasoft#isEmptyGUID
 */
Terrasoft.utils.guid.isEmptyGUID = Terrasoft.isEmptyGUID;

/**
 * Checks whether string is GUID.
 * @param {String} value String representation of GUID.
 * @return {Boolean} Returns true if argument is GUID.
 */
Terrasoft.isGUID = function (value) {
  var uidRe = new RegExp("^[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}$", "ig");
  return uidRe.test(value);
};

/**
 * Alias for {@link Terrasoft.utils.guid#isGUID}
 * @member Terrasoft.utils.guid
 * @method isGUID
 * @inheritdoc Terrasoft#isGUID
 */
Terrasoft.utils.guid.isGUID = Terrasoft.isGUID;