// Copyright 2020, University of Colorado Boulder

/**
 * NumberLineOperation is a class used to track arithmetic operations of addition and subtraction that have been
 * performed on an operation-tracking number line.
 */

import numberLineOperations from '../../numberLineOperations.js';
import Operations from './Operations.js';

class NumberLineOperation {

  /**
   * @param {number} startValue
   * @param {Operations} operationType
   * @param {number} amount
   * @param {Object} [options]
   */
  constructor( startValue, operationType, amount, options ) {
    this.startValue = startValue;
    this.operationType = operationType;
    this.amount = amount;

    // If a relative position was specified for the view depiction of this operation, set it as a field.
    if ( options && options.depictionRelativePosition ) {
      this.depictionRelativePosition = options.depictionRelativePosition;
    }
  }

  /**
   * get the value at the end of this operation
   * @returns {number}
   */
  getEndValue() {
    let value = this.startValue;
    if ( this.operationType === Operations.ADDITION ) {
      value += this.amount;
    }
    else if ( this.operationType === Operations.SUBTRACTION ) {
      value -= this.amount;
    }
    return value;
  }
}

numberLineOperations.register( 'NumberLineOperation', NumberLineOperation );
export default NumberLineOperation;