// Copyright 2020, University of Colorado Boulder

/**
 * NumberLineOperation is a class used to track arithmetic operations of addition and subtraction that have been
 * performed on an operation-tracking number line.
 */

import EnumerationProperty from '../../../../axon/js/EnumerationProperty.js';
import NumberProperty from '../../../../axon/js/NumberProperty.js';
import numberLineOperations from '../../numberLineOperations.js';
import Operations from './Operations.js';

class NumberLineOperation {

  /**
   * @param {Operations} initialOperationType
   * @param {number} initialAmount
   */
  constructor( initialOperationType, initialAmount ) {

    // @public
    this.operationTypeProperty = new EnumerationProperty( Operations, initialOperationType );
    this.amountProperty = new NumberProperty( initialAmount );
  }

  /**
   * get the value at the end of this operation
   * @returns {number}
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
   * @public
   */
  reset() {
    this.operationTypeProperty.reset();
    this.amountProperty.reset();
  }
}

numberLineOperations.register( 'NumberLineOperation', NumberLineOperation );
export default NumberLineOperation;