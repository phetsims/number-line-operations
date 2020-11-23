// Copyright 2020, University of Colorado Boulder

/**
 * primary model class for the "Operations" screen
 *
 * @author John Blanco
 */

import NumberProperty from '../../../../axon/js/NumberProperty.js';
import Range from '../../../../dot/js/Range.js';
import Color from '../../../../scenery/js/util/Color.js';
import OperationTrackingNumberLine from '../../common/model/OperationTrackingNumberLine.js';
import NLOConstants from '../../common/NLOConstants.js';
import numberLineOperations from '../../numberLineOperations.js';

// constants
const OPERATION_OPTIONS = { initialAmount: 100 };

class NLOOperationsModel {

  /**
   * @param {Tandem} tandem
   */
  constructor( tandem ) {

    // @public (read-write) - the initial value from which all operations are added and/subtracted
    this.initialValueProperty = new NumberProperty( 0 );

    // @public - the number line upon which the operations are tracked
    this.numberLine = new OperationTrackingNumberLine(
      NLOConstants.LAYOUT_BOUNDS.center,
      {
        numberOfOperationsTracked: 2,
        pointColorList: [ new Color( '#0000C4' ), new Color( '#4069FF' ), new Color( '#64A3FF' ) ],
        startingValueProperty: this.initialValueProperty,
        initialDisplayedRange: new Range( -1000, 1000 ),
        tickMarksInitiallyVisible: true,
        preventOverlap: false,
        labelsInitiallyVisible: true,
        operationOptionsArray: [ OPERATION_OPTIONS, OPERATION_OPTIONS ],

        // width of the number line in model space, number empirically determined to make it look good
        widthInModelSpace: NLOConstants.NUMBER_LINE_WIDTH
      }
    );
  }

  /**
   * resets the model
   * @public
   */
  reset() {
    this.numberLine.reset();
  }
}

numberLineOperations.register( 'NLOOperationsModel', NLOOperationsModel );
export default NLOOperationsModel;