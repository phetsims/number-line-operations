// Copyright 2020, University of Colorado Boulder

import merge from '../../../../phet-core/js/merge.js';
import StringUtils from '../../../../phetcommon/js/util/StringUtils.js';
import MathSymbols from '../../../../scenery-phet/js/MathSymbols.js';
import PhetFont from '../../../../scenery-phet/js/PhetFont.js';
import AccordionBox from '../../../../sun/js/AccordionBox.js';
import Text from '../../../../scenery/js/nodes/Text.js';
import numberLineOperationsStrings from '../../numberLineOperationsStrings.js';
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
      titleNode: new Text( numberLineOperationsStrings.netWorth, { font: new PhetFont( 18 ) } ),
      fill: 'white',
      showTitleWhenExpanded: false,
      minWidth: DEFAULT_WIDTH,
      maxWidth: DEFAULT_WIDTH,
      cornerRadius: 5,
      buttonXMargin: 8,
      buttonYMargin: 6,
      expandCollapseButtonOptions: {
        touchAreaXDilation: 15,
        touchAreaYDilation: 15,
        mouseAreaXDilation: 5,
        mouseAreaYDilation: 5
      }
    }, options );

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