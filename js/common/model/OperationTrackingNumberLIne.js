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
import NumberLineOperation from './NumberLineOperation.js';
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

    // @public (read-only) {ObservableArray<NumberLineOperation>} - an observable list that tracks addition and
    // subtraction operations.  Its length will generally be less than or equal to historyLength, but may briefly exceed
    // it by 1. This list is ordered, with the oldest operations at the front and the newest at the back (FIFO).
    this.operationsList = new ObservableArray();

    // @private
    this.historyLength = historyLength;
    this.initialValue = initialValue;

    // There is always at least one point that serves as the starting point from which the operation act upon, so add it
    // now.
    this.startingPoint = new NumberLinePoint( initialValue, new Color( 0x4ddff ), this );
    this.addPoint( this.startingPoint );

    // function closure that updates the points on the number line when an operation is added, removed, or changed
    const updatePoints = () => {

      // There should be one more points than there are operations, if not, adjust the quantity.
      const changeToNumberOfPoints = ( this.operationsList.length + 1 ) - this.residentPoints.length;

      if ( changeToNumberOfPoints > 0 ) {
        _.times( changeToNumberOfPoints, () => {

          // add a point at an arbitrary location, its value will be updated below
          this.addPoint( new NumberLinePoint( 0, Color.BLUE, this ) );
        } );
      }
      else if ( changeToNumberOfPoints < 0 ) {

        // remove points, but make sure that the starting point stays
        const eligiblePointsForRemoval = this.residentPoints.getArray().filter( item => item !== this.startingPoint );
        const numberOfPointsToRemove = Math.abs( changeToNumberOfPoints );
        assert && assert( eligiblePointsForRemoval.length >= numberOfPointsToRemove );
        _.times( numberOfPointsToRemove, index => { this.removePoint( eligiblePointsForRemoval[ index ] ); } );
      }

      // Update the positions of the points based on the initial value and the list of operations.
      const availablePoints = this.residentPoints.getArray().filter( item => item !== this.startingPoint );
      this.operationsList.forEach( operation => {
        availablePoints[ 0 ].valueProperty.set( this.getOperationResult( operation ) );
        availablePoints.shift();
      } );
    };

    // Monitor the operations list and add, remove, and update points as needed.  The operations list is a permanent
    // part of this type, no dispose function is needed.
    this.operationsList.addItemAddedListener( addedOperation => {
      updatePoints();
      addedOperation.amountProperty.lazyLink( updatePoints );
      addedOperation.operationTypeProperty.lazyLink( updatePoints );
    } );
    this.operationsList.addItemRemovedListener( removedOperation => {
      updatePoints();
      removedOperation.amountProperty.unlink( updatePoints );
      removedOperation.operationTypeProperty.unlink( updatePoints );
    } );
  }

  /**
   * perform the provided operation on the number line
   * @param {Operations} operationType
   * @param {number} amount
   * @returns {NumberLineOperation} - the operation that was created and added
   * @public
   */
  performOperation( operationType, amount ) {

    assert && assert(
      operationType === Operations.ADDITION || operationType === Operations.SUBTRACTION,
      'only addition and subtraction are currently supported'
    );

    // add the new operation to the list
    const operation = new NumberLineOperation( this.getCurrentEndValue(), operationType, amount );
    this.addOperation( operation );

    // return what was created
    return operation;
  }

  /**
   * perform an addition operation on this number line
   * @param {number} amount
   * @returns {NumberLineOperation} - the operation that was created and added
   * @public
   */
  add( amount ) {
    return this.performOperation( Operations.ADDITION, amount );
  }

  /**
   * perform a subtraction operation on this number line
   * @param {number} amount
   * @returns {NumberLineOperation} - the operation that was created and added
   * @public
   */
  subtract( amount ) {
    return this.performOperation( Operations.SUBTRACTION, amount );
  }

  /**
   * add the provided operation to the list, remove the oldest one if the history length is exceeded
   * @param {NumberLineOperation} operation
   * @public
   */
  addOperation( operation ) {
    this.operationsList.push( operation );

    // if the history is maxed out, remove the oldest operation
    if ( this.operationsList.length > this.historyLength ) {
      this.operationsList.remove( this.operationsList.get( 0 ) );
    }
  }

  /**
   * remove the provided operation from the number line
   * @param {NumberLineOperation} operation
   * @public
   */
  removeOperation( operation ) {
    assert && assert( this.operationsList.contains( operation ), 'operation not on this number line' );
    this.operationsList.remove( operation );
  }

  /**
   * remove all operations, does nothing if there are none
   * @public
   */
  removeAllOperations() {
    this.operationsList.clear();
  }

  /**
   * go through the operations and calculate the current end value
   * @returns {number}
   */
  getCurrentEndValue() {
    let value = this.initialValue;
    if ( this.operationsList.length > 0 ) {
      value = this.operationsList.get( this.operationsList.length - 1 ).getResult( value );
    }
    return value;
  }

  /**
   * get the value after this operation and all those that precede it on the operations list have been applied
   * @param operation
   * @returns {number}
   */
  getOperationResult( operation ) {
    const indexOfOperation = this.operationsList.indexOf( operation );
    assert && assert( indexOfOperation !== -1, 'provided operation is not on this number line' );
    let resultantValue = this.initialValue;
    for ( let i = 0; i <= indexOfOperation; i++ ) {
      resultantValue = this.operationsList.get( i ).getResult( resultantValue );
    }
    return resultantValue;
  }

  /**
   * Get the start value of this operation by starting from the initial value and executing all operations that precede
   * it.
   * @param operation
   * @returns {number}
   */
  getOperationStartValue( operation ) {
    const indexOfOperation = this.operationsList.indexOf( operation );
    assert && assert( indexOfOperation !== -1, 'provided operation is not on this number line' );
    let resultantValue = this.initialValue;
    for ( let i = 0; i <= indexOfOperation - 1; i++ ) {
      resultantValue = this.operationsList.get( i ).getResult( resultantValue );
    }
    return resultantValue;
  }

  reset() {

    // Remove all the operations.  The 'clear' method of ObservableArray removes items from the back (LIFO), we need to
    // remove them from the front instead (FIFO).
    const operationsListCopy = this.operationsList.getArray().slice();
    operationsListCopy.forEach( operation => {
      this.operationsList.remove( operation );
    } );

    super.reset();

    // reset the properties that were defined in this subclass
    this.showOperationLabelsProperty.reset();
    this.showOperationDescriptionsProperty.reset();

    // resetting the number line removes all points, so add the start point back
    this.addPoint( this.startingPoint );
  }
}

numberLineOperations.register( 'OperationTrackingNumberLine', OperationTrackingNumberLine );
export default OperationTrackingNumberLine;