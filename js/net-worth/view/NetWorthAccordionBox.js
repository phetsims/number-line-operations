// Copyright 2020, University of Colorado Boulder

import merge from '../../../../phet-core/js/merge.js';
import StringUtils from '../../../../phetcommon/js/util/StringUtils.js';
import PhetFont from '../../../../scenery-phet/js/PhetFont.js';
import AccordionBox from '../../../../sun/js/AccordionBox.js';
import Text from '../../../../scenery/js/nodes/Text.js';
import numberLineOperationsStrings from '../../number-line-operations-strings.js';
import numberLineOperations from '../../numberLineOperations.js';

// constants
const DEFAULT_WIDTH = 300; // empirically determined to look decent

class NetWorthAccordionBox extends AccordionBox {

  /**
   * @param {NumberProperty} netWorthProperty
   * @param options
   */
  constructor( netWorthProperty, options ) {

    options = merge( {
      minWidth: DEFAULT_WIDTH,
      maxWidth: DEFAULT_WIDTH,
      cornerRadius: 5
    }, options );

    const netWorthText = new Text( '', {
      font: new PhetFont( 20 ),
      maxWidth: DEFAULT_WIDTH * 0.9
    } );

    netWorthProperty.link( netWorth => {
      netWorthText.text = StringUtils.fillIn( numberLineOperationsStrings.netWorthPattern, {
        currencyUnits: numberLineOperationsStrings.currencyUnits,
        netWorth: netWorth
      } );
    } );

    super( netWorthText, options );
  }
}

numberLineOperations.register( 'NetWorthAccordionBox', NetWorthAccordionBox );
export default NetWorthAccordionBox;