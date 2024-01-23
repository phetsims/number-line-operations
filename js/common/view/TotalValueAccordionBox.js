// Copyright 2020-2024, University of Colorado Boulder

/**
 * TotalValueAccordionBox is an accordion box that displays the value of a provided Property and allows customization of
 * the title and label through the options.
 *
 * @author John Blanco (PhET Interactive Simulations)
 */

import DerivedProperty from '../../../../axon/js/DerivedProperty.js';
import DerivedStringProperty from '../../../../axon/js/DerivedStringProperty.js';
import NLCConstants from '../../../../number-line-common/js/common/NLCConstants.js';
import merge from '../../../../phet-core/js/merge.js';
import StringUtils from '../../../../phetcommon/js/util/StringUtils.js';
import MathSymbols from '../../../../scenery-phet/js/MathSymbols.js';
import PhetFont from '../../../../scenery-phet/js/PhetFont.js';
import { Text } from '../../../../scenery/js/imports.js';
import AccordionBox from '../../../../sun/js/AccordionBox.js';
import numberLineOperations from '../../numberLineOperations.js';
import NumberLineOperationsStrings from '../../NumberLineOperationsStrings.js';

// constants
const DEFAULT_WIDTH = 350; // empirically determined to look decent

class TotalValueAccordionBox extends AccordionBox {

  /**
   * @param {NumberProperty} totalValueProperty
   * @param options
   */
  constructor( totalValueProperty, options ) {

    options = merge( {
      titleText: NumberLineOperationsStrings.totalStringProperty,
      labelText: NumberLineOperationsStrings.totalStringProperty,
      showTotalAsCurrency: false,
      minWidth: DEFAULT_WIDTH,
      maxWidth: DEFAULT_WIDTH
    }, NLCConstants.ACCORDION_BOX_COMMON_OPTIONS, options );

    const signProperty = new DerivedProperty(
      [ totalValueProperty ],
      totalValue => totalValue < 0 ? MathSymbols.MINUS : ''
    );

    const readoutStringProperty = new DerivedStringProperty(
      [
        NumberLineOperationsStrings.totalCurrencyPatternStringProperty,
        NumberLineOperationsStrings.totalValuePatternStringProperty,
        NumberLineOperationsStrings.currencyUnitsStringProperty,
        options.labelText,
        totalValueProperty,
        signProperty
      ],
      ( totalCurrencyPattern, totalValuePattern, currencyUnits, label, totalValue, sign ) => {
        let readoutString;
        if ( options.showTotalAsCurrency ) {
          readoutString = StringUtils.fillIn( totalCurrencyPattern, {
            totalString: label,
            sign: sign,
            currencyUnits: currencyUnits,
            totalValue: Math.abs( totalValue )
          } );
        }
        else {
          readoutString = StringUtils.fillIn( totalValuePattern, {
            totalString: label,
            totalValue: `${sign}${Math.abs( totalValue )}`
          } );
        }
        return readoutString;
      }
    );

    const totalReadoutText = new Text( readoutStringProperty, {
      font: new PhetFont( 26 ),
      maxWidth: DEFAULT_WIDTH * 0.9
    } );

    // accordion box title node
    const titleNode = new Text( options.titleText, { font: new PhetFont( 18 ) } );

    super( totalReadoutText, merge( options, { titleNode: titleNode } ) );
  }
}

numberLineOperations.register( 'TotalValueAccordionBox', TotalValueAccordionBox );
export default TotalValueAccordionBox;
