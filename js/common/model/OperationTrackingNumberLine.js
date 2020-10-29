// Copyright 2020, University of Colorado Boulder

/**
 * OperationTrackingNumberLine is a specialization of the spatialized number line that tracks a set of addition and
 * subtraction operations so that they can be depicted on a number line.  It is important to note that the operation
 * order matters in how they are depicted, so this is designed with that assumption in mind.  In other words, it is
 * *not* designed such that it can handle an arbitrary number of operations in any order.
 */

import BooleanProperty from '../../../../axon/js/BooleanProperty.js';
import NumberProperty from '../../../../axon/js/NumberProperty.js';
import Property from '../../../../axon/js/Property.js';
import NumberLinePoint from '../../../../number-line-common/js/common/model/NumberLinePoint.js';
import SpatializedNumberLine from '../../../../number-line-common/js/common/model/SpatializedNumberLine.js';
import merge from '../../../../phet-core/js/merge.js';
import Color from '../../../../scenery/js/util/Color.js';
import numberLineOperations from '../../numberLineOperations.js';
import NumberLineOperation from './NumberLineOperation.js';
import Operations from './Operations.js';

class OperationTrackingNumberLine extends SpatializedNumberLine {

  /**
   * {Vector2} zeroPosition - the position in model space of the zero point on the number line
   * {NumberProperty} startingValueProperty - the starting value from which all operations will build
   * {Object} [options]
   * @public
   */
  constructor( zeroPosition, options ) {

    options = merge( {

      // {number} - the number of operations tracked
      numberOfOperationsTracked: 1,

      // {NumberProperty} - the value from which the operations will start, created if not supplied
      startingValueProperty: null,

      // {Color[]} - A list of colors that is used for the points that appear on the number line.  The list is ordered
      // such that the first color is the color of the initial point, the second is the color of the first operation if
      // present, and so on.
      pointColorList: [ new Color( '#0000C4' ), new Color( '#4069FF' ) ],

      // {boolean} - whether operation labels are initially visible, can be changed later via the property
      operationLabelsInitiallyVisible: true,

      // {boolean} - whether descriptions are initially visible, can be changed later via the property
      operationDescriptionsInitiallyVisible: true

    }, options );

    assert && assert(
    options.numberOfOperationsTracked > 0 && options.numberOfOperationsTracked <= 2,
      'unsupported number of operations specified: ' + options.numberOfOperationsTracked
    );
    assert && assert(
      options.pointColorList.length = options.numberOfOperationsTracked + 1,
      'number of potential points doesn\'t match length of point color list'
    );

    super( zeroPosition, options );

    // @public (read-write) - the starting value from which the added operations add and/or subtract, created if not
    // supplied
    this.startingValueProperty = options.startingValueProperty;
    if ( !this.startingValueProperty ) {
      this.startingValueProperty = new NumberProperty( 0 );
    }

    // @public (read-write)
    this.showOperationLabelsProperty = new BooleanProperty( options.operationLabelsInitiallyVisible );

    // @public (read-write)
    this.showOperationDescriptionsProperty = new BooleanProperty( options.operationDescriptionsInitiallyVisible );

    // @public (read-only) {NumberLineOperation[] - An array of operations that this number line will track.  The order
    // matters in how changes are processed and how things are portrayed in the view, which is one of the main reasons
    // that they are created at construction rather than added and removed.  This is also better for phet-io.
    this.operations = [];
    _.times( options.numberOfOperationsTracked, () => {
      this.operations.push( new NumberLineOperation() );
    } );

    // @public (read-write) - the number line point that corresponds with the starting value, this is always present
    this.startingPoint = new NumberLinePoint( this, {
      valueProperty: this.startingValueProperty,
      initialColor: options.pointColorList[ 0 ]
    } );
    this.addPoint( this.startingPoint );

    // @public (read-only) {NumberLinePoint[]}- The endpoints for each operation.  There is one endpoint for each
    // operation and these are added to or removed from the number line as the corresponding operation goes active or
    // inactive.  The position in the array identifies the operation to which the endpoint corresponds.
    this.endpoints = [];
    _.times( options.numberOfOperationsTracked, index => {
      this.endpoints.push( new NumberLinePoint( this, {
        initialColor: options.pointColorList[ index + 1 ]
      } ) );
    } );

    // function closure to update endpoint values as operations change
    const updateEndpoints = () => {

      // Cycle through the operations in order and update all endpoint values.
      this.operations.forEach( ( operation, index ) => {
        const endpoint = this.endpoints[ index ];
        if ( operation.isActiveProperty.value ) {

          // state checking
          assert && assert( endpoint, 'there is no endpoint for this operation, internal state is incorrect' );

          // the operation is active, so make sure its endpoint is on the number line
          if ( !this.hasPoint( endpoint ) ) {
            this.addPoint( endpoint );
          }

          // Update the value of the endpoint to the result of this operation EXCEPT when the endpoint is being dragged,
          // since in that case it is probably the dragging that caused the change to the operation, so setting the
          // value here will cause reentry.
          if ( !endpoint.isDraggingProperty.value ) {
            endpoint.valueProperty.set( this.getOperationResult( operation ) );
          }
        }
        else {

          // For an inactive operation, set the endpoint's value at what is essentially the starting point, like it was
          // an operation with an amount of zero.
          endpoint.valueProperty.set( index === 0 ?
                                      this.startingValueProperty.value :
                                      this.endpoints[ index - 1 ].valueProperty.value );

          // Remove the associated endpoint if it's on the number line.
          if ( this.hasPoint( endpoint ) ) {
            this.removePoint( endpoint );
          }
        }
      } );
    };

    // function closure to update operations as endpoints are changed from being dragged
    const updateOperationWhenEndpointDragged = () => {

      this.endpoints.forEach( ( endpoint, index ) => {

        if ( endpoint.isDraggingProperty.value ) {

          // State checking - By design, it should not be possible to drag an endpoint unless the operation with which
          // it is associated is active.
          assert && assert( this.operations[ index ].isActiveProperty, 'associated operation is not active' );

          // The value of this endpoint was just changed by the user dragging it.  Update the amount of the
          // corresponding operation to match.
          const operation = this.operations[ index ];
          assert && assert(
            operation.isActiveProperty.value,
            'state error - it should not be possible to update an inactive operation via dragging'
          );
          const sign = operation.operationTypeProperty.value === Operations.SUBTRACTION ? -1 : 1;
          operation.amountProperty.set(
            sign * ( endpoint.valueProperty.value - this.getOperationStartValue( operation ) )
          );
        }
      } );
    };

    this.operations.forEach( ( operation, operationIndex ) => {

      // Set up listeners to update the endpoint values as the operations change.
      Property.multilink(
        [ operation.isActiveProperty, operation.amountProperty, operation.operationTypeProperty ],
        updateEndpoints
      );
    } );

    // update the endpoints if the starting point moves
    this.startingValueProperty.link( updateEndpoints );

    // update the operations when the endpoints are dragged
    this.endpoints.forEach( endpoint => {
      endpoint.valueProperty.link( updateOperationWhenEndpointDragged );
    } );
  }

