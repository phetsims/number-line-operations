// Copyright 2020, University of Colorado Boulder

/**
 * @author John Blanco
 */

import Property from '../../../axon/js/Property.js';
import Screen from '../../../joist/js/Screen.js';
import RandomIcon from '../common/RandomIcon.js';
import numberLineOperationsStrings from '../numberLineOperationsStrings.js';
import numberLineOperations from '../numberLineOperations.js';
import NLONetWorthModel from './model/NLONetWorthModel.js';
import NLONetWorthScreenView from './view/NLONetWorthScreenView.js';

class NLONetWorthScreen extends Screen {

  /**
   * @param {Tandem} tandem
   */
  constructor( tandem ) {

    const randomIcon = new RandomIcon( 575 );

    const options = {
      name: numberLineOperationsStrings.screen.netWorth,
      homeScreenIcon: randomIcon,
      navigationBarIcon: randomIcon,
      backgroundColorProperty: new Property( '#f8f6fe' ),
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