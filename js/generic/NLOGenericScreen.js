// Copyright 2020, University of Colorado Boulder

/**
 * @author John Blanco
 */

import Property from '../../../axon/js/Property.js';
import Screen from '../../../joist/js/Screen.js';
import numberLineOperationsStrings from '../number-line-operations-strings.js';
import numberLineOperations from '../numberLineOperations.js';
import NLOGenericModel from './model/NLOGenericModel.js';
import NLOGenericScreenView from './view/NLOGenericScreenView.js';

class NLOGenericScreen extends Screen {

  /**
   * @param {Tandem} tandem
   */
  constructor( tandem ) {

    const options = {
      name: numberLineOperationsStrings.screen.generic,
      backgroundColorProperty: new Property( 'white' ),
      tandem: tandem
    };

    super(
      () => new NLOGenericModel( tandem.createTandem( 'model' ) ),
      model => new NLOGenericScreenView( model, tandem.createTandem( 'view' ) ),
      options
    );
  }
}

numberLineOperations.register( 'NLOGenericScreen', NLOGenericScreen );
export default NLOGenericScreen;