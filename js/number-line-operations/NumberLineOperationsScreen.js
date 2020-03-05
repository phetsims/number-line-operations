// Copyright 2020, University of Colorado Boulder

/**
 * @author John Blanco
 */

import Property from '../../../axon/js/Property.js';
import Screen from '../../../joist/js/Screen.js';
import numberLineOperations from '../numberLineOperations.js';
import NumberLineOperationsModel from './model/NumberLineOperationsModel.js';
import NumberLineOperationsScreenView from './view/NumberLineOperationsScreenView.js';

class NumberLineOperationsScreen extends Screen {

  /**
   * @param {Tandem} tandem
   */
  constructor( tandem ) {

    const options = {
      backgroundColorProperty: new Property( 'white' ),
      tandem: tandem
    };

    super(
      () => new NumberLineOperationsModel( tandem.createTandem( 'model' ) ),
      model => new NumberLineOperationsScreenView( model, tandem.createTandem( 'view' ) ),
      options
    );
  }
}

numberLineOperations.register( 'NumberLineOperationsScreen', NumberLineOperationsScreen );
export default NumberLineOperationsScreen;