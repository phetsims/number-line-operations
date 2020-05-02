// Copyright 2020, University of Colorado Boulder

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

/**
 * OperationTrackingNumberLine is a specialization of the spatialized number line that tracks a set of addition and
 * subtraction operations so that they can be depicted on a number line.  It is important to note that the operation
 * order matters in how they are depicted, so this is designed with that assumption in mind.  In other words, it is
 * *not* designed such that it can handle an arbitrary number of operations in any order.
 */
class OperationTrackingNumberLine extends SpatializedNumberLine {

  /**
   * {Vector2} zeroPosition - the location in model space of the zero point on the number line
   * {NumberProperty} startingValueProperty - the starting value from which all operations will build
   * {Object} [options]
   * @public
   */
  constructor( zeroPosition, options ) {

    options = merge( {

      numberOfOperationsTracked: 1,

      // {NumberProperty} - the value from which the operations will start, created if not supplied
      startingValueProperty: null

    }, options );

    super( zeroPosition, options );

    // @public (read-write) - the starting value from which the added operations add and/or subtract
    this.startingValueProperty = options.startingValueProperty;
    if ( !this.startingValueProperty ) {
      this.startingValueProperty = new NumberProperty( 0 );
    }

    // @public (read-write)
    this.showOperationLabelsProperty = new BooleanProperty( true );

    // @public (read-write)
    this.showOperationDescriptionsProperty = new BooleanProperty( true );

    // @public (read-only) {<Property.<NumberLineOperation|null>>[]} - An array of Property instances that track the
    // operations.  The order matters in how changes are processed and how things are portrayed in the view.  The
    // Property instances are set to null for inactive operations and an instance of NumberLineOperation when active.
    this.operationProperties = [];
    _.times( options.numberOfOperationsTracked, () => {
      this.operationProperties.push( new Property( null ) );
    } );

    // @public (read-write) - the number line point that corresponds with the starting value, this is always present
    this.startingPoint = new NumberLinePoint( this, {
      valueProperty: this.startingValueProperty,
      initialColor: new Color( 0x4ddff )
    } );
    this.addPoint( this.startingPoint );

    // @public (read-only) {<Property<NumberLinePoint|null>>[]}- The endpoints for each operation.  There is one
    // endpoint for each operation and these come and go with the operations.  The position in the array identifies
    // the operation to which the endpoint corresponds.
    this.endpointProperties = [];
    _.times( options.numberOfOperationsTracked, () => {
      this.endpointProperties.push( new Property( null ) );
    } );

    // function closure to update endpoint values as operations change
    const updateEndpointValues = () => {

      // All operations must be cycled through because if a middle operation has changed the result of later operations
      // will be affected.
      this.operationProperties.forEach( ( operationProperty, index ) => {
        const operation = operationProperty.value;
        const endpoint = this.endpointProperties[ index ].value;
        if ( operation ) {

          // state checking
          assert && assert( endpoint, 'there is no endpoint for this operation, internal state is incorrect' );

          // Update the value of the endpoint to the result of this operation EXCEPT when the endpoint is being dragged,
          // since in that case it is probably the dragging that caused the change to the operation.
          if ( !endpoint.isDraggingProperty.value ) {
            endpoint.valueProperty.set( this.getOperationResult( operation ) );
          }
        }
        else {

          // state checking
          assert && assert( !endpoint, 'there is an endpoint for a nonexistent operation, internal state is incorrect' );
        }
      } );
    };

    // function closure to update operations as endpoints are changed from being dragged
    const updateOperationWhenEndpointDragged = () => {

      this.endpointProperties.forEach( ( endpointProperty, index ) => {

        const endpoint = endpointProperty.value;
        if ( endpoint && endpoint.isDraggingProperty.value ) {

          // The value of this endpoint was changed by the user dragging it.  Update the amount of the corresponding
          // operation to match.
          const operation = this.operationProperties[ index ].value;
          assert && assert( operation, 'can\'t find operation for this endpoint' );
          operation.amountProperty.set( endpoint.valueProperty.value - this.getOperationStartValue( operation ) );
        }
      } );
    };

    // update the endpoints if the starting point moves
    this.startingValueProperty.link( updateEndpointValues );

    // Listen to the Properties that describe the operations and add, remove, or modify endpoints as changes occur.
    this.operationProperties.forEach( ( operationProperty, index ) => {
      operationProperty.link( ( operation, previousOperation ) => {
        if ( operation ) {

          // A new operation has been added - create an endpoint if there isn't one already.  Its value will be set later.
          if ( this.endpointProperties[ index ].value === null ) {
            const endpoint = new NumberLinePoint( this, { initialColor: Color.BLUE } );
            endpoint.valueProperty.link( updateOperationWhenEndpointDragged );
            this.endpointProperties[ index ].set( endpoint );
            this.addPoint( endpoint );
          }

          // Set up listeners that will update the endpoint values if the attributes of the operation change.
          operation.amountProperty.link( updateEndpointValues );
          operation.operationTypeProperty.link( updateEndpointValues );
        }
        if ( previousOperation ) {

          // remove the endpoint associated with this operation
          const endpoint = this.endpointProperties[ index ].value;
          endpoint.valueProperty.unlink( updateOperationWhenEndpointDragged );
          this.removePoint( endpoint );
          this.endpointProperties[ index ].set( null );

          // If this was an intermediate operation, its removal could have affected the values of other endpoints.
          updateEndpointValues();

          // Remove previously added listeners.
          previousOperation.amountProperty.unlink( updateEndpointValues );
          previousOperation.operationTypeProperty.unlink( updateEndpointValues );
        }
      } );
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
    const operation = new NumberLineOperation( operationType, amount );
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
   * remove all operations, does nothing if there are none
   * @public
   */
  removeAllOperations() {
    this.operationProperties.forEach( operationProperty => {
      operationProperty.set( null );
    } );
  }

  /**
   * go through the operations and calculate the current end value
   * @returns {number}
   */
  getCurrentEndValue() {
    let value = this.startingValueProperty.value;
    this.operationProperties.forEach( operationProperty => {
      const operation = operationProperty.value;
      if ( operation ) {
        value = operation.getResult( value );
      }
    } );
    return value;
  }

  /**
   * get the value after this operation and all those that precede it on the operations list have been applied
   * @param {NumberLineOperation} operation
   * @returns {number}
   */
  getOperationResult( operation ) {

    assert && assert(
      operation.operationTypeProperty.value === Operations.ADDITION ||
      operation.operationTypeProperty.value === Operations.SUBTRACTION,
      'unrecognized operation type'
    );

    // Go through the list of operations modifying the end value based on the result of each until the requested
    // operation result has been processed.
    let value = this.startingValueProperty.value;
    for ( let i = 0; i < this.operationProperties.length; i++ ) {
      const nextOperation = this.operationProperties[ i ].value;
      if ( nextOperation !== null ) {
        value = nextOperation.getResult( value );
      }

      // test if we're done
      if ( nextOperation === operation ) {
        break;
      }
    }
    return value;
  }

  /**
   * Get the start value of this operation by starting from the initial value and executing all operations that precede
   * it.
   * @param operation
   * @returns {number}
   * @public
   */
  getOperationStartValue( operation ) {
    let value = this.startingValueProperty.value;
    for ( let i = 0; i < this.operationProperties.length; i++ ) {
      const currentOperation = this.operationProperties[ i ].value;
      if ( currentOperation !== null ) {
        if ( currentOperation === operation ) {
          break;
        }
        else {
          value = currentOperation.getResult( value );
        }
      }
    }
    return value;
  }

  /**
   * Get an array of the operations that are currently active on the number line.
   * @returns {NumberLineOperations[]}
   */
  getActiveOperations() {
    const list = [];
    this.operationProperties.forEach( operationProperty => {
      if ( operationProperty.value !== null ) {
        list.push( operationProperty.value );
      }
    } );
    return list;
  }

  /**
   * Get the number of points that are being dragged by the user.  This is useful for determining when something is
   * being changed due to the dragging of points versus other means.
   * @returns {number}
   * @private
   */
  getNumberOfDraggingPoints() {
    let numberOfDraggingPoints = 0;
    this.residentPoints.forEach( point => {
      if ( point.isDraggingProperty.value ) {
        numberOfDraggingPoints++;
      }
    } );
    return numberOfDraggingPoints;
  }

  /**
   * restore initial state
   * @public
   */
  reset() {

    this.removeAllOperations();
    this.startingValueProperty.reset();

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