// Copyright 2020, University of Colorado Boulder

/**
 * @author John Blanco
 */

import Property from '../../../axon/js/Property.js';
import Screen from '../../../joist/js/Screen.js';
import numberLineOperationsStrings from '../numberLineOperationsStrings.js';
import numberLineOperations from '../numberLineOperations.js';
import NLOOperationsModel from './model/NLOOperationsModel.js';
import NLOOperationsScreenView from './view/NLOOperationsScreenView.js';

class NLOOperationsScreen extends Screen {

  /**
   * @param {Tandem} tandem
   */
  constructor( tandem ) {

    const options = {
      name: numberLineOperationsStrings.screen.operations,
      backgroundColorProperty: new Property( '#fffef3' ),
      tandem: tandem
    };

    super(
      () => new NLOOperationsModel( tandem.createTandem( 'model' ) ),
      model => new NLOOperationsScreenView( model, tandem.createTandem( 'view' ) ),
      options
    );
  }
}

numberLineOperations.register( 'NLOOperationsScreen', NLOOperationsScreen );
export default NLOOperationsScreen;