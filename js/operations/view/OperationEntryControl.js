// Copyright 2020, University of Colorado Boulder

import BooleanProperty from '../../../../axon/js/BooleanProperty.js';
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
import NumberLineOperation from '../../common/model/NumberLineOperation.js';
import Operations from '../../common/model/Operations.js';
import NumberLineOperationNode from '../../common/view/NumberLineOperationNode.js';
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

class OperationEntryControl extends HBox {

  /**
   * @param {OperationTrackingNumberLine} numberLine
   * @param {Object} [options]
   * @public
   */
  constructor( numberLine, options ) {

    options = merge( {
      spacing: 25,
      initialValue: 0,
      increment: 100,
      range: new Range( -1000, 1000 ),

      // Relative position of the depiction of the operations that are created by this controller, i.e. above or below
      // the number line.
      depictionRelativePosition: NumberLineOperationNode.RelativePositions.ABOVE_NUMBER_LINE

    }, options );

    // operation managed by this control
    const operation = new NumberLineOperation(
      Operations.ADDITION,
      options.initialValue,
      { depictionRelativePosition: options.depictionRelativePosition }
    );

    // property that keeps track of whether or not this control's operation is on the number line
    const operationOnNumberLineProperty = new BooleanProperty( false );

    // plus/minus operation selector
    const operationSelectorRadioButtonGroup = new RadioButtonGroup(
      operation.operationTypeProperty,
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

    // amount selector
    const operationAmountPicker = new NumberPicker(
      operation.amountProperty,
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
    const enterArrowShape = NORMALIZED_ENTER_ARROW_SHAPE.transformed( Matrix3.scale( 28 ) ); // scale empirically chosen
    const enterArrowNode = new Path( enterArrowShape, { fill: Color.BLACK } );
    const enterButton = new RoundPushButton( {
      listener: () => {
        numberLine.addOperation( operation );
        operationOnNumberLineProperty.set( true );
      },
      content: enterArrowNode,
      radius: 30
    } );
    buttonRootNode.addChild( enterButton );

    // eraser button
    const eraserButton = new EraserButton( {
      listener: () => {
        numberLine.removeOperation( operation );
        operationOnNumberLineProperty.set( false );
      },
      iconWidth: 30,
      center: enterButton.center
    } );
    buttonRootNode.addChild( eraserButton );

    // control which of the two buttons is visible based on whether an operation has been added to the number line
    operationOnNumberLineProperty.link( operationOnNumberLine => {
      enterButton.visible = !operationOnNumberLine;
      eraserButton.visible = operationOnNumberLine;
    } );

    // Monitor the number line and if the operation that was added by this controller is removed, update state.
    numberLine.operationsList.addItemRemovedListener( removedOperation => {
      if ( removedOperation === operation ) {
        operationOnNumberLineProperty.set( false );
      }
    } );

    super( merge( {
      children: [ operationSelectorRadioButtonGroup, operationAmountPicker, buttonRootNode ]
    }, options ) );

    this.operation = operation;
  }

  /**
   * @public
   */
  clear() {
    this.operation.operationTypeProperty.reset();
    this.operation.amountProperty.set( 0 );
  }

  reset() {
    this.operation.reset();
  }
}

numberLineOperations.register( 'OperationEntryControl', OperationEntryControl );
export default OperationEntryControl;