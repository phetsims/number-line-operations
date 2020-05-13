// Copyright 2020, University of Colorado Boulder

/**
 * @author John Blanco
 */

import ScreenView from '../../../../joist/js/ScreenView.js';
import EraserButton from '../../../../scenery-phet/js/buttons/EraserButton.js';
import ResetAllButton from '../../../../scenery-phet/js/buttons/ResetAllButton.js';
import PhetFont from '../../../../scenery-phet/js/PhetFont.js';
import Image from '../../../../scenery/js/nodes/Image.js';
import Text from '../../../../scenery/js/nodes/Text.js';
import VBox from '../../../../scenery/js/nodes/VBox.js';
import Checkbox from '../../../../sun/js/Checkbox.js';
import NLOConstants from '../../common/NLOConstants.js';
import OperationEntryCarousel from '../../common/view/OperationEntryCarousel.js';
import OperationTrackingNumberLineNode from '../../common/view/OperationTrackingNumberLineNode.js';
import numberLineOperations from '../../numberLineOperations.js';
import mockupImage from '../../../images/operations-screen-mockup_png.js';
import numberLineOperationsStrings from '../../numberLineOperationsStrings.js';
import InitialNetWorthAccordionBox from './InitialNetWorthAccordionBox.js';
import NumericalExpressionAccordionBox from './NumericalExpressionAccordionBox.js';

class NLOOperationsScreenView extends ScreenView {

  /**
   * @param {NLOOperationsModel} model
   */
  constructor( model, tandem ) {

    super( {
      tandem: tandem
    } );

    // TODO - mockup - temporary, for design and layout, see https://github.com/phetsims/number-line-operations/issues/3
    const mockup = new Image( mockupImage, {
      center: NLOConstants.LAYOUT_BOUNDS.center,
      minWidth: NLOConstants.LAYOUT_BOUNDS.width,
      maxWidth: NLOConstants.LAYOUT_BOUNDS.width,
      opacity: window.phet.mockupOpacityProperty.value
    } );
    this.addChild( mockup );
    window.phet.mockupOpacityProperty.linkAttribute( mockup, 'opacity' );

    // number line node
    const numberLineNode = new OperationTrackingNumberLineNode( model.numberLine, {
      pointNodeOptions: {
        radius: 6
      },
      numberLineOperationNodeOptions: {
        operationLabelFont: new PhetFont( 22 ),
        labelDistanceFromApex: 20
      }
    } );
    this.addChild( numberLineNode );

    // checkboxes that will control the presentation options
    const checkboxes = [
      new Checkbox(
        new Text( numberLineOperationsStrings.pointLabels, NLOConstants.CHECKBOX_TEXT_OPTIONS ),
        model.numberLine.showPointLabelsProperty,
        NLOConstants.CHECKBOX_OPTIONS
      ),
      new Checkbox(
        new Text( numberLineOperationsStrings.operationLabels, NLOConstants.CHECKBOX_TEXT_OPTIONS ),
        model.numberLine.showOperationLabelsProperty,
        NLOConstants.CHECKBOX_OPTIONS
      ),
      new Checkbox(
        new Text( numberLineOperationsStrings.operationDescription, NLOConstants.CHECKBOX_TEXT_OPTIONS ),
        model.numberLine.showOperationDescriptionsProperty,
        NLOConstants.CHECKBOX_OPTIONS
      ),
      new Checkbox(
        new Text( numberLineOperationsStrings.tickMarks, NLOConstants.CHECKBOX_TEXT_OPTIONS ),
        model.numberLine.showTickMarksProperty,
        NLOConstants.CHECKBOX_OPTIONS
      )
    ];
    const checkboxGroup = new VBox( {
      children: checkboxes,
      spacing: 18,
      align: 'left',

      // position - empirically determined to look decent
      left: this.layoutBounds.minX + 30,
      top: this.layoutBounds.minY + 30
    } );
    this.addChild( checkboxGroup );

    // accordion box containing a mathematical description of the operations on the number line
    const numericalExpressionAccordionBox = new NumericalExpressionAccordionBox( model.numberLine, {
      centerX: this.layoutBounds.centerX,
      top: 20
    } );
    this.addChild( numericalExpressionAccordionBox );

    // carousel with the operation entry controls
    const operationEntryCarousel = new OperationEntryCarousel( model.numberLine, {
      right: this.layoutBounds.maxX - 35,
      top: 20
    } );
    this.addChild( operationEntryCarousel );

    // erase button
    const eraserButton = new EraserButton( {
      iconWidth: 36,
      left: numberLineNode.right + 8,
      centerY: model.numberLine.centerPositionProperty.value.y,
      listener: () => {
        model.numberLine.deactivateAllOperations();
        operationEntryCarousel.reset();
      }
    } );
    this.addChild( eraserButton );

    // erase is disabled if there are no operations
    model.numberLine.operations.forEach( operation => {
      operation.isActiveProperty.link( () => {
        eraserButton.enabled = model.numberLine.getActiveOperations().length > 0;
      } );
    } );

    // initial net worth control
    this.addChild( new InitialNetWorthAccordionBox( model.numberLine.startingValueProperty, {
      centerX: this.layoutBounds.centerX,
      top: this.layoutBounds.maxY - 180
    } ) );

    // reset all button
    const resetAllButton = new ResetAllButton( {
      listener: () => {
        this.interruptSubtreeInput(); // cancel interactions that may be in progress
        numericalExpressionAccordionBox.reset();
        operationEntryCarousel.reset();
        model.reset();
        model.numberLine.deactivateAllOperations();
      },
      right: this.layoutBounds.maxX - NLOConstants.SCREEN_VIEW_X_MARGIN,
      bottom: this.layoutBounds.maxY - NLOConstants.SCREEN_VIEW_Y_MARGIN,
      tandem: tandem.createTandem( 'resetAllButton' )
    } );
    this.addChild( resetAllButton );
  }
}

numberLineOperations.register( 'NLOOperationsScreenView', NLOOperationsScreenView );
export default NLOOperationsScreenView;