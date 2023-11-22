// Copyright 2020-2023, University of Colorado Boulder

/**
 * TotalValueAccordionBox is an accordion box that displays the value of a provided Property and allows customization of
 * the title and label through the options.
 *
 * @author John Blanco (PhET Interactive Simulations)
 */

import DerivedProperty from '../../../../axon/js/DerivedProperty.js';
import PatternStringProperty from '../../../../axon/js/PatternStringProperty.js';
import NLCConstants from '../../../../number-line-common/js/common/NLCConstants.js';
import merge from '../../../../phet-core/js/merge.js';
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

    const signProperty = new DerivedProperty( [ totalValueProperty ], totalValue => totalValue < 0 ? MathSymbols.MINUS : '' );

    let readoutStringProperty;
    if ( options.showTotalAsCurrency ) {
      readoutStringProperty = new PatternStringProperty( NumberLineOperationsStrings.totalCurrencyPatternStringProperty, {
        totalString: options.labelText,
        sign: signProperty,
        currencyUnits: NumberLineOperationsStrings.currencyUnitsStringProperty,
        totalValue: totalValueProperty
      }, {
        maps: {
          totalValue: value => Math.abs( value )
        }
      } );
    }
    else {
      readoutStringProperty = new PatternStringProperty( NumberLineOperationsStrings.totalValuePatternStringProperty, {
        totalString: options.labelText,
        totalValue: totalValueProperty
      }, {
        maps: {
          totalValue: value => signProperty.value + Math.abs( value ).toString( 10 )
        }
      } );
    }

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
