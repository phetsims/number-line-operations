// Copyright 2020, University of Colorado Boulder

import BooleanProperty from '../../../../axon/js/BooleanProperty.js';
import Property from '../../../../axon/js/Property.js';
import Dimension2 from '../../../../dot/js/Dimension2.js';
import NLCConstants from '../../../../number-line-common/js/common/NLCConstants.js';
import MathSymbols from '../../../../scenery-phet/js/MathSymbols.js';
import PhetFont from '../../../../scenery-phet/js/PhetFont.js';
import Rectangle from '../../../../scenery/js/nodes/Rectangle.js';
import Text from '../../../../scenery/js/nodes/Text.js';
import Color from '../../../../scenery/js/util/Color.js';
import AccordionBox from '../../../../sun/js/AccordionBox.js';
import RectangularMomentaryButton from '../../../../sun/js/buttons/RectangularMomentaryButton.js';
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
class NumericalExpressionAccordionBox extends AccordionBox {

  /**
   * @param {OperationTrackingNumberLine} numberLine
   * @param {Object} [options]
   * @public
   */
  constructor( numberLine, options ) {

    options = merge( {
      fill: Color.WHITE,
      showTitleWhenExpanded: false,
      cornerRadius: NLCConstants.ACCORDION_BOX_CORNER_RADIUS
    }, options );

    // Create a transparent background that will serve as the root node.  Everything should be made to fit within this.
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

    // evaluate button
    const evaluateProperty = new BooleanProperty( false );
    contentRoot.addChild( new RectangularMomentaryButton( false, true, evaluateProperty, {
      content: new Text( MathSymbols.EQUAL_TO, { font: new PhetFont( 20 ) } ),
      baseColor: new Color( 0xfdfd96 ),
      xMargin: 5,
      yMargin: 1,
      right: CONTENT_DIMENSIONS.width,
      bottom: CONTENT_DIMENSIONS.height
    } ) );

    // numerical expression
    const numericalExpression = new NumericalExpression( numberLine, simplifyProperty, evaluateProperty, { top: 0 } );
    contentRoot.addChild( numericalExpression );
    numericalExpression.boundsProperty.link( () => {
      numericalExpression.centerX = CONTENT_DIMENSIONS.width / 2;
      numericalExpression.top = 0;
    } );

    super( contentRoot, options );

    // @private - make this available so it can be reset
    this.simplifyProperty = simplifyProperty;
  }

  /**
   * restore initial state
   * @public
   */
  reset() {
    this.simplifyProperty.reset();
  }
}

/**
 * a numerical expression that describes the operations on the number line
 */
class NumericalExpression extends Text {

  /**
   * @param {OperationTrackingNumberLine} numberLine
   * @param {BooleanProperty} simplifyProperty
   * @param {BooleanProperty} evaluateProperty
   * @param {Object} [options]
   * @public
   */
  constructor( numberLine, simplifyProperty, evaluateProperty, options ) {
    options = merge( { font: new PhetFont( 30 ) }, options );
    super( '', options );

    // function closure to update the text that defines the expression
    const update = () => {
      const activeOperations = numberLine.getActiveOperations();
      if ( evaluateProperty.value || activeOperations.length === 0 ) {
        this.text = numberLine.getCurrentEndValue();
      }
      else {

        // make a list of all the values and operations
        const valuesAndOperations = [];

        // add the starting value
        valuesAndOperations.push( numberLine.startingValueProperty.value );

        // go through the operations, adding the values and operation types to the list
        activeOperations.forEach( ( operation, index ) => {

          // the first operation is a special case - it's not included if the starting value was left off
          if ( index > 0 || valuesAndOperations.length > 0 ) {
            valuesAndOperations.push( operation.operationTypeProperty.value );
          }
          valuesAndOperations.push( operation.amountProperty.value );
        } );

        if ( simplifyProperty.value ) {

          // if simplifying, replace subtraction of a negative with addition and addition of a negative with subtraction
          for ( let i = 1; i < valuesAndOperations.length; i++ ) {
            if ( typeof valuesAndOperations[ i ] === 'number' && valuesAndOperations[ i ] < 0 ) {
              valuesAndOperations[ i ] = Math.abs( valuesAndOperations[ i ] );
              if ( valuesAndOperations[ i - 1 ] === Operations.ADDITION ) {
                valuesAndOperations[ i - 1 ] = Operations.SUBTRACTION;
              }
              else {
                valuesAndOperations[ i - 1 ] = Operations.ADDITION;
              }
            }
          }
        }

        let numericalExpression = '';
        valuesAndOperations.forEach( valueOrOperation => {
          if ( typeof valueOrOperation === 'number' ) {
            numericalExpression += valueOrOperation;
          }
          else {
            const operationChar = valueOrOperation === Operations.ADDITION ? MathSymbols.PLUS : MathSymbols.MINUS;
            numericalExpression += ' ' + operationChar + ' ';
          }
        } );
        this.text = numericalExpression;
      }
    };

    // Hook up the various properties that should trigger an update.
    evaluateProperty.link( update );
    simplifyProperty.link( update );
    numberLine.startingValueProperty.link( update );
    numberLine.operations.forEach( operation => {
      Property.multilink(
        [ operation.isActiveProperty, operation.amountProperty, operation.operationTypeProperty ],
        update
      );
    } );
  }
}

numberLineOperations.register( 'NumericalExpressionAccordionBox', NumericalExpressionAccordionBox );
export default NumericalExpressionAccordionBox;