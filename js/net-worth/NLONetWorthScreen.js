// Copyright 2020, University of Colorado Boulder

/**
 * @author John Blanco
 */

import Property from '../../../axon/js/Property.js';
import Screen from '../../../joist/js/Screen.js';
import numberLineOperationsStrings from '../number-line-operations-strings.js';
import numberLineOperations from '../numberLineOperations.js';
import NLONetWorthModel from './model/NLONetWorthModel.js';
import NLONetWorthScreenView from './view/NLONetWorthScreenView.js';

class NLONetWorthScreen extends Screen {

  /**
   * @param {Tandem} tandem
   */
  constructor( tandem ) {

    const options = {
      name: numberLineOperationsStrings.screen.netWorth,
      backgroundColorProperty: new Property( 'white' ),
      tandem: tandem
    };

    super(
      () => new NLONetWorthModel( tandem.createTandem( 'model' ) ),
      model => new NLONetWorthScreenView( model, tandem.createTandem( 'view' ) ),
      options
    );
  }
}

numberLineOperations.register( 'NLONetWorthScreen', NLONetWorthScreen );
export default NLONetWorthScreen;