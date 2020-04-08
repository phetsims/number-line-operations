// Copyright 2020, University of Colorado Boulder

/**
 * OperationTrackingNumberLine is a specialization of the spatialized number line that tracks a history of addition and
 * subtraction operations so that they can be depicted on a number line.
 */

import BooleanProperty from '../../../../axon/js/BooleanProperty.js';
import Property from '../../../../axon/js/Property.js';
import NumberLinePoint from '../../../../number-line-common/js/common/model/NumberLinePoint.js';
import SpatializedNumberLine from '../../../../number-line-common/js/common/model/SpatializedNumberLine.js';
import Color from '../../../../scenery/js/util/Color.js';
import numberLineOperations from '../../numberLineOperations.js';
import Operation from './Operation.js';
import Operations from './Operations.js';

class OperationTrackingNumberLine extends SpatializedNumberLine {

  /**
   * {Vector2} zeroPosition - the location in model space of the zero point on the number line
   * {number} initialValue - initial value, all operations will build from this
   * {number} historyLength - number of operations to keep track of
   * {Object} [options]
   * @public
   */
  constructor( zeroPosition, initialValue, historyLength, options ) {

    super( zeroPosition, options );

    // @public (read-write)
    this.showOperationLabelsProperty = new BooleanProperty( true );

    // @public (read-write)
    this.showOperationDescriptionsProperty = new BooleanProperty( true );

    // @public (read-only) {Property<Array<Operation>>>} - a property that keeps track of the recent operations on this
    // number line, and its length should never exceed historyLength.  This list is ordered, with the oldest operations
    // at the front and the newest at the back (FIFO).
    this.operationsListProperty = new Property( [] );

    // @private
    this.historyLength = historyLength;
    this.initialValue = initialValue;

    // There is always at least one point that serves as the starting point from which the operation act upon, so add it
    // now.
    this.startingPoint = new NumberLinePoint( initialValue, Color.BLUE, this );
    this.addPoint( this.startingPoint );
  }

  /**
   * perform the provided operation on the number line
   * @param {Operations} operationType
   * @param {number} amount
   * @public
   */
  performOperation( operationType, amount ) {

    assert && assert(
      operationType === Operations.ADDITION || operationType === Operations.SUBTRACTION,
      'only addition and subtraction are currently supported'
    );

    const currentValue = this.getCurrentEndValue();

    // start with a copy of the current operations list
    const operationsList = this.operationsListProperty.value.slice();

    // if the history is maxed out, remove the oldest value
    if ( operationsList.length >= this.historyLength ) {

      // remove the oldest operation
      operationsList.shift();
    }

    // add the new operation to the list
    operationsList.push( new Operation( currentValue, operationType, amount ) );

    // set the value of the starting point
    this.startingPoint.valueProperty.set( operationsList[ 0 ].startValue );

    // go through the operations, adjusting or adding points as needed
    const usedPoints = [ this.startingPoint ];
    operationsList.forEach( operation => {

      // Is there an unused point available?
      const unusedPoint = _.find( this.residentPoints.getArray(), item => usedPoints.indexOf( item ) === -1 );
      if ( !unusedPoint ) {

        // add a new point
        const newPoint = new NumberLinePoint( operation.getEndValue(), Color.BLUE, this );
        this.addPoint( newPoint );
        usedPoints.push( newPoint );
      }
      else {

        // update this point
        unusedPoint.valueProperty.set( operation.getEndValue() );
        usedPoints.push( unusedPoint );
      }
    } );

    // update the list property
    this.operationsListProperty.set( operationsList );
  }

  /**
   * perform an addition operation on this number line
   * @param {number} amount
   * @public
   */
  add( amount ) {
    this.performOperation( Operations.ADDITION, amount );
  }

  /**
   * perform a subtraction operation on this number line
   * @param {number} amount
   * @public
   */
  subtract( amount ) {
    this.performOperation( Operations.SUBTRACTION, amount );
  }

  /**
   * go through the operations and calculate the current end value
   * @returns {number}
   */
  getCurrentEndValue() {
    let value = this.initialValue;
    if ( this.operationsListProperty.value.length > 0 ) {
      value = this.operationsListProperty.value[ this.operationsListProperty.value.length - 1 ].getEndValue();
    }
    return value;
  }

  reset() {
    super.reset();
    this.operationsListProperty.set( [] );

    // resetting the number line removes all points, so add the start point back
    this.startingPoint.valueProperty.reset();
    this.addPoint( this.startingPoint );
  }
}

numberLineOperations.register( 'OperationTrackingNumberLine', OperationTrackingNumberLine );
export default OperationTrackingNumberLine;