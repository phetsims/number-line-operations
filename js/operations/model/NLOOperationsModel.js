// Copyright 2020, University of Colorado Boulder

/**
 * @author John Blanco
 */

import Range from '../../../../dot/js/Range.js';
import NumberProperty from '../../../../axon/js/NumberProperty.js';
import OperationTrackingNumberLine from '../../common/model/OperationTrackingNumberLIne.js';
import NLOConstants from '../../common/NLOConstants.js';
import numberLineOperations from '../../numberLineOperations.js';

/**
 * @constructor
 */
class NLOOperationsModel {

  /**
   * @param {Tandem} tandem
   */
  constructor( tandem ) {

    // @public (read-write) - the initial value from which all operations are added and/subtracted
    this.initialValueProperty = new NumberProperty( 0 );

    // @public - the number line upon which the operations are tracked
    this.numberLine = new OperationTrackingNumberLine(
      NLOConstants.LAYOUT_BOUNDS.center.plusXY( 0, 0 ),
      this.initialValueProperty.value,
      2,
      {
        initialDisplayedRange: new Range( -1000, 1000 ),
        tickMarksInitiallyVisible: true,
        preventOverlap: false,

        // width of the number line in model space, number empirically determined to make it look good
        widthInModelSpace: NLOConstants.LAYOUT_BOUNDS.width - 200
      }
    );
  }

  /**
   * Resets the model.
   * @public
   */
  reset() {
    this.numberLine.reset();
  }

  /**
   * Steps the model.
   * @param {number} dt - time step, in seconds
   * @public
   */
  step( dt ) {
    //TODO
  }
}

numberLineOperations.register( 'NumberLineOperationsModel', NLOOperationsModel );
export default NLOOperationsModel;