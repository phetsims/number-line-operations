// Copyright 2020, University of Colorado Boulder

/**
 * NumericalExpressionAccordionBox is an accordion box that contains a mathematical description of the operations on a
 * number line.
 *
 * @author John Blanco (PhET Interactive Simulations)
 */

import BooleanProperty from '../../../../axon/js/BooleanProperty.js';
import DerivedProperty from '../../../../axon/js/DerivedProperty.js';
import Emitter from '../../../../axon/js/Emitter.js';
import Property from '../../../../axon/js/Property.js';
import Dimension2 from '../../../../dot/js/Dimension2.js';
import NLCConstants from '../../../../number-line-common/js/common/NLCConstants.js';
import merge from '../../../../phet-core/js/merge.js';
import MathSymbols from '../../../../scenery-phet/js/MathSymbols.js';
import PhetFont from '../../../../scenery-phet/js/PhetFont.js';
import Node from '../../../../scenery/js/nodes/Node.js';
import Rectangle from '../../../../scenery/js/nodes/Rectangle.js';
import Text from '../../../../scenery/js/nodes/Text.js';
import Color from '../../../../scenery/js/util/Color.js';
import AccordionBox from '../../../../sun/js/AccordionBox.js';
import RectangularMomentaryButton from '../../../../sun/js/buttons/RectangularMomentaryButton.js';
import Operations from '../../common/model/Operations.js';
import numberLineOperations from '../../numberLineOperations.js';
import numberLineOperationsStrings from '../../numberLineOperationsStrings.js';

// constants
const CONTENT_DIMENSIONS = new Dimension2( 280, 70 ); // size based on design doc
const MOMENTARY_BUTTON_BASE_COLOR = new Color( 0xfdfd96 );
const MOMENTARY_BUTTON_TOUCH_AREA_DILATION = 8;

class NumericalExpressionAccordionBox extends AccordionBox {