  /**
   * remove all operations, does nothing if there are none
   * @public
   */
  deactivateAllOperations() {
    this.operations.forEach( operation => {
      operation.isActiveProperty.set( false );
    } );
  }

  /**
   * go through the operations and calculate the current end value
   * @returns {number}
   * @public
   */
  getCurrentEndValue() {
    let value = this.startingValueProperty.value;
    this.operations.forEach( operation => {
      if ( operation.isActiveProperty.value ) {
        value = operation.getResult( value );
      }
    } );
    return value;
  }

  /**
   * get the value after this operation and all those that precede it on the operations list have been applied
   * @param {NumberLineOperation} targetOperation
   * @returns {number}
   * @public
   */
  getOperationResult( targetOperation ) {

    assert && assert(
      targetOperation.operationTypeProperty.value === Operations.ADDITION ||
      targetOperation.operationTypeProperty.value === Operations.SUBTRACTION,
      'unrecognized operation type'
    );

    // Go through the list of operations modifying the end value based on the result of each until the requested
    // operation result has been processed.
    let value = this.startingValueProperty.value;
    for ( let i = 0; i < this.operations.length; i++ ) {
      const operation = this.operations[ i ];
      if ( operation.isActiveProperty.value ) {
        value = operation.getResult( value );
      }

      // test if we're done
      if ( operation === targetOperation ) {
        break;
      }
    }
    return value;
  }

  /**
   * Get the start value of this operation by starting from the initial value and executing all operations that precede
   * it.
   * @param targetOperation
   * @returns {number}
   * @public
   */
  getOperationStartValue( targetOperation ) {
    let value = this.startingValueProperty.value;
    for ( let i = 0; i < this.operations.length; i++ ) {
      const operation = this.operations[ i ];
      if ( operation === targetOperation ) {
        break;
      }
      else if ( operation.isActiveProperty.value ) {
        value = operation.getResult( value );
      }
    }
    return value;
  }

  /**
   * Get an array of the operations that are currently active on the number line.
   * @returns {NumberLineOperations[]}
   * @public
   */
  getActiveOperations() {
    const list = [];
    this.operations.forEach( operation => {
      if ( operation.isActiveProperty.value ) {
        list.push( operation );
      }
    } );
    return list;
  }

  /**
   * restore initial state
   * @public
   */
  reset() {

    this.deactivateAllOperations();
    this.startingValueProperty.reset();

    super.reset();

    // reset the properties that were defined in this subclass
    this.showOperationLabelsProperty.reset();
    this.showOperationDescriptionsProperty.reset();

    // resetting the number line removes all points, so we need to add back the starting point
    this.addPoint( this.startingPoint );
  }
}

numberLineOperations.register( 'OperationTrackingNumberLine', OperationTrackingNumberLine );
export default OperationTrackingNumberLine;