/// <reference path="terrasoft.constant.d.ts" />
/// <reference path="terrasoft.enum.d.ts" />

namespace Terrasoft {

	/**
	 * Converts server datatype to client datatype.
	 * @param dataValueType Datatype.
	 * @throws {Terrasoft.ItemNotFoundException} Client datatype not found.
	 * @returns Client datatype.
	 */
	function convertToClientDataValueType(dataValueType: Terrasoft.ServerDataValueType): Terrasoft.DataValueType

	/**
	 * Converts client datatype to server datatype.
	 * @param dataValueType Datatype.
	 * @throws {Terrasoft.ItemNotFoundException} Server datatype not found.
	 * @returns Server datatype.
	 */
	function convertToServerDataValueType(dataValueType: Terrasoft.DataValueType): Terrasoft.ServerDataValueType

	/**
	 * Retuns image name by datayype.
	 * @param dataValueType Datatype.
	 * @returns Icon name.
	 */
	function getImageNameByDataValueType(dataValueType: Terrasoft.DataValueType): String

	/**
	 * Checks whether datatype is in datetime types group.
	 * @param dataValueType Datatype.
	 * @returns Returns true if datatype is in datetime types group.
	 */
	function isDateDataValueType(dataValueType: Terrasoft.DataValueType): Boolean

	/**
	 * Checks whether object is instance of class.
	 * @param instance Object instance.
	 * @param className Class name.
	 * @returns Returns true if object is instance of class.
	 */
	function isInstanceOfClass(instance: Object, className: String): Boolean

	/**
	 * Checks whether datatype is in lookup types group.
	 * @param dataValueType Datatype.
	 * @returns Returns true if datatype is in lookup types group.
	 */
	function isLookupDataValueType(dataValueType: Terrasoft.DataValueType): Boolean

	/**
	 * Checks whether datatype is in numeric types group.
	 * @param dataValueType Datatype.
	 * @returns Returns true if datatype is in numeric types group.
	 */
	function isNumberDataValueType(dataValueType: Terrasoft.DataValueType): Boolean

	/**
	 * Checks whether datatype is in text types group.
	 * @param dataValueType Datatype.
	 * @returns Returns true if datatype is in text types group.
	 */
	function isTextDataValueType(dataValueType: Terrasoft.DataValueType): Boolean

	/**
	 * Checks whether datatype is in boolean type.
	 * @param dataValueType Datatype.
	 * @returns Returns true if datatype is boolean.
	 */
	function isBooleanDataValueType(dataValueType: Terrasoft.DataValueType): Boolean

	/**
	 * Checks whether dataValueType is GUID.
	 * @param dataValueType Datatype.
	 * @returns Returns true if dataValueType is GUID.
	 */
	function isGUIDDataValueType(dataValueType: Terrasoft.DataValueType): Boolean

	/**
	 * Checks whether dataValueType is lookup or GUID.
	 * @param dataValueType Datatype.
	 * @returns Returns true if dataValueType is GUID or Lookup.
	 */
	function isLookupValidator(dataValueType: Terrasoft.DataValueType): Boolean

	/**
	 * Checks whether datatype is image.
	 * @param dataValueType Datatype.
	 * @returns Returns true if datatype is image.
	 */
	function isImageDataValueType(dataValueType: Terrasoft.DataValueType): Boolean

	/**
	 * Checks whether datatype is object.
	 * @param dataValueType Datatype.
	 * @returns Returns true if datatype is object.
	 */
	function isEntityDataValueType(dataValueType: Terrasoft.DataValueType): Boolean

	/**
	 * Checks whether datatype is collection of objects.
	 * @param dataValueType Datatype.
	 * @returns Returns true if datatype is collection of objects.
	 */
	function isEntityCollectionDataValueType(dataValueType: Terrasoft.DataValueType): Boolean

	/**
	 * Checks whether datatype is Integer.
	 * @param dataValueType Datatype.
	 * @returns Returns true if datatype is Integer.
	 */
	function isIntegerDataValueType(dataValueType: Terrasoft.DataValueType): Boolean

