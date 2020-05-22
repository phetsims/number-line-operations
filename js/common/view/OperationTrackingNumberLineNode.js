// Copyright 2020, University of Colorado Boulder

/**
 * OperationTrackingNumberLineNode is a specialization of SpatializedNumberLineNode that adds the ability to depict
 * labeled operations that have occurred between the points on the number line.
 */

import Property from '../../../../axon/js/Property.js';
import NLCConstants from '../../../../number-line-common/js/common/NLCConstants.js';
import SpatializedNumberLineNode from '../../../../number-line-common/js/common/view/SpatializedNumberLineNode.js';
import ArrowNode from '../../../../scenery-phet/js/ArrowNode.js';
import PhetFont from '../../../../scenery-phet/js/PhetFont.js';
import HBox from '../../../../scenery/js/nodes/HBox.js';
import RichText from '../../../../scenery/js/nodes/RichText.js';
import Color from '../../../../scenery/js/util/Color.js';
import Panel from '../../../../sun/js/Panel.js';
import numberLineOperations from '../../numberLineOperations.js';
import numberLineOperationsStrings from '../../numberLineOperationsStrings.js';
import NumberLineOperationNode from './NumberLineOperationNode.js';
import merge from '../../../../phet-core/js/merge.js';

const OFF_SCALE_INDICATOR_FONT = new PhetFont( 14 );
const COMMON_OFF_SCALE_PANEL_OPTIONS = {
  fill: Color.WHITE,
  stroke: Color.BLACK,
  cornerRadius: NLCConstants.LABEL_BACKGROUND_CORNER_RADIUS
};
const OFF_SCALE_HBOX_SPACING = 5;
const OFF_SCALE_ARROW_LENGTH = 25;
const OFF_SCALE_ARROW_OPTIONS = {
  tailWidth: 2
};
const OFF_SCALE_INDICATOR_HEIGHT_ABOVE_LINE = 25;

class OperationTrackingNumberLineNode extends SpatializedNumberLineNode {

  /**
   * {OperationTrackingNumberLine} numberLine - model of a number line
   * {Object} [options] - options that control the appearance of the number line
   * @public
   */
  constructor( numberLine, options ) {

    options = merge( {

      // this is here as documentation so that clients know how options are passed through to the operation nodes
      numberLineOperationNodeOptions: {}

    }, options );

    super( numberLine, options );

    // create an operation node for each operation on the number line
    numberLine.operations.forEach( ( operation, index ) => {

      // nodes for even-indexed operations go above the number line, odd below
      const operationNodeOptions = index % 2 === 1 ?
        { relativePosition: NumberLineOperationNode.RelativePositions.BELOW_NUMBER_LINE } :
        {};

      // add the node
      const numberLineOperationNode = new NumberLineOperationNode(
        operation,
        numberLine.showOperationLabelsProperty,
        numberLine.showOperationDescriptionsProperty,
        numberLine,
        merge( operationNodeOptions, options.numberLineOperationNodeOptions )
      );
      this.addChild( numberLineOperationNode );
    } );

    // indicators for when all points are off the scale
    const offScaleToRightText = new RichText( numberLineOperationsStrings.pointsOffScale, {
      font: OFF_SCALE_INDICATOR_FONT,
      align: 'left'
    } );
    const offScaleToRightArrow = new ArrowNode( 0, 0, OFF_SCALE_ARROW_LENGTH, 0, OFF_SCALE_ARROW_OPTIONS );
    const pointsOffScaleToRightIndicator = new Panel(
      new HBox( {
        children: [ offScaleToRightText, offScaleToRightArrow ],
        spacing: OFF_SCALE_HBOX_SPACING
      } ),
      merge( {}, COMMON_OFF_SCALE_PANEL_OPTIONS )
    );
    this.addChild( pointsOffScaleToRightIndicator );

    const offScaleToLeftText = new RichText( numberLineOperationsStrings.pointsOffScale, {
      font: OFF_SCALE_INDICATOR_FONT,
      align: 'right'
    } );
    const offScaleToLeftArrow = new ArrowNode( 0, 0, -OFF_SCALE_ARROW_LENGTH, 0, OFF_SCALE_ARROW_OPTIONS );
    const pointsOffScaleToLeftIndicator = new Panel(
      new HBox( {
        children: [ offScaleToLeftArrow, offScaleToLeftText ],
        spacing: OFF_SCALE_HBOX_SPACING
      } ),
      merge( {}, COMMON_OFF_SCALE_PANEL_OPTIONS )
    );
    this.addChild( pointsOffScaleToLeftIndicator );

    // function closure to update the position and visibility of each of the points-off-scale indicators
    const updatePointsOffScaleIndicators = () => {

      const displayedRange = numberLine.displayedRangeProperty.value;

      // positions
      pointsOffScaleToLeftIndicator.centerX = numberLine.valueToModelPosition( displayedRange.min ).x;
      pointsOffScaleToLeftIndicator.bottom = numberLine.centerPositionProperty.value.y -
                                             OFF_SCALE_INDICATOR_HEIGHT_ABOVE_LINE;
      pointsOffScaleToRightIndicator.centerX = numberLine.valueToModelPosition( displayedRange.max ).x;
      pointsOffScaleToRightIndicator.bottom = pointsOffScaleToLeftIndicator.bottom;

      // visibility
      pointsOffScaleToLeftIndicator.visible = numberLine.residentPoints.getArray().reduce(
        ( allPointsBelowMin, point ) => allPointsBelowMin && point.valueProperty.value < displayedRange.min,
        true
      );
      pointsOffScaleToRightIndicator.visible = numberLine.residentPoints.getArray().reduce(
        ( allPointsAboveMax, point ) => allPointsAboveMax && point.valueProperty.value > displayedRange.max,
        true
      );
    };

    // hook up the listener that will update the points-off-scale indicators
    Property.multilink(
      [ numberLine.displayedRangeProperty, numberLine.centerPositionProperty ],
      updatePointsOffScaleIndicators
    );

    numberLine.residentPoints.addItemAddedListener( addedPoint => {
      addedPoint.valueProperty.link( updatePointsOffScaleIndicators );
    } );
    numberLine.residentPoints.addItemRemovedListener( removedPoint => {
      if ( removedPoint.valueProperty.hasListener( updatePointsOffScaleIndicators ) ) {
        removedPoint.valueProperty.unlink( updatePointsOffScaleIndicators );
      }
    } );
  }
}

numberLineOperations.register( 'OperationTrackingNumberLineNode', OperationTrackingNumberLineNode );
export default OperationTrackingNumberLineNode;