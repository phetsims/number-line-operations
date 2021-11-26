// Copyright 2020-2021, University of Colorado Boulder

/**
 * @author John Blanco (PhET Interactive Simulations)
 */

import Property from '../../../axon/js/Property.js';
import Screen from '../../../joist/js/Screen.js';
import ScreenIcon from '../../../joist/js/ScreenIcon.js';
import { Image } from '../../../scenery/js/imports.js';
import genericHomeScreenIcon from '../../images/generic-home-screen-icon_png.js';
import numberLineOperations from '../numberLineOperations.js';
import numberLineOperationsStrings from '../numberLineOperationsStrings.js';
import NLOGenericModel from './model/NLOGenericModel.js';
import NLOGenericScreenView from './view/NLOGenericScreenView.js';

class NLOGenericScreen extends Screen {

  /**
   * @param {Tandem} tandem
   */
  constructor( tandem ) {

    const options = {
      name: numberLineOperationsStrings.screen.generic,
      backgroundColorProperty: new Property( '#f3fffe' ),
      homeScreenIcon: new ScreenIcon( new Image( genericHomeScreenIcon ), {
        maxIconWidthProportion: 1,
        maxIconHeightProportion: 1
      } ),
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