// Copyright 2020, University of Colorado Boulder

/**
 * @author John Blanco
 */

import BooleanProperty from '../../../../axon/js/BooleanProperty.js';
import NumberProperty from '../../../../axon/js/NumberProperty.js';
import numberLineOperations from '../../numberLineOperations.js';

/**
 * @constructor
 */
class NLONetWorthModel {

  /**
   * @param {Tandem} tandem
   */
  constructor( tandem ) {

    // @public (read-write) - total net worth, which is total assets minus total liabilities
    this.netWorthProperty = new NumberProperty( 0, {
      tandem: tandem.createTandem( 'netWorthProperty' )
    } );

    // @public (read-write)
    this.operationLabelsVisibleProperty = new BooleanProperty( true, {
      tandem: tandem.createTandem( 'operationLabelsVisibleProperty' )
    } );

    // @public (read-write)
    this.operationDescriptionVisibleProperty = new BooleanProperty( true, {
      tandem: tandem.createTandem( 'operationDescriptionVisibleProperty' )
    } );

    // @public (read-write) - whether the tick marks should be visible on the number line
    this.tickMarksVisibleProperty = new BooleanProperty( true, {
      tandem: tandem.createTandem( 'tickMarksVisibleProperty' )
    } );
  }

  /**
   * Resets the model.
   * @public
   */
  reset() {
    //TODO
  }

  /**
   * Steps the model.
   * @param {number} dt - time step, in seconds
   * @public
   */
  step( dt ) {
    //TODO
  }
}

numberLineOperations.register( 'NLONetWorthModel', NLONetWorthModel );
export default NLONetWorthModel;