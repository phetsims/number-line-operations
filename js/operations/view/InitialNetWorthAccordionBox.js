// Copyright 2020, University of Colorado Boulder

import Property from '../../../../axon/js/Property.js';
import Range from '../../../../dot/js/Range.js';
import merge from '../../../../phet-core/js/merge.js';
import NumberPicker from '../../../../scenery-phet/js/NumberPicker.js';
import PhetFont from '../../../../scenery-phet/js/PhetFont.js';
import HBox from '../../../../scenery/js/nodes/HBox.js';
import RichText from '../../../../scenery/js/nodes/RichText.js';
import Text from '../../../../scenery/js/nodes/Text.js';
import Color from '../../../../scenery/js/util/Color.js';
import AccordionBox from '../../../../sun/js/AccordionBox.js';
import NLOConstants from '../../common/NLOConstants.js';
import numberLineOperations from '../../numberLineOperations.js';
import numberLineOperationsStrings from '../../numberLineOperationsStrings.js';

/**
 * InitialNetWorthAccordionBox displays the initial net worth value, which is provided as a property, in an accordion
 * box.
 */
class InitialNetWorthAccordionBox extends AccordionBox {

  /**
   * @param {NumberProperty} initialNetWorthProperty
   * @param {Object} [options]
   */
  constructor( initialNetWorthProperty, options ) {

    options = merge( {
      titleNode: new Text( numberLineOperationsStrings.initialNetWorth, { font: new PhetFont( 18 ) } )
    }, NLOConstants.ACCORDION_BOX_COMMON_OPTIONS, options );

    const label = new RichText( numberLineOperationsStrings.initialNetWorthWithBreak, {
      align: 'center',
      font: new PhetFont( 24 )
    } );

    const equalsAndCurrencyUnits = new Text( '= ' + numberLineOperationsStrings.currencyUnits, {
      font: new PhetFont( 24 )
    } );

    const initialNetWorthPicker = new NumberPicker(
      initialNetWorthProperty,
      new Property( new Range( -1000, 1000 ) ),
      {
        upFunction: value => value + 100,
        downFunction: value => value - 100,
        yMargin: 10,
        arrowHeight: 10,
        color: Color.BLACK,
        font: new PhetFont( 20 )
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