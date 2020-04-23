// Copyright 2020, University of Colorado Boulder

/**
 * @author John Blanco
 */

import NumberProperty from '../../../../axon/js/NumberProperty.js';
import ScreenView from '../../../../joist/js/ScreenView.js';
import NLCConstants from '../../../../number-line-common/js/common/NLCConstants.js';
import ArrowNode from '../../../../scenery-phet/js/ArrowNode.js';
import EraserButton from '../../../../scenery-phet/js/buttons/EraserButton.js';
import ResetAllButton from '../../../../scenery-phet/js/buttons/ResetAllButton.js';
import PhetFont from '../../../../scenery-phet/js/PhetFont.js';
import Image from '../../../../scenery/js/nodes/Image.js';
import Text from '../../../../scenery/js/nodes/Text.js';
import VBox from '../../../../scenery/js/nodes/VBox.js';
import RadioButtonGroup from '../../../../sun/js/buttons/RadioButtonGroup.js';
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

// constants
const ARROW_ICON_LENGTH = 35;
const ARROW_ICON_OPTIONS = {
  doubleHead: true,
  headHeight: 8,
  headWidth: 8,
  tailWidth: 1
};

class NLOGenericScreenView extends ScreenView {

  /**
   * @param {NLOOperationsModel} model
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

    // operation entry controls for the upper number line
    const operationEntryControls = [
      new OperationEntryControl(
        model.numberLine,
        {
          depictionRelativePosition: NumberLineOperationNode.RelativePositions.ABOVE_NUMBER_LINE,
          initialValue: 100
        }
      ),
      new OperationEntryControl(
        model.numberLine,
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
    model.numberLine.operationsList.lengthProperty.link( numberOfOperations => {
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
    const eraserButton = new EraserButton( {
      iconWidth: 36,
      left: numberLineNode.right + 8,
      centerY: model.numberLine.centerPosition.y,
      listener: () => {
        model.numberLine.removeAllOperations();
        operationEntryCarousel.pageNumberProperty.reset();
        operationEntryControls.forEach( control => {control.clear(); } );
      }
    } );
    this.addChild( eraserButton );

    // erase is disabled if there are no operations
    model.numberLine.operationsList.lengthProperty.link( length => { eraserButton.enabled = length > 0; } );

    // create the orientation selection icons
    const singleNumberLineIcon = new ArrowNode( -ARROW_ICON_LENGTH / 2, 0, ARROW_ICON_LENGTH / 2, 0, ARROW_ICON_OPTIONS );
    const dualNumberLineIcon = new VBox( {
      children: [
        new ArrowNode( -ARROW_ICON_LENGTH / 2, 0, ARROW_ICON_LENGTH / 2, 0, ARROW_ICON_OPTIONS ),
        new ArrowNode( -ARROW_ICON_LENGTH / 2, 0, ARROW_ICON_LENGTH / 2, 0, ARROW_ICON_OPTIONS )
      ],
      spacing: 10
    } );

    // map the orientation icons to their enum values
    const singleVersusDualNumberLineIcons = [
      {
        value: 1,
        node: singleNumberLineIcon
      },
      {
        value: 2,
        node: dualNumberLineIcon
      }
    ];

    // selector buttons for one versus two number lines
    const singleVersusDualRadioButtonGroup = new RadioButtonGroup(
      new NumberProperty( 1 ),  // temporary
      singleVersusDualNumberLineIcons,
      {
        buttonContentXMargin: 5,
        buttonContentYMargin: 10,
        left: checkboxGroup.left,
        bottom: this.layoutBounds.maxY - 50,
        baseColor: 'white',
        selectedLineWidth: 2,
        deselectedLineWidth: .5,
        deselectedButtonOpacity: 0.25,
        orientation: 'horizontal',
        spacing: 8,
        touchAreaXDilation: 2,
        touchAreaYDilation: 2
      }
    );
    this.addChild( singleVersusDualRadioButtonGroup );

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