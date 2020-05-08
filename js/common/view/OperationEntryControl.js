// Copyright 2020, University of Colorado Boulder

import merge from '../../../../phet-core/js/merge.js';
import Matrix3 from '../../../../dot/js/Matrix3.js';
import Range from '../../../../dot/js/Range.js';
import Property from '../../../../axon/js/Property.js';
import Shape from '../../../../kite/js/Shape.js';
import EraserButton from '../../../../scenery-phet/js/buttons/EraserButton.js';
import MathSymbols from '../../../../scenery-phet/js/MathSymbols.js';
import NumberPicker from '../../../../scenery-phet/js/NumberPicker.js';
import PhetFont from '../../../../scenery-phet/js/PhetFont.js';
import HBox from '../../../../scenery/js/nodes/HBox.js';
import Node from '../../../../scenery/js/nodes/Node.js';
import Path from '../../../../scenery/js/nodes/Path.js';
import Text from '../../../../scenery/js/nodes/Text.js';
import Color from '../../../../scenery/js/util/Color.js';
import RadioButtonGroup from '../../../../sun/js/buttons/RadioButtonGroup.js';
import RoundPushButton from '../../../../sun/js/buttons/RoundPushButton.js';
import Operations from '../../common/model/Operations.js';
import numberLineOperations from '../../numberLineOperations.js';

// constants
const MATH_SYMBOL_OPTIONS = {
  font: new PhetFont( 32 )
};

// This is a normalized version of the enter arrow shape, pointing straight down, upper left corner at 0,0, height is 1.
const NORMALIZED_ENTER_ARROW_SHAPE = new Shape()
  .lineTo( 0.45, 0 )
  .lineTo( 0.45, 0.5 )
  .lineTo( 0.65, 0.5 )
  .lineTo( 0.35, 1 )
  .lineTo( 0.05, 0.5 )
  .lineTo( 0.25, 0.5 )
  .lineTo( 0.25, 0.2 )
  .lineTo( 0, 0.2 )
  .lineTo( 0, 0 );
const FULL_SIZE_ARROW_SHAPE = NORMALIZED_ENTER_ARROW_SHAPE.transformed( Matrix3.scale( 28 ) ); // scale empirically chosen

class OperationEntryControl extends HBox {

  /**
   * @param {OperationTrackingNumberLine} numberLine
   * @param {number} controlledOperationIndex - index of the operation on the number line that this will control
   * @param {Object} [options]
   * @public
   */
  constructor( numberLine, controlledOperationIndex, options ) {

    options = merge( {
      spacing: 25,
      initialValue: 0,
      increment: 100,
      range: new Range( -1000, 1000 ),
      buttonBaseColor: new Color( 153, 206, 255 ),

      // {String} - specifies the way the arrow should point, valid values are 'up' and 'down'
      arrowDirection: 'down'
    }, options );

    // options checking
    assert && assert( options.arrowDirection === 'up' || options.arrowDirection === 'down' );

    // @private {NumberLineOperation} - operation managed by this control
    const controlledOperation = numberLine.operations[ controlledOperationIndex ];

    // plus/minus operation selector
    const operationSelectorRadioButtonGroup = new RadioButtonGroup(
      controlledOperation.operationTypeProperty,
      [
        { value: Operations.ADDITION, node: new Text( MathSymbols.PLUS, MATH_SYMBOL_OPTIONS ) },
        { value: Operations.SUBTRACTION, node: new Text( MathSymbols.MINUS, MATH_SYMBOL_OPTIONS ) }
      ],
      {
        baseColor: Color.WHITE,
        orientation: 'vertical',
        spacing: 5,
        buttonContentXMargin: 8,
        buttonContentYMargin: 0,
        selectedLineWidth: 2.5
      }
    );

    // set the initial operation amount
    controlledOperation.amountProperty.set( options.initialValue );

    // amount selector
    const operationAmountPicker = new NumberPicker(
      controlledOperation.amountProperty,
      new Property( options.range ),
      {
        upFunction: value => value + options.increment,
        downFunction: value => value - options.increment,
        yMargin: 10,
        arrowHeight: 10,
        color: Color.BLACK,
        font: new PhetFont( 26 )
      }
    );

    // parent node for the buttons
    const buttonRootNode = new Node();

    // enter button
    let enterArrowShape;
    if ( options.arrowDirection === 'down' ) {
      enterArrowShape = FULL_SIZE_ARROW_SHAPE;
    }
    else {
      enterArrowShape = FULL_SIZE_ARROW_SHAPE.transformed( Matrix3.scale( 1, -1 ) );
    }
    const enterArrowNode = new Path( enterArrowShape, { fill: Color.BLACK } );
    const enterButton = new RoundPushButton( {
      listener: () => {
        controlledOperation.isActiveProperty.set( true );
      },
      content: enterArrowNode,
      radius: 30,
      baseColor: options.buttonBaseColor
    } );
    buttonRootNode.addChild( enterButton );

    // eraser button
    const eraserButton = new EraserButton( {
      listener: () => {

        // deactive our operation so that it will no longer appear on the number line
        controlledOperation.isActiveProperty.set( false );
      },
      iconWidth: 30,
      center: enterButton.center
    } );
    buttonRootNode.addChild( eraserButton );

    // control the visibility of the "enter" and "erase" buttons based on whether or not the operation is active
    controlledOperation.isActiveProperty.link( operationIsActive => {
      enterButton.visible = !operationIsActive;
      eraserButton.visible = operationIsActive;
    } );

    super( merge( {
      children: [ operationSelectorRadioButtonGroup, operationAmountPicker, buttonRootNode ]
    }, options ) );

    // @private - now that the constructor has been called, make the controlled operation available to the methods
    this.controlledOperation = controlledOperation;
  }

  /**
   * @public
   */
  clear() {
    this.controlledOperation.operationTypeProperty.reset();
    this.controlledOperation.amountProperty.set( 0 );
  }

  reset() {
    this.controlledOperation.reset();
  }
}

numberLineOperations.register( 'OperationEntryControl', OperationEntryControl );
export default OperationEntryControl;