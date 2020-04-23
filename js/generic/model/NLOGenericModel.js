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
      NLOConstants.LAYOUT_BOUNDS.center,
      this.initialValueProperty.value,
      {
        initialDisplayedRange: new Range( -1000, 1000 ),
        tickMarksInitiallyVisible: true,
        preventOverlap: false,
        labelsInitiallyVisible: true,

        // width of the number line in model space, number empirically determined to make it look good
        widthInModelSpace: NLOConstants.LAYOUT_BOUNDS.width - 200
      }
    );

    // @public - the secondary operation-tracking number line, which is only visible when enabled by the user
    this.secondaryNumberLine = new OperationTrackingNumberLine(
      NLOConstants.LAYOUT_BOUNDS.center.plusXY( 0, 100 ),
      this.initialValueProperty.value,
      {
        initialDisplayedRange: new Range( -1000, 1000 ),
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
  }
}

numberLineOperations.register( 'NLOGenericModel', NLOGenericModel );
export default NLOGenericModel;