// Copyright 2020, University of Colorado Boulder

import BooleanProperty from '../../../../axon/js/BooleanProperty.js';
import Dimension2 from '../../../../dot/js/Dimension2.js';
import NLCConstants from '../../../../number-line-common/js/common/NLCConstants.js';
import MathSymbols from '../../../../scenery-phet/js/MathSymbols.js';
import PhetFont from '../../../../scenery-phet/js/PhetFont.js';
import Rectangle from '../../../../scenery/js/nodes/Rectangle.js';
import Text from '../../../../scenery/js/nodes/Text.js';
import Color from '../../../../scenery/js/util/Color.js';
import AccordionBox from '../../../../sun/js/AccordionBox.js';
import Checkbox from '../../../../sun/js/Checkbox.js';
import Operations from '../../common/model/Operations.js';
import numberLineOperations from '../../numberLineOperations.js';
import numberLineOperationsStrings from '../../numberLineOperationsStrings.js';
import merge from '../../../../phet-core/js/merge.js';

// constants
const CONTENT_DIMENSIONS = new Dimension2( 230, 60 ); // size based on design doc

/**
 * accordion box that contains a mathematical description of the operations on a number line
 */
class OperationDescriptionAccordionBox extends AccordionBox {

  /**
   * @param {OperationTrackingNumberLine} numberLine
   * @param {Object} [options]
   */
  constructor( numberLine, options ) {

    options = merge( {
      fill: Color.WHITE,
      showTitleWhenExpanded: false,
      cornerRadius: NLCConstants.ACCORDION_BOX_CORNER_RADIUS
    }, options );

    const contentRoot = new Rectangle( 0, 0, CONTENT_DIMENSIONS.width, CONTENT_DIMENSIONS.height, 5, 5, {
      fill: Color.TRANSPARENT
    } );

    // simplify checkbox
    const simplifyProperty = new BooleanProperty( false );
    contentRoot.addChild( new Checkbox(
      new Text( numberLineOperationsStrings.simplify, { font: new PhetFont( 20 ) } ),
      simplifyProperty,
      {
        centerX: contentRoot.width / 2,
        bottom: contentRoot.bottom
      }
    ) );

    // math sentence
    const mathSentence = new OperationMathSentence( numberLine, simplifyProperty, { top: 0 } );
    contentRoot.addChild( mathSentence );
    mathSentence.boundsProperty.link( () => {
      mathSentence.centerX = CONTENT_DIMENSIONS.width / 2;
      mathSentence.top = 0;
    } );

    super( contentRoot, options );
  }
}

/**
 * mathematical "sentence" that describes the operations
 */
class OperationMathSentence extends Text {

  /**
   * @param {OperationTrackingNumberLine} numberLine
   * @param {BooleanProperty} simplifyProperty
   * @param {Object} [options]
   */
  constructor( numberLine, simplifyProperty, options ) {
    options = merge( { font: new PhetFont( 30 ) }, options );
    super( '', options );

    // function closure to update the text
    const update = () => {

      // make a list of all the values and operations
      const valuesAndOperations = [];
      valuesAndOperations.push( numberLine.startingValueProperty.value );
      numberLine.operationsList.forEach( operation => {
        valuesAndOperations.push( operation.operationTypeProperty.value );
        valuesAndOperations.push( operation.amountProperty.value );
      } );

      let mathSentence = '';
      valuesAndOperations.forEach( valueOrOperation => {
        if ( typeof valueOrOperation === 'number' ) {
          mathSentence += valueOrOperation;
        }
        else {
          const operationChar = valueOrOperation === Operations.ADDITION ? MathSymbols.PLUS : MathSymbols.MINUS;
          mathSentence += ' ' + operationChar + ' ';
        }
      } );

      this.text = mathSentence;
    };

    numberLine.startingValueProperty.link( update );
    numberLine.operationsList.addItemAddedListener( addedOperation => {
      update();
      addedOperation.operationTypeProperty.lazyLink( update );
      addedOperation.amountProperty.lazyLink( update );
    } );
    numberLine.operationsList.addItemRemovedListener( removedOperation => {
      update();
      removedOperation.operationTypeProperty.unlink( update );
      removedOperation.amountProperty.unlink( update );
    } );
  }
}

numberLineOperations.register( 'OperationDescriptionAccordionBox', OperationDescriptionAccordionBox );
export default OperationDescriptionAccordionBox;