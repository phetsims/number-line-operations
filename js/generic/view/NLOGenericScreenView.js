// Copyright 2020, University of Colorado Boulder

/**
 * @author John Blanco
 */

import ScreenView from '../../../../joist/js/ScreenView.js';
import NLCConstants from '../../../../number-line-common/js/common/NLCConstants.js';
import NumberLineRangeSelector from '../../../../number-line-common/js/common/view/NumberLineRangeSelector.js';
import EraserButton from '../../../../scenery-phet/js/buttons/EraserButton.js';
import ResetAllButton from '../../../../scenery-phet/js/buttons/ResetAllButton.js';
import PhetFont from '../../../../scenery-phet/js/PhetFont.js';
import Image from '../../../../scenery/js/nodes/Image.js';
import Text from '../../../../scenery/js/nodes/Text.js';
import VBox from '../../../../scenery/js/nodes/VBox.js';
import Carousel from '../../../../sun/js/Carousel.js';
import Checkbox from '../../../../sun/js/Checkbox.js';
import PageControl from '../../../../sun/js/PageControl.js';
import mockupImage from '../../../images/generic-screen-mockup_png.js';
import NLOConstants from '../../common/NLOConstants.js';
import NumberLineOperationNode from '../../common/view/NumberLineOperationNode.js';
import OperationTrackingNumberLineNode from '../../common/view/OperationTrackingNumberLineNode.js';
import numberLineOperations from '../../numberLineOperations.js';
import numberLineOperationsStrings from '../../numberLineOperationsStrings.js';
import OperationDescriptionAccordionBox from '../../operations/view/OperationDescriptionAccordionBox.js';
import OperationEntryControl from '../../operations/view/OperationEntryControl.js';
import NLOGenericModel from '../model/NLOGenericModel.js';
import SingleDualNumberLineSelector from './SingleDualNumberLineSelector.js';

/**
 * main screen view for the "Generic" screen
 */
class NLOGenericScreenView extends ScreenView {

