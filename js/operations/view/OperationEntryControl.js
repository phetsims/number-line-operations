// Copyright 2020, University of Colorado Boulder

import merge from '../../../../phet-core/js/merge.js';
import Matrix3 from '../../../../dot/js/Matrix3.js';
import Range from '../../../../dot/js/Range.js';
import EnumerationProperty from '../../../../axon/js/EnumerationProperty.js';
import NumberProperty from '../../../../axon/js/NumberProperty.js';
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
import Operation from '../../common/model/Operation.js';
import Operations from '../../common/model/Operations.js';
import OperationArrowNode from '../../common/view/OperationArrowNode.js';
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

      // Relative position of the depiction of the operations that are created by this controller, i.e. above or below
      // the number line.
      depictionRelativePosition: OperationArrowNode.RelativePositions.ABOVE_NUMBER_LINE

    }, options );

    // internal state
    const selectedOperationProperty = new EnumerationProperty( Operations, Operations.ADDITION );
    const operationAmountProperty = new NumberProperty( 100 );

    // @private {Operation|null} - An operation that was added by this controller to the number line, null if none has
    // been added or if the operation was removed.
    const addedOperationProperty = new Property( null );

    // plus/minus operation selector
    const operationSelectorRadioButtonGroup = new RadioButtonGroup(
      selectedOperationProperty,
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
      operationAmountProperty,
      new Property( new Range( -800, 800 ) ),
      {
        upFunction: value => value + 100,
        downFunction: value => value - 100,
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
        const arithmeticOperation = new Operation(
          numberLine.getCurrentEndValue(),
          selectedOperationProperty.value,
          operationAmountProperty.value,
          { depictionRelativePosition: options.depictionRelativePosition }
        );
        numberLine.addOperation( arithmeticOperation );
        addedOperationProperty.set( arithmeticOperation );
      },
      content: enterArrowNode,
      radius: 30
    } );
    buttonRootNode.addChild( enterButton );

    // eraser button
    const eraserButton = new EraserButton( {
      listener: () => {
        numberLine.removeOperation( addedOperationProperty.value );
        addedOperationProperty.set( null );
      },
      iconWidth: 30,
      center: enterButton.center
    } );
    buttonRootNode.addChild( eraserButton );

    // control which of the two buttons is visible based on whether an operation has been added to the number line
    addedOperationProperty.link( addedOperation => {
      enterButton.visible = addedOperation === null;
      eraserButton.visible = addedOperation !== null;
    } );

    // Monitor the number line and if the operation that was added by this controller is removed, clear our local
    // reference.
    numberLine.operationsList.addItemRemovedListener( removedOperation => {
      if ( removedOperation === addedOperationProperty.value ) {
        addedOperationProperty.set( null );
      }
    } );

    super( merge( {
      children: [ operationSelectorRadioButtonGroup, operationAmountPicker, buttonRootNode ]
    }, options ) );
  }

  /**
   * Clear the current operation, if any.  Does nothing if not.  This does not remove the operation from the number
   * line.  Also, this method does not reset to the default operation or value.
   */
  clearOperation() {

  }
}

numberLineOperations.register( 'OperationEntryControl', OperationEntryControl );
export default OperationEntryControl;