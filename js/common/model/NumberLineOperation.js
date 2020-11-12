// Copyright 2020, University of Colorado Boulder

/**
 * NumberLineOperation is a class used to track arithmetic operations of addition and subtraction that have been
 * performed on an operation-tracking number line.
 */

import BooleanProperty from '../../../../axon/js/BooleanProperty.js';
import EnumerationProperty from '../../../../axon/js/EnumerationProperty.js';
import NumberProperty from '../../../../axon/js/NumberProperty.js';
import merge from '../../../../phet-core/js/merge.js';
import numberLineOperations from '../../numberLineOperations.js';
import Operations from './Operations.js';

class NumberLineOperation {

  /**
   * @param {Object} [options]
   */
  constructor( options ) {

    options = merge( {

      // {Operations}
      initialOperationType: Operations.ADDITION,

      // {number}
      initialAmount: 0,

      // {boolean}
      initiallyActive: false
    }, options );

    // @public {Property<OperationType>} - type of operation, e.g. addition or subtraction
    this.operationTypeProperty = new EnumerationProperty( Operations, options.initialOperationType );

    // @public - amount of the operation
    this.amountProperty = new NumberProperty( options.initialAmount );

    // @public - whether or not this property is "active", meaning it is shown on the number line and considered in
    // calculations
    this.isActiveProperty = new BooleanProperty( options.initiallyActive );
  }

  /**
   * get the value at the end of this operation
   * @returns {number}
   * @public
   */
  getResult( startingValue ) {
    let value = startingValue;
    if ( this.operationTypeProperty.value === Operations.ADDITION ) {
      value += this.amountProperty.value;
    }
    else if ( this.operationTypeProperty.value === Operations.SUBTRACTION ) {
      value -= this.amountProperty.value;
    }
    else {
      assert && assert( false, 'unrecognized operation type' );
    }
    return value;
  }

  /**
   * Get a string representation that is worthy of logging to the console.
   * @public
   * @returns {string}
   */
  toString() {
    return `operation type: ${this.operationTypeProperty.value}, amount: ${this.amountProperty.value}, isActive: ${this.isActiveProperty.value}`;
  }

  /**
   * @public
   */
  reset() {
    this.operationTypeProperty.reset();
    this.amountProperty.reset();
  }
}

numberLineOperations.register( 'NumberLineOperation', NumberLineOperation );
export default NumberLineOperation;