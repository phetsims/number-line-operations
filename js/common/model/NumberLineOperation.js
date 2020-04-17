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
   * @param {Object} [options]
   */
  constructor( initialOperationType, initialAmount, options ) {

    // @public
    this.operationTypeProperty = new EnumerationProperty( Operations, initialOperationType );
    this.amountProperty = new NumberProperty( initialAmount );

    // If a relative position was specified for the view depiction of this operation, set it as a field.
    if ( options && options.depictionRelativePosition ) {
      this.depictionRelativePosition = options.depictionRelativePosition;
    }
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
}

numberLineOperations.register( 'NumberLineOperation', NumberLineOperation );
export default NumberLineOperation;