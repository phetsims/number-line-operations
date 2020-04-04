// Copyright 2020, University of Colorado Boulder

/**
 * Operation is a very simple class used to track arithmetic operations of addition and subtraction that have been
 * performed on an operation-tracking number line.
 */

import numberLineOperations from '../../numberLineOperations.js';
import Operations from './Operations.js';

class Operation {

  /**
   * @param {number} startValue
   * @param {Operations} operationType
   * @param {number} amount
   */
  constructor( startValue, operationType, amount ) {
    this.startValue = startValue;
    this.operationType = operationType;
    this.amount = amount;
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

numberLineOperations.register( 'Operation', Operation );
export default Operation;