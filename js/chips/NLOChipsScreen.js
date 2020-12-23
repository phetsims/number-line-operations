// Copyright 2020, University of Colorado Boulder

/**
 * @author John Blanco (PhET Interactive Simulations)
 */

import Property from '../../../axon/js/Property.js';
import Screen from '../../../joist/js/Screen.js';
import ScreenIcon from '../../../joist/js/ScreenIcon.js';
import Image from '../../../scenery/js/nodes/Image.js';
import chipsHomeScreenIcon from '../../images/chips-home-screen-icon_png.js';
import numberLineOperations from '../numberLineOperations.js';
import numberLineOperationsStrings from '../numberLineOperationsStrings.js';
import NLOChipsModel from './model/NLOChipsModel.js';
import NLOChipsScreenView from './view/NLOChipsScreenView.js';

class NLOChipsScreen extends Screen {

  /**
   * @param {Tandem} tandem
   */
  constructor( tandem ) {

    const options = {
      name: numberLineOperationsStrings.screen.chips,
      backgroundColorProperty: new Property( '#f8f6fe' ),
      homeScreenIcon: new ScreenIcon( new Image( chipsHomeScreenIcon ), {
        maxIconWidthProportion: 1,
        maxIconHeightProportion: 1
      } ),
      tandem: tandem
    };

    super(
      () => new NLOChipsModel( tandem.createTandem( 'model' ) ),
      model => new NLOChipsScreenView( model, tandem.createTandem( 'view' ) ),
      options
    );
  }
}

numberLineOperations.register( 'NLOChipsScreen', NLOChipsScreen );
export default NLOChipsScreen;