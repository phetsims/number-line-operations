// Copyright 2020, University of Colorado Boulder

/**
 * TotalValueAccordionBox is an accordion box that displays the value of a provided Property and allows customization of
 * the title and label through the options.
 *
 * @author John Blanco (PhET Interactive Simulations)
 */

import NLCConstants from '../../../../number-line-common/js/common/NLCConstants.js';
import merge from '../../../../phet-core/js/merge.js';
import StringUtils from '../../../../phetcommon/js/util/StringUtils.js';
import MathSymbols from '../../../../scenery-phet/js/MathSymbols.js';
import PhetFont from '../../../../scenery-phet/js/PhetFont.js';
import Text from '../../../../scenery/js/nodes/Text.js';
import AccordionBox from '../../../../sun/js/AccordionBox.js';
import numberLineOperations from '../../numberLineOperations.js';
import numberLineOperationsStrings from '../../numberLineOperationsStrings.js';

// constants
const DEFAULT_WIDTH = 350; // empirically determined to look decent

class TotalValueAccordionBox extends AccordionBox {

  /**
   * @param {NumberProperty} totalValueProperty
   * @param options
   */
  constructor( totalValueProperty, options ) {

    options = merge( {
      titleText: numberLineOperationsStrings.total,
      labelText: numberLineOperationsStrings.total,
      showTotalAsCurrency: false,
      minWidth: DEFAULT_WIDTH,
      maxWidth: DEFAULT_WIDTH
    }, NLCConstants.ACCORDION_BOX_COMMON_OPTIONS, options );

    const totalReadoutNode = new Text( '', {
      font: new PhetFont( 26 ),
      maxWidth: DEFAULT_WIDTH * 0.9
    } );

    totalValueProperty.link( totalValue => {
      let readoutText;
      if ( options.showTotalAsCurrency ) {
        readoutText = StringUtils.fillIn( numberLineOperationsStrings.totalCurrencyPattern, {
          totalString: options.labelText,
          sign: totalValue < 0 ? MathSymbols.MINUS : '',
          currencyUnits: numberLineOperationsStrings.currencyUnits,
          totalValue: Math.abs( totalValue )
        } );
      }
      else {
        readoutText = StringUtils.fillIn( numberLineOperationsStrings.totalValuePattern, {
          totalString: options.labelText,
          totalValue: totalValue
        } );
      }
      totalReadoutNode.text = readoutText;
    } );

    // accordion box title node
    const titleNode = new Text( options.titleText, { font: new PhetFont( 18 ) } );

    super( totalReadoutNode, merge( options, { titleNode: titleNode } ) );
  }
}

numberLineOperations.register( 'TotalValueAccordionBox', TotalValueAccordionBox );
export default TotalValueAccordionBox;
