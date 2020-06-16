// Copyright 2020, University of Colorado Boulder

import merge from '../../../../phet-core/js/merge.js';
import StringUtils from '../../../../phetcommon/js/util/StringUtils.js';
import MathSymbols from '../../../../scenery-phet/js/MathSymbols.js';
import PhetFont from '../../../../scenery-phet/js/PhetFont.js';
import AccordionBox from '../../../../sun/js/AccordionBox.js';
import Text from '../../../../scenery/js/nodes/Text.js';
import numberLineOperationsStrings from '../../numberLineOperationsStrings.js';
import numberLineOperations from '../../numberLineOperations.js';
import NLCConstants from '../../../../number-line-common/js/common/NLCConstants.js';

// constants
const DEFAULT_WIDTH = 300; // empirically determined to look decent

class NetWorthAccordionBox extends AccordionBox {

  /**
   * @param {NumberProperty} netWorthProperty
   * @param options
   */
  constructor( netWorthProperty, options ) {

    options = merge( {
      titleNode: new Text( numberLineOperationsStrings.netWorth, { font: new PhetFont( 18 ) } ),
      minWidth: DEFAULT_WIDTH,
      maxWidth: DEFAULT_WIDTH
    }, NLCConstants.ACCORDION_BOX_COMMON_OPTIONS, options );

    const netWorthTextNode = new Text( '', {
      font: new PhetFont( 20 ),
      maxWidth: DEFAULT_WIDTH * 0.9
    } );

    netWorthProperty.link( netWorth => {
      netWorthTextNode.text = StringUtils.fillIn( numberLineOperationsStrings.netWorthPattern, {
        netWorthString: numberLineOperationsStrings.netWorth,
        sign: netWorth < 0 ? MathSymbols.UNARY_MINUS : '',
        currencyUnits: numberLineOperationsStrings.currencyUnits,
        netWorthValue: Math.abs( netWorth )
      } );
    } );

    super( netWorthTextNode, options );
  }
}

numberLineOperations.register( 'NetWorthAccordionBox', NetWorthAccordionBox );
export default NetWorthAccordionBox;