	/**
	 * Checks whether datatype is valid for mapping on time field.
	 * @param dataValueType Datatype.
	 * @returns Returns true if datatype is valid for mapping on time field.
	 */
	function isValidForMappingOnTimeDataValueType(dataValueType: Terrasoft.DataValueType): Boolean

	/**
	 * Checks whether datatype is valid for mapping on Date field.
	 * @param dataValueType Datatype.
	 * @returns Returns true if datatype is valid for mapping on time field.
	 */
	function isValidForMappingOnDateDataValueType(dataValueType: Terrasoft.DataValueType): Boolean

	/**
	 * Checks whether datatype is in money compatible types group.
	 * @param dataValueType Datatype.
	 * @returns Returns true if datatype is in money compatible types group.
	 */
	function isMoneyCompatibleDataValueType(dataValueType: Terrasoft.DataValueType): Boolean

	/**
	 * Validates class of instance.
	 * @param object Class instance.
	 * @param className Class name.
	 * @throws {Terrasoft.UnsupportedTypeException} if element with such index is not found.
	 * @returns Returns true if object is instance of class.
	 */
	function validateObjectClass(object, className): Boolean

	/**
	 * Returns function for validation data value type.
	 * @param dataValueType value type.
	 * @returns dataValueTypeValidator.
	 */
	function findDataValueTypeValidator(dataValueType: Terrasoft.DataValueType): ((dataValueType: Terrasoft.DataValueType) => Boolean) | null

	/**
	 * Converts data value type to sys settings value type group.
	 * @param dataValueType Data value type.
	 */
	function getSysSettingsValueTypeGroup(dataValueType: Terrasoft.DataValueType): String[]

	/**
	 * Returns data value type caption from it`s enum value.
	 * @param dataValueType Data value type to convert.
	 * @returns Data value type caption.
	 */
	function getDataValueTypeCaption(dataValueType: Terrasoft.DataValueType): String | null

	/**
	 * Returns data value type group for given data value type.
	 * @param dataValueType Datatype.
	 * @returns Data value type group.
	 */
	function toDataValueTypeGroup(dataValueType: Terrasoft.DataValueType): Terrasoft.DataValueType[]

	namespace utils.dataValueType {
		/**
		 * Array of Number data types.
		 */
		const NumberDataValueTypes = [
			Terrasoft.DataValueType.INTEGER,
			Terrasoft.DataValueType.MONEY,
			Terrasoft.DataValueType.FLOAT,
			Terrasoft.DataValueType.FLOAT1,
			Terrasoft.DataValueType.FLOAT2,
			Terrasoft.DataValueType.FLOAT3,
			Terrasoft.DataValueType.FLOAT4
		];

		/**
		 * Array of date time data types.
		 */
		const DateDataValueTypes = [
			Terrasoft.DataValueType.DATE,
			Terrasoft.DataValueType.DATE_TIME,
			Terrasoft.DataValueType.TIME
		];

		/**
		 * Lookup mapping data types.
		 */
		const LookupMappingDataValueTypes = [
			Terrasoft.DataValueType.LOOKUP,
			Terrasoft.DataValueType.GUID,
			Terrasoft.DataValueType.ENUM
		];

		/**
		 * Array of money compatible data types.
		 */
		const MoneyCompatibleDataValueTypes = [
			Terrasoft.DataValueType.MONEY,
			Terrasoft.DataValueType.FLOAT,
			Terrasoft.DataValueType.FLOAT1,
			Terrasoft.DataValueType.FLOAT2,
			Terrasoft.DataValueType.FLOAT3,
			Terrasoft.DataValueType.FLOAT4
		];

		/**
		 * Array of Text data types.
		 */
		const TextDataValueTypes = [
			Terrasoft.DataValueType.TEXT,
			Terrasoft.DataValueType.SHORT_TEXT,
			Terrasoft.DataValueType.MEDIUM_TEXT,
			Terrasoft.DataValueType.MAXSIZE_TEXT,
			Terrasoft.DataValueType.LONG_TEXT,
			Terrasoft.DataValueType.LOCALIZABLE_STRING
		];
	}
}