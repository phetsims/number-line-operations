// Copyright 2020, University of Colorado Boulder

/**
 * InitialNetWorthAccordionBox displays the initial net worth value, which is provided as a Property, in an accordion
 * box.
 *
 * @author John Blanco (PhET Interactive Simulations)
 */

import NLCConstants from '../../../../number-line-common/js/common/NLCConstants.js';
import merge from '../../../../phet-core/js/merge.js';
import NumberPicker from '../../../../scenery-phet/js/NumberPicker.js';
import PhetFont from '../../../../scenery-phet/js/PhetFont.js';
import HBox from '../../../../scenery/js/nodes/HBox.js';
import RichText from '../../../../scenery/js/nodes/RichText.js';
import Text from '../../../../scenery/js/nodes/Text.js';
import AccordionBox from '../../../../sun/js/AccordionBox.js';
import NLOConstants from '../../common/NLOConstants.js';
import numberLineOperations from '../../numberLineOperations.js';
import numberLineOperationsStrings from '../../numberLineOperationsStrings.js';

class InitialNetWorthAccordionBox extends AccordionBox {

  /**
   * @param {NumberProperty} initialNetWorthProperty
   * @param {Property.<Range>} netWorthRangeProperty
   * @param {Object} [options]
   */
  constructor( initialNetWorthProperty, netWorthRangeProperty, options ) {

    options = merge( {
      titleNode: new Text( numberLineOperationsStrings.initialNetWorth, {
        font: new PhetFont( 18 ),
        maxWidth: 200 // empirically determined using stringTest=long
      } )
    }, NLCConstants.ACCORDION_BOX_COMMON_OPTIONS, options );

    const label = new RichText( numberLineOperationsStrings.initialNetWorthWithBreak, {
      align: 'center',
      font: new PhetFont( 24 ),
      maxWidth: 150 // empirically determined using stringTest=long
    } );

    const equalsAndCurrencyUnits = new Text( '= ' + numberLineOperationsStrings.currencyUnits, {
      font: new PhetFont( 24 ),
      maxWidth: 150 // empirically determined using stringTest=long
    } );

    const initialNetWorthPicker = new NumberPicker(
      initialNetWorthProperty,
      netWorthRangeProperty,
      {
        incrementFunction: value => value + 100,
        decrementFunction: value => value - 100,
        yMargin: 10,
        arrowHeight: 10,
        color: NLOConstants.DARK_BLUE_POINT_COLOR,
        font: new PhetFont( 26 )
      }
    );

    const content = new HBox( {
      children: [ label, equalsAndCurrencyUnits, initialNetWorthPicker ],
      spacing: 15
    } );

    super( content, options );
  }
}

numberLineOperations.register( 'InitialNetWorthAccordionBox', InitialNetWorthAccordionBox );
export default InitialNetWorthAccordionBox;
