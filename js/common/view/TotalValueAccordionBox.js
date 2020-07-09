// Copyright 2020, University of Colorado Boulder

/**
 * TotalValueAccordionBox is an accordion box that diplays the value of a provided property and allows customization of
 * the title and label through the options.
 */

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

class TotalValueAccordionBox extends AccordionBox {

  /**
   * @param {NumberProperty} totalValueProperty
   * @param options
   */
  constructor( totalValueProperty, options ) {

    options = merge( {
      titleAndLabelText: numberLineOperationsStrings.total,
      minWidth: DEFAULT_WIDTH,
      maxWidth: DEFAULT_WIDTH
    }, NLCConstants.ACCORDION_BOX_COMMON_OPTIONS, options );

    const totalReadoutNode = new Text( '', {
      font: new PhetFont( 20 ),
      maxWidth: DEFAULT_WIDTH * 0.9
    } );

    totalValueProperty.link( totalValue => {
      totalReadoutNode.text = StringUtils.fillIn( numberLineOperationsStrings.totalPattern, {
        totalString: options.titleAndLabelText,
        sign: totalValue < 0 ? MathSymbols.MINUS : '',
        currencyUnits: numberLineOperationsStrings.currencyUnits,
        netWorthValue: Math.abs( totalValue )
      } );
    } );

    // accordion box title node
    const titleNode = new Text( options.titleAndLabelText, { font: new PhetFont( 18 ) } );

    super( totalReadoutNode, merge( options, { titleNode: titleNode } ) );
  }
}

numberLineOperations.register( 'TotalValueAccordionBox', TotalValueAccordionBox );
export default TotalValueAccordionBox;
