// Copyright 2020, University of Colorado Boulder

/**
 * OperationTrackingNumberLine is a specialization of the spatialized number line that tracks a history of addition and
 * subtraction operations so that they can be depicted on a number line.
 */

import BooleanProperty from '../../../../axon/js/BooleanProperty.js';
import ObservableArray from '../../../../axon/js/ObservableArray.js';
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

    // @public (read-only) {ObservableArray<Operation>} - an observable list that tracks addition and subtraction
    // operations.  Its length will generally be less than or equal to historyLength, but may briefly exceed it by 1.
    // This list is ordered, with the oldest operations at the front and the newest at the back (FIFO).
    this.operationsList = new ObservableArray();

    // @private
    this.historyLength = historyLength;
    this.initialValue = initialValue;

    // There is always at least one point that serves as the starting point from which the operation act upon, so add it
    // now.
    this.startingPoint = new NumberLinePoint( initialValue, Color.BLUE, this );
    this.addPoint( this.startingPoint );

    // Monitor the operations list and add, remove, and update points as needed.  The operations list is a permanent
    // part of this type, no dispose function is needed.
    this.operationsList.addItemAddedListener( addedOperation => {

      // add a new point to the number line for the end point of this operation
      this.addPoint( new NumberLinePoint( addedOperation.getEndValue(), Color.BLUE, this ) );

      // update the value of the starting point
      this.startingPoint.valueProperty.set( this.operationsList.get( 0 ).startValue );
    } );
    this.operationsList.addItemRemovedListener( removedOperation => {

      // remove the point that corresponded to the result of this operation
      const pointsAtEndOfOperation = this.getPointsAt( removedOperation.getEndValue() );
      assert && assert( pointsAtEndOfOperation.length > 0, 'no point found at result of operation' );
      this.removePoint( pointsAtEndOfOperation[ 0 ] );

      // update the value of the starting point
      if ( this.operationsList.length > 0 ) {
        this.startingPoint.valueProperty.set( this.operationsList.get( 0 ).startValue );
      }
      else {
        this.startingPoint.valueProperty.set( initialValue );
      }
    } );
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

    // add the new operation to the list
    this.operationsList.push( new Operation( this.getCurrentEndValue(), operationType, amount ) );

    // if the history is maxed out, remove the oldest value
    if ( this.operationsList.length > this.historyLength ) {
      this.operationsList.remove( this.operationsList.get( 0 ) );
    }
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
    if ( this.operationsList.length > 0 ) {
      value = this.operationsList.get( this.operationsList.length - 1 ).getEndValue();
    }
    return value;
  }

  reset() {

    // Remove all the operations.  The 'clear' method of ObservableArray removes items from the back (LIFO), we need to
    // remove them from the front instead (FIFO).
    const operationsListCopy = this.operationsList.getArray().slice();
    operationsListCopy.forEach( operation => {
      this.operationsList.remove( operation );
    } );

    super.reset();

    // resetting the number line removes all points, so add the start point back
    this.addPoint( this.startingPoint );
  }
}

numberLineOperations.register( 'OperationTrackingNumberLine', OperationTrackingNumberLine );
export default OperationTrackingNumberLine;