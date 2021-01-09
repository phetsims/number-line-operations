// Copyright 2020, University of Colorado Boulder

/**
 * primary model class for the "Operations" screen
 *
 * @author John Blanco (PhET Interactive Simulations)
 */

import createObservableArray from '../../../../axon/js/createObservableArray.js';
import NumberProperty from '../../../../axon/js/NumberProperty.js';
import Range from '../../../../dot/js/Range.js';
import Utils from '../../../../dot/js/Utils.js';
import LockToNumberLine from '../../../../number-line-common/js/common/model/LockToNumberLine.js';
import PointController from '../../../../number-line-common/js/common/model/PointController.js';
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

    // @public (read-write) - the initial value from which all operations are added and/or subtracted
    this.initialValueProperty = new NumberProperty( 0 );

    // @public - the number line upon which the operations are tracked
    this.numberLine = new OperationTrackingNumberLine(
      NLOConstants.LAYOUT_BOUNDS.center.plusXY( 0, 20 ),
      {
        numberOfOperationsTracked: 2,
        pointColorList: [ new Color( '#0000C4' ), new Color( '#4069FF' ), new Color( '#64A3FF' ) ],
        startingValueProperty: this.initialValueProperty,
        initialDisplayedRange: new Range( -1000, 1000 ),
        tickMarksInitiallyVisible: true,
        preventOverlap: false,
        labelsInitiallyVisible: true,
        operationOptionsArray: [ OPERATION_OPTIONS, OPERATION_OPTIONS ],
        constrainPointValue: proposedValue => Utils.roundToInterval( proposedValue, 100 ),

        // width of the number line in model space, number empirically determined to make it look good
        widthInModelSpace: NLOConstants.NUMBER_LINE_WIDTH
      }
    );

    // @public (read-only) - Create a point controller and associate it with the point that represents the initial net
    // worth on the number line.  This point controller will always be present, whereas there are others that can come
    // and go as operations are added and removed.
    assert && assert( this.numberLine.residentPoints.length === 1, 'expected only one point on the number line' );
    this.initialValuePointController = new PointController( {
      color: this.numberLine.startingPoint.colorProperty.value,
      numberLines: [ this.numberLine ],
      numberLinePoints: [ this.numberLine.startingPoint ],
      lockToNumberLine: LockToNumberLine.ALWAYS
    } );

    // @public (read-only) {ObservableArrayDef.<PointController>} - A list of the point controllers for the primary
    // number line. These come and go as points come and go.
    this.pointControllers = createObservableArray();
    this.numberLine.residentPoints.addItemAddedListener( addedPoint => {

      // add a point controller for the newly added point
      const pointController = new PointController( {
        color: addedPoint.colorProperty.value,
        numberLines: [ this.numberLine ],
        numberLinePoints: [ addedPoint ],
        lockToNumberLine: LockToNumberLine.ALWAYS
      } );
      this.pointControllers.push( pointController );

      // remove the point controller when the associated point goes away
      const removalListener = removedPoint => {
        if ( removedPoint === addedPoint ) {
          this.pointControllers.remove( pointController );
          pointController.dispose();
          this.numberLine.residentPoints.removeItemRemovedListener( removalListener );
        }
      };
      this.numberLine.residentPoints.addItemRemovedListener( removalListener );
    } );
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