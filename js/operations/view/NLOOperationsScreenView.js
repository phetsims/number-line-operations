// Copyright 2020, University of Colorado Boulder

/**
 * @author John Blanco
 */

import ScreenView from '../../../../joist/js/ScreenView.js';
import NLCConstants from '../../../../number-line-common/js/common/NLCConstants.js';
import EraserButton from '../../../../scenery-phet/js/buttons/EraserButton.js';
import ResetAllButton from '../../../../scenery-phet/js/buttons/ResetAllButton.js';
import PhetFont from '../../../../scenery-phet/js/PhetFont.js';
import Image from '../../../../scenery/js/nodes/Image.js';
import Text from '../../../../scenery/js/nodes/Text.js';
import VBox from '../../../../scenery/js/nodes/VBox.js';
import Carousel from '../../../../sun/js/Carousel.js';
import Checkbox from '../../../../sun/js/Checkbox.js';
import PageControl from '../../../../sun/js/PageControl.js';
import NLOConstants from '../../common/NLOConstants.js';
import NumberLineOperationNode from '../../common/view/NumberLineOperationNode.js';
import OperationTrackingNumberLineNode from '../../common/view/OperationTrackingNumberLineNode.js';
import numberLineOperations from '../../numberLineOperations.js';
import mockupImage from '../../../images/operations-screen-mockup_png.js';
import numberLineOperationsStrings from '../../numberLineOperationsStrings.js';
import InitialNetWorthAccordionBox from './InitialNetWorthAccordionBox.js';
import OperationDescriptionAccordionBox from './OperationDescriptionAccordionBox.js';
import OperationEntryControl from './OperationEntryControl.js';

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
        new Text( numberLineOperationsStrings.pointLabels, NLCConstants.CHECKBOX_TEXT_OPTIONS ),
        model.numberLine.showPointLabelsProperty,
        NLCConstants.CHECKBOX_OPTIONS
      ),
      new Checkbox(
        new Text( numberLineOperationsStrings.operationLabels, NLCConstants.CHECKBOX_TEXT_OPTIONS ),
        model.numberLine.showOperationLabelsProperty,
        NLCConstants.CHECKBOX_OPTIONS
      ),
      new Checkbox(
        new Text( numberLineOperationsStrings.operationDescription, NLCConstants.CHECKBOX_TEXT_OPTIONS ),
        model.numberLine.showOperationDescriptionsProperty,
        NLCConstants.CHECKBOX_OPTIONS
      ),
      new Checkbox(
        new Text( numberLineOperationsStrings.tickMarks, NLCConstants.CHECKBOX_TEXT_OPTIONS ),
        model.numberLine.showTickMarksProperty,
        NLCConstants.CHECKBOX_OPTIONS
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
    const operationDescriptionAccordionBox = new OperationDescriptionAccordionBox( model.numberLine, {
      centerX: this.layoutBounds.centerX,
      top: 20
    } );
    this.addChild( operationDescriptionAccordionBox );

    // operation entry controls
    const operationEntryControls = [
      new OperationEntryControl(
        model.numberLine,
        0,
        {
          depictionRelativePosition: NumberLineOperationNode.RelativePositions.ABOVE_NUMBER_LINE,
          initialValue: 100
        }
      ),
      new OperationEntryControl(
        model.numberLine,
        1,
        { depictionRelativePosition: NumberLineOperationNode.RelativePositions.BELOW_NUMBER_LINE }
      )
    ];

    // carousel in which the operation entry controls reside
    const operationEntryCarousel = new Carousel( operationEntryControls, {
      orientation: 'horizontal',
      itemsPerPage: 1,
      right: this.layoutBounds.maxX - 40,
      top: 15
    } );
    this.addChild( operationEntryCarousel );

    // automatically advance the carousel when the first operation is added
    model.numberLine.operationProperties[ 0 ].link( operation => {
      if ( operation ) {
        operationEntryCarousel.pageNumberProperty.value = 1;
      }
    } );

    // page indicator
    this.addChild( new PageControl( operationEntryCarousel.numberOfPages, operationEntryCarousel.pageNumberProperty, {
      orientation: 'horizontal',
      centerX: operationEntryCarousel.centerX,
      top: operationEntryCarousel.bottom + 10
    } ) );

    // erase button
    const eraserButton = new EraserButton( {
      iconWidth: 36,
      left: numberLineNode.right + 8,
      centerY: model.numberLine.centerPositionProperty.value.y,
      listener: () => {
        model.numberLine.removeAllOperations();
        operationEntryCarousel.pageNumberProperty.reset();
        operationEntryControls.forEach( control => {control.clear(); } );
      }
    } );
    this.addChild( eraserButton );

    // erase is disabled if there are no operations
    model.numberLine.operationProperties.forEach( operationProperty => {
      operationProperty.link( () => {
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
        operationDescriptionAccordionBox.reset();
        model.reset();
        operationEntryCarousel.pageNumberProperty.reset();
        model.numberLine.removeAllOperations();
        operationEntryControls.forEach( control => { control.reset(); } );
      },
      right: this.layoutBounds.maxX - NLOConstants.SCREEN_VIEW_X_MARGIN,
      bottom: this.layoutBounds.maxY - NLOConstants.SCREEN_VIEW_Y_MARGIN,
      tandem: tandem.createTandem( 'resetAllButton' )
    } );
    this.addChild( resetAllButton );
  }
}

numberLineOperations.register( 'NumberLineOperationsScreenView', NLOOperationsScreenView );
export default NLOOperationsScreenView;