  /**
   * @param {NLOGenericModel} model
   * @param {Tandem} tandem
   */
  constructor( model, tandem ) {

    super( {
      tandem: tandem
    } );

    // TODO - mockup - temporary, for design and layout, see https://github.com/phetsims/number-line-operations/issues/3
    const mockup = new Image( mockupImage, {
      center: this.layoutBounds.center,
      minWidth: this.layoutBounds.width,
      maxWidth: this.layoutBounds.width,
      opacity: window.phet.mockupOpacityProperty.value
    } );
    this.addChild( mockup );
    window.phet.mockupOpacityProperty.linkAttribute( mockup, 'opacity' );

    // number line node
    const primaryNumberLineNode = new OperationTrackingNumberLineNode( model.primaryNumberLine, {
      pointNodeOptions: {
        radius: 6
      },
      numberLineOperationNodeOptions: {
        operationLabelFont: new PhetFont( 22 ),
        labelDistanceFromApex: 20
      }
    } );
    this.addChild( primaryNumberLineNode );

    // checkboxes that will control the presentation options
    const checkboxes = [
      new Checkbox(
        new Text( numberLineOperationsStrings.pointLabels, NLCConstants.CHECKBOX_TEXT_OPTIONS ),
        model.primaryNumberLine.showPointLabelsProperty,
        NLCConstants.CHECKBOX_OPTIONS
      ),
      new Checkbox(
        new Text( numberLineOperationsStrings.operationLabels, NLCConstants.CHECKBOX_TEXT_OPTIONS ),
        model.primaryNumberLine.showOperationLabelsProperty,
        NLCConstants.CHECKBOX_OPTIONS
      ),
      new Checkbox(
        new Text( numberLineOperationsStrings.tickMarks, NLCConstants.CHECKBOX_TEXT_OPTIONS ),
        model.primaryNumberLine.showTickMarksProperty,
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
    const operationDescriptionAccordionBox = new OperationDescriptionAccordionBox( model.primaryNumberLine, {
      centerX: this.layoutBounds.centerX,
      top: 20
    } );
    this.addChild( operationDescriptionAccordionBox );

    // operation entry controls for the upper number line
    const operationEntryControls = [
      new OperationEntryControl(
        model.primaryNumberLine,
        {
          depictionRelativePosition: NumberLineOperationNode.RelativePositions.ABOVE_NUMBER_LINE,
          initialValue: 100
        }
      ),
      new OperationEntryControl(
        model.primaryNumberLine,
        { depictionRelativePosition: NumberLineOperationNode.RelativePositions.BELOW_NUMBER_LINE }
      )
    ];

    // carousel in which the operation entry controls for the upper number line reside
    const operationEntryCarousel = new Carousel( operationEntryControls, {
      orientation: 'horizontal',
      itemsPerPage: 1,
      right: this.layoutBounds.maxX - 40,
      top: 15
    } );
    this.addChild( operationEntryCarousel );

    // automatically advance the carousel when the first operation is added
    model.primaryNumberLine.operationsList.lengthProperty.link( numberOfOperations => {
      if ( numberOfOperations === 1 && operationEntryCarousel.pageNumberProperty.value === 0 ) {
        operationEntryCarousel.pageNumberProperty.value += 1;
      }
    } );

    // page indicator
    this.addChild( new PageControl( operationEntryCarousel.numberOfPages, operationEntryCarousel.pageNumberProperty, {
      orientation: 'horizontal',
      centerX: operationEntryCarousel.centerX,
      top: operationEntryCarousel.bottom + 10
    } ) );

    // erase button
    const primaryNumberLineEraserButton = new EraserButton( {
      iconWidth: 36,
      left: primaryNumberLineNode.right + 8,
      listener: () => {
        model.primaryNumberLine.removeAllOperations();
        operationEntryCarousel.pageNumberProperty.reset();
        operationEntryControls.forEach( control => {control.clear(); } );
      }
    } );
    this.addChild( primaryNumberLineEraserButton );

    // erase is disabled if there are no operations
    model.primaryNumberLine.operationsList.lengthProperty.link(
      length => { primaryNumberLineEraserButton.enabled = length > 0; }
    );

    // reposition the primary eraser button if the primary number line moves
    model.primaryNumberLine.centerPositionProperty.link( position => {
      primaryNumberLineEraserButton.centerY = position.y;
    } );

    // add the selector used to show/hide the second number line
    const singleDualNumberLineSelector = new SingleDualNumberLineSelector( model.secondNumberLineVisibleProperty, {
      left: checkboxGroup.left,
      bottom: this.layoutBounds.maxY - 50
    } );
    this.addChild( singleDualNumberLineSelector );

    // add the number line range selector
    this.addChild( new NumberLineRangeSelector(
      model.primaryNumberLine.displayedRangeProperty,
      NLOGenericModel.NUMBER_LINE_RANGES,
      this,
      {
        left: singleDualNumberLineSelector.left,
        bottom: singleDualNumberLineSelector.top - 20
      }
    ) );

    // reset all
    const resetAllButton = new ResetAllButton( {
      listener: () => {
        this.interruptSubtreeInput(); // cancel interactions that may be in progress
        model.reset();
        this.reset();
      },
      right: this.layoutBounds.maxX - NLOConstants.SCREEN_VIEW_X_MARGIN,
      bottom: this.layoutBounds.maxY - NLOConstants.SCREEN_VIEW_Y_MARGIN,
      tandem: tandem.createTandem( 'resetAllButton' )
    } );
    this.addChild( resetAllButton );
  }

  /**
   * Resets the view.
   * @public
   */
  reset() {
    //TODO
  }

  /**
   * Steps the view.
   * @param {number} dt - time step, in seconds
   * @public
   */
  step( dt ) {
    //TODO
  }
}

numberLineOperations.register( 'NLOGenericScreenView', NLOGenericScreenView );
export default NLOGenericScreenView;