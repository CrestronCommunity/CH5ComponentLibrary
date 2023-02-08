import { ICh5CommonAttributesSet3 } from "../../ch5-common/interfaces/i-ch5-common-attributes-set3";
import { TCh5SubpageReferenceListOrientation, TCh5SubpageReferenceListStretch, } from './t-ch5-subpage-reference-list';

/**
 * @ignore
 */
export interface ICh5SubpageReferenceListAttributes extends ICh5CommonAttributesSet3 {
  /**
  * @documentation
  * [
  * "`orientation` attribute",
  * "***",
  * "Positions the subpage elements in a horizontal or vertical orientation. Default value is 'horizontal'."
  * ]
  * @name orientation
  * @default horizontal
  * @attributeType "EnumeratedValue"
  */
  orientation: TCh5SubpageReferenceListOrientation;
  /**
   * @documentation
   * [
   * "`contractName` attribute",
   * "***",
   * "The contract Name is an encapsulated join type that links a smart control with a CED in SIMPL."
   * ]
   * @name contractname
   * @default 
   * @attributeType "String"
   */
  contractName: string;
  /**
   * @documentation
   * [
   * "`endless` attribute",
   * "***",
   * "The default value is false. If false, continued swiping when reaching end of list reveals no items beyond the last. If true, if the attribute is added without a value, the first list item will virtually follow the last item when the end of the list is reached. Swiping towards the beginning of the list items will also show the last item prior to the first. Note: Endless is set to false whenever there are multiple rows and columns."
   * ]
   * @name endless
   * @default false
   * @attributeType "Boolean"
   */
  endless: boolean;
  /**
   * @documentation
   * [
   * "`centerItems` attribute",
   * "***",
   * "It will center the list items, if the number and size of the list items is less than the size of the control. Default value is false."
   * ]
   * @name centeritems
   * @default false
   * @attributeType "Boolean"
   */
  centerItems: boolean;
  /**
   * @documentation
   * [
   * "`rows` attribute",
   * "***",
   * "Sets the number of rows the contents of the list will be divided into.  It can range from 1 to 600 and default value is 1."
   * ]
   * @name rows
   * @default 1
   * @limits [{"min": 1, "max": 600}]
   * @attributeType "Integer"
   */
  rows: number;
  /**
   * @documentation
   * [
   * "`columns` attribute",
   * "***",
   * "Sets the number of columns the contents of the list will be divided into. It can range from 1 to 600 and default value is 1."
   * ]
   * @name columns
   * @default 1
   * @limits [{"min": 1, "max": 600}]
   * @attributeType "Integer"
   */
  columns: number;
  /**
  * @documentation
  * [
  * "`scrollToPosition` attribute",
  * "***",
  * "Indicates the index of the subpage to scrollTo. This is applicable only for single row and column. The default value is 0."
  * ]
  * @name scrolltoposition
  * @default 0   
  * @limits [{"min": 1, "max": 600}]
  * @attributeType "Integer"
  */
  scrollToPosition: number;
  /**
   * @documentation
   * [
   * "`scrollbar` attribute",
   * "***",
   * "Determines whether or not the scrollbar will be visible on the subpage-reference list. Default Value is false."
   * ]
   * @name scrollbar
   * @default false
   * @attributeType "Boolean"
   */
  scrollbar: boolean;
  /**
   * @documentation
   * [
   * "`booleanJoinIncrement` attribute",
   * "***",
   * "The Digital Join Increment will be used to increment the digital joins of each Sub Page reference in the list. If 0, the value of the Join Increment will be used."
   * ]
   * @name booleanjoinincrement
   * @join {"direction": "state", "isContractName": true, "booleanJoin": 1}
   * @attributeType "Join"
   */
  booleanJoinIncrement: string;
  /**
   * @documentation
   * [
   * "`numericJoinIncrement` attribute",
   * "***",
   * "The Analog Join Increment will be used to increment the analog joins of each Sub Page reference in the list. If 0, the value of the Join Increment will be used."
   * ]
   * @name numericjoinincrement
   * @join {"direction": "state", "isContractName": true, "numericJoin": 1}
   * @attributeType "Join"
   */
  numericJoinIncrement: string;
  /**
   * @documentation
   * [
   * "`stringJoinIncrement` attribute",
   * "***",
   * "The Serial Join Increment will be used to increment the serial joins of each Sub Page reference in the list. If 0, the value of the Join Increment will be used."
   * ]
   * @name stringjoinincrement
   * @join {"direction": "state", "isContractName": true, "stringJoin": 1}
   * @attributeType "Join"
   */
  stringJoinIncrement: string;
  /**
   * @documentation
   * [
   * "`subpageReceiveStateEnable` attribute",
   * "***",
   * "Enables use of enable joins on each list item. With this enabled, if a list item is not programmatically driven HIGH through the control system, the list item will be disabled."
   * ]
   * @name subpagereceivestateenable
   * @join {"direction": "state", "isContractName": true, "stringJoin": 1}
   * @attributeType "Join"
   */
  subpageReceiveStateEnable: string;
  /**
   * @documentation
   * [
   * "`subpageReceiveStateShow` attribute",
   * "***",
   * "Enables use of visibility joins on each list item.If a list item is not programmatically driven HIGH through the control system, the list item will not be visible."
   * ]
   * @name subpagereceivestateshow
   * @join {"direction": "state", "isContractName": true, "stringJoin": 1}
   * @attributeType "Join"
   */
  subpageReceiveStateShow: string;
  /**
   * @documentation
   * [
   * "`widgetId` attribute",
   * "***",
   * "It provides the widgetId to be included in the subpage reference."
   * ]
   * @name widgetid
   * @default 
   * @attributeType "String"
   */
  widgetId: string;
  /**
   * @documentation
   * [
   * "`subpageReceiveStateScrollTo` attribute",
   * "***",
   * "It scrolls to the position of the subpage in subpage-reference list based on the signal received."
   * ]
   * @name subpagereceivestatescrollto
   * @join {"direction": "state", "isContractName": true, "numericJoin": 1}
   * @attributeType "Join"
   */
  subpageReceiveStateScrollTo: string;

  /**
   * @documentation
   * [
   * "`stretch` attribute",
   * "***",
   * "The default value is null. Valid values are null and 'both'. NOTE: stretch is set to null whenever there are multiple rows and columns. Stretch attribute is set to both will take more priority than centerItems attribute."
   * ]
   * @name stretch
   * @attributeType "EnumeratedValue"
   */
  stretch: TCh5SubpageReferenceListStretch | null;

  /**
   * @documentation
   * [
   * "`numberOfItems` attribute",
   * "***",
   * "Specifies the number of subpage references to be added to the list.Its Min value is 1 and Max value is 600. Its default value is 10."
   * ]
   * @name numberofitems
   * @default 10
   * @limits [{"min": 1, "max": 600}]
   * @attributeType "Integer"
   */
  numberOfItems: number;
  /**
   * @documentation
   * [
   * "`receiveStateNumberOfItems` attribute",
   * "***",
   * "It sets the number of subpage references to be added to the list on the basis of signal received."
   * ]
   * @name receivestatenumberofitems
   * @join {"direction": "state", "isContractName": true, "numericJoin": 1}
   * @attributeType "Join"
   */
  receiveStateNumberOfItems: string;

  /**
   * @documentation
   * [
   * "`indexId` attribute",
   * "***",
   * "This attribute helps to replace the pattern with the index on the ch5-subpage-reference-list"
   * ]
   * @name indexid
   * @default 
   * @attributeType "String"
   */
  indexId: string;

}