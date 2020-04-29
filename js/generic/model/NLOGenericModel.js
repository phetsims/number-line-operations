// Copyright 2020, University of Colorado Boulder

/**
 * @author John Blanco
 */

import BooleanProperty from '../../../../axon/js/BooleanProperty.js';
import Range from '../../../../dot/js/Range.js';
import NumberProperty from '../../../../axon/js/NumberProperty.js';
import OperationTrackingNumberLine from '../../common/model/OperationTrackingNumberLIne.js';
import NLOConstants from '../../common/NLOConstants.js';
import numberLineOperations from '../../numberLineOperations.js';

// constants
const NUMBER_LINE_RANGES = [
  new Range( -1000, 1000 ),
  new Range( -100, 100 ),
  new Range( -10, 10 )
];
const MODEL_BOUNDS = NLOConstants.LAYOUT_BOUNDS;
const PRIMARY_NUMBER_LINE_LOWER_POSITION = MODEL_BOUNDS.center;
const PRIMARY_NUMBER_LINE_UPPER_POSITION = MODEL_BOUNDS.center.minusXY( 0, MODEL_BOUNDS.height * 0.15 );

/**
 * primary model for the "Generic" screen
 */
class NLOGenericModel {

  /**
   * @param {Tandem} tandem
   */
  constructor( tandem ) {

    // @public (read-write) - the initial value from which all operations are added and/subtracted
    this.initialValueProperty = new NumberProperty( 0 );

    // @public (read-write) - whether or not the 2nd number line is visible to the user
    this.secondNumberLineVisibleProperty = new BooleanProperty( false );

    // @public - the primary operation-tracking number line, which is always visible
    this.primaryNumberLine = new OperationTrackingNumberLine(
      PRIMARY_NUMBER_LINE_LOWER_POSITION,
      this.initialValueProperty.value,
      {
        initialDisplayedRange: NUMBER_LINE_RANGES[ 0 ],
        tickMarksInitiallyVisible: true,
        preventOverlap: false,
        labelsInitiallyVisible: true,

        // width of the number line in model space, number empirically determined to make it look good
        widthInModelSpace: NLOConstants.LAYOUT_BOUNDS.width - 200
      }
    );

    // position the primary number line based on whether the secondary number line is visible
    this.secondNumberLineVisibleProperty.link( secondNumberLineVisible => {
      const position = secondNumberLineVisible ? PRIMARY_NUMBER_LINE_UPPER_POSITION : PRIMARY_NUMBER_LINE_LOWER_POSITION;
      this.primaryNumberLine.centerPositionProperty.set( position );
    } );

    // @public - the secondary operation-tracking number line, which is only visible when enabled by the user
    this.secondaryNumberLine = new OperationTrackingNumberLine(
      NLOConstants.LAYOUT_BOUNDS.center.plusXY( 0, 100 ),
      this.initialValueProperty.value,
      {
        initialDisplayedRange: NUMBER_LINE_RANGES[ 0 ],
        tickMarksInitiallyVisible: true,
        preventOverlap: false,
        labelsInitiallyVisible: true,

        // width of the number line in model space, number empirically determined to make it look good
        widthInModelSpace: NLOConstants.LAYOUT_BOUNDS.width - 200
      }
    );
  }

  /**
   * resets the model
   * @public
   */
  reset() {
    this.primaryNumberLine.reset();
    this.secondaryNumberLine.reset();
    this.secondNumberLineVisibleProperty.reset();
  }
}

// statics
NLOGenericModel.NUMBER_LINE_RANGES = NUMBER_LINE_RANGES;

numberLineOperations.register( 'NLOGenericModel', NLOGenericModel );
export default NLOGenericModel;