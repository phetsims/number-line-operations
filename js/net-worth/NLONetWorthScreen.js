// Copyright 2020-2021, University of Colorado Boulder

/**
 * @author John Blanco (PhET Interactive Simulations)
 */

import Property from '../../../axon/js/Property.js';
import Screen from '../../../joist/js/Screen.js';
import numberLineOperations from '../numberLineOperations.js';
import numberLineOperationsStrings from '../numberLineOperationsStrings.js';
import NLONetWorthModel from './model/NLONetWorthModel.js';
import NetWorthIcon from './view/NetWorthIcon.js';
import NLONetWorthScreenView from './view/NLONetWorthScreenView.js';

class NLONetWorthScreen extends Screen {

  /**
   * @param {Tandem} tandem
   */
  constructor( tandem ) {

    const options = {
      name: numberLineOperationsStrings.screen.netWorth,
      backgroundColorProperty: new Property( '#f8f6fe' ),
      homeScreenIcon: new NetWorthIcon(),
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