  /**
   * @param {OperationTrackingNumberLine} numberLine
   * @param {Object} [options]
   * @public
   */
  constructor( numberLine, options ) {

    options = merge( {
      titleNode: new Text(
        numberLineOperationsStrings.netWorth,
        {
          font: new PhetFont( 18 ),
          maxWidth: CONTENT_DIMENSIONS.width * 0.9
        }
      )
    }, NLCConstants.ACCORDION_BOX_COMMON_OPTIONS, options );

    assert && assert( numberLine.operations.length === 2, 'this indicator is designed to work with exactly two operations' );

    // Create a transparent background that will serve as the root node.  Everything should be made to fit within this.
    const contentRoot = new Rectangle( 0, 0, CONTENT_DIMENSIONS.width, CONTENT_DIMENSIONS.height, 5, 5, {
      fill: Color.TRANSPARENT
    } );

    // Create a DerivedProperty that is true when there are negative values in the expression, which means that
    // simplification is possible.  This will be used as the enabled Property for the simplify button.
    const simplificationPossibleProperty = new DerivedProperty(
      [
        numberLine.operations[ 0 ].isActiveProperty,
        numberLine.operations[ 0 ].amountProperty,
        numberLine.operations[ 1 ].isActiveProperty,
        numberLine.operations[ 1 ].amountProperty
      ],
      ( firstOperationIsActive, firstOperationValue, secondOperationIsActive, secondOperationValue ) => {
        return ( firstOperationIsActive && firstOperationValue < 0 ) ||
               ( secondOperationIsActive && secondOperationValue < 0 );
      }
    );

    // simplify button
    const simplifyProperty = new BooleanProperty( false );
    const simplifyButton = new RectangularMomentaryButton( false, true, simplifyProperty, {
      content: new Text( numberLineOperationsStrings.simplify, { font: new PhetFont( 16 ), maxWidth: 200 } ),
      baseColor: MOMENTARY_BUTTON_BASE_COLOR,
      enabledProperty: simplificationPossibleProperty,
      xMargin: 5,
      yMargin: 3.5,
      touchAreaXDilation: MOMENTARY_BUTTON_TOUCH_AREA_DILATION,
      touchAreaYDilation: MOMENTARY_BUTTON_TOUCH_AREA_DILATION
    } );

    // Create a DerivedProperty that is true when there are one or more active operations.  This will be used as the
    // enabled Property for the evaluate button.
    const evaluationPossibleProperty = new DerivedProperty(
      [
        numberLine.operations[ 0 ].isActiveProperty,
        numberLine.operations[ 1 ].isActiveProperty
      ],
      ( firstOperationIsActive, secondOperationIsActive ) => {
        return firstOperationIsActive || secondOperationIsActive;
      }
    );

    // evaluate button
    const evaluateProperty = new BooleanProperty( false );
    const evaluateButton = new RectangularMomentaryButton( false, true, evaluateProperty, {
      content: new Text( MathSymbols.EQUAL_TO, { font: new PhetFont( 20 ) } ),
      baseColor: MOMENTARY_BUTTON_BASE_COLOR,
      enabledProperty: evaluationPossibleProperty,
      xMargin: 5,
      yMargin: 1,
      touchAreaXDilation: MOMENTARY_BUTTON_TOUCH_AREA_DILATION,
      touchAreaYDilation: MOMENTARY_BUTTON_TOUCH_AREA_DILATION
    } );

    // TODO: The layout of these buttons is going through some churn.  Delete whatever isn't used when this gets finalized.  See https://github.com/phetsims/number-line-operations/issues/30.
    // Position the buttons and put them together into a node so that they can be positioned as a group.

    // This one centers the space between the buttons with the expression.
    // const interButtonSpacing = 20;
    // simplifyButton.right = CONTENT_DIMENSIONS.width / 2 - interButtonSpacing / 2;
    // evaluateButton.left = CONTENT_DIMENSIONS.width / 2 + interButtonSpacing / 2;
    // const buttonsNode = new Node( {
    //   children: [ simplifyButton, evaluateButton ],
    //   bottom: CONTENT_DIMENSIONS.height
    // } );
    // contentRoot.addChild( buttonsNode );

    // This one centers the buttons as a whole under the expression.
    simplifyButton.x = 0;
    evaluateButton.left = simplifyButton.width + 20;
    const buttonsNode = new Node( {
      children: [ simplifyButton, evaluateButton ],
      centerX: CONTENT_DIMENSIONS.width / 2,
      bottom: CONTENT_DIMENSIONS.height
    } );
    contentRoot.addChild( buttonsNode );

    // numerical expression
    const numericalExpression = new NumericalExpression(
      numberLine,
      simplifyProperty,
      evaluateProperty,
      {
        top: 0,
        maxWidth: CONTENT_DIMENSIONS.width
      }
    );
    contentRoot.addChild( numericalExpression );

    // Keep the numerical expression centered.
    const centerNumericalExpression = () => {
      numericalExpression.centerX = CONTENT_DIMENSIONS.width / 2;
      numericalExpression.top = 0;
    };
    centerNumericalExpression();
    numericalExpression.updatedEmitter.addListener( centerNumericalExpression );

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

    // @public (listen-only) - used to signal updates, was necessary because listening to bounds changes wasn't working
    this.updatedEmitter = new Emitter();

    // function closure to update the text that defines the expression
    const update = () => {
      const activeOperations = numberLine.getActiveOperations();
      if ( evaluateProperty.value || activeOperations.length === 0 ) {

        // use minus sign instead of unary minus, see https://github.com/phetsims/number-line-operations/issues/9
        const endValue = numberLine.getCurrentEndValue();
        const signChar = endValue < 0 ? MathSymbols.MINUS : '';
        this.text = signChar + Math.abs( endValue ).toString( 10 );
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

        let numericalExpressionString = '';
        valuesAndOperations.forEach( valueOrOperation => {
          if ( typeof valueOrOperation === 'number' ) {

            // use minus sign instead of unary minus, see https://github.com/phetsims/number-line-operations/issues/9
            if ( valueOrOperation < 0 ) {
              numericalExpressionString += MathSymbols.MINUS;
            }
            numericalExpressionString += Math.abs( valueOrOperation );
          }
          else {
            const operationChar = valueOrOperation === Operations.ADDITION ? MathSymbols.PLUS : MathSymbols.MINUS;
            numericalExpressionString += ' ' + operationChar + ' ';
          }
        } );
        this.text = numericalExpressionString;
      }
      this.updatedEmitter.emit();
    };

    // Hook up the various properties that should trigger an update.
    numberLine.startingValueProperty.link( update );
    numberLine.operations.forEach( operation => {
      Property.multilink(
        [ operation.isActiveProperty, operation.amountProperty, operation.operationTypeProperty ],
        update
      );
    } );
    evaluateProperty.lazyLink( update );
    simplifyProperty.lazyLink( update );
  }
}

numberLineOperations.register( 'NumericalExpressionAccordionBox', NumericalExpressionAccordionBox );
export default NumericalExpressionAccordionBox;
