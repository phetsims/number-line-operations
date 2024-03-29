// Copyright 2021-2023, University of Colorado Boulder

/**
 * NetWorthIcon is the icon that is used for the home screen and nav bar for the "Net Worth" screen.  It consists of an
 * image of a piggy bank with a translatable currency symbol on it.
 *
 * @author John Blanco (PhET Interactive Simulations)
 */

import ScreenIcon from '../../../../joist/js/ScreenIcon.js';
import PhetFont from '../../../../scenery-phet/js/PhetFont.js';
import { Color, Image, ManualConstraint, Text } from '../../../../scenery/js/imports.js';
import netWorthHomeScreenIcon_png from '../../../images/netWorthHomeScreenIcon_png.js';
import numberLineOperations from '../../numberLineOperations.js';
import NumberLineOperationsStrings from '../../NumberLineOperationsStrings.js';

class NetWorthIcon extends ScreenIcon {

  constructor() {
    const piggyBankImage = new Image( netWorthHomeScreenIcon_png );
    const currencySymbol = new Text( NumberLineOperationsStrings.currencyUnitsStringProperty, {

      fill: Color.WHITE,
      stroke: Color.black,

      // font size and scale were arrived at empirically
      font: new PhetFont( 32 ),
      scale: 8,
      maxWidth: 50
    } );

    piggyBankImage.addChild( currencySymbol );

    super( piggyBankImage, {
      maxIconWidthProportion: 1,
      maxIconHeightProportion: 1
    } );

    ManualConstraint.create( this, [ currencySymbol ], symbolProxy => {
      symbolProxy.centerX = piggyBankImage.width * 0.5;
      symbolProxy.centerY = piggyBankImage.height * 0.5 + 25;
    } );
  }
}

numberLineOperations.register( 'NetWorthIcon', NetWorthIcon );
export default NetWorthIcon;