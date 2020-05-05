// Copyright 2020, University of Colorado Boulder

/**
 * @author John Blanco
 */

import ScreenView from '../../../../joist/js/ScreenView.js';
import NLCConstants from '../../../../number-line-common/js/common/NLCConstants.js';
import NumberLineRangeSelector from '../../../../number-line-common/js/common/view/NumberLineRangeSelector.js';
import PointControllerNode from '../../../../number-line-integers/js/common/view/PointControllerNode.js';
import merge from '../../../../phet-core/js/merge.js';
import EraserButton from '../../../../scenery-phet/js/buttons/EraserButton.js';
import ResetAllButton from '../../../../scenery-phet/js/buttons/ResetAllButton.js';
import PhetFont from '../../../../scenery-phet/js/PhetFont.js';
import Image from '../../../../scenery/js/nodes/Image.js';
import Node from '../../../../scenery/js/nodes/Node.js';
import Text from '../../../../scenery/js/nodes/Text.js';
import VBox from '../../../../scenery/js/nodes/VBox.js';
import Checkbox from '../../../../sun/js/Checkbox.js';
import Animation from '../../../../twixt/js/Animation.js';
import Easing from '../../../../twixt/js/Easing.js';
import mockupImage from '../../../images/generic-screen-mockup_png.js';
import NLOConstants from '../../common/NLOConstants.js';
import OperationEntryCarousel from '../../common/view/OperationEntryCarousel.js';
import OperationTrackingNumberLineNode from '../../common/view/OperationTrackingNumberLineNode.js';
import numberLineOperations from '../../numberLineOperations.js';
import numberLineOperationsStrings from '../../numberLineOperationsStrings.js';
import OperationDescriptionAccordionBox from '../../operations/view/OperationDescriptionAccordionBox.js';
import NLOGenericModel from '../model/NLOGenericModel.js';
import SingleDualNumberLineSelector from './SingleDualNumberLineSelector.js';

// constants
const NUMBER_LINE_NODE_OPTIONS = {
  pointNodeOptions: {
    radius: 6
  },
  numberLineOperationNodeOptions: {
    operationLabelFont: new PhetFont( 22 ),
    labelDistanceFromApex: 20
  }
};

// TODO: incorporate ranges
// const OPERATION_ENTRY_CONTROL_RANGE = new Range( -100, 100 );

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

    // primary number line node
    const primaryNumberLineNode = new OperationTrackingNumberLineNode(
      model.primaryNumberLine,
      NUMBER_LINE_NODE_OPTIONS
    );
    this.addChild( primaryNumberLineNode );

    // point controller for the starting point on the primary number line, which is always present
    this.addChild( new PointControllerNode( model.primaryLineInitialValuePointController ) );

    // add and remove nodes for the point controllers that come and go from the primary number line
    model.primaryNumberLinePointControllers.addItemAddedListener( addedPointController => {
      const pointControllerNode = new PointControllerNode( addedPointController );
      this.addChild( pointControllerNode );
      const removalListener = removedPointController => {
        if ( removedPointController === addedPointController ) {
          this.removeChild( pointControllerNode );
          pointControllerNode.dispose();
          model.primaryNumberLinePointControllers.removeItemRemovedListener( removalListener );
        }
      };
      model.primaryNumberLinePointControllers.addItemRemovedListener( removalListener );
    } );

    // accordion box containing a mathematical description of the operations on the number line
    const primaryOperationDescriptionAccordionBox = new OperationDescriptionAccordionBox( model.primaryNumberLine, {
      centerX: this.layoutBounds.centerX,
      top: 20
    } );
    this.addChild( primaryOperationDescriptionAccordionBox );

    // carousel in which the operation entry controls for the upper number line reside
    const primaryOperationEntryCarousel = new OperationEntryCarousel( model.primaryNumberLine, {
      entryControlInitialValue: 1,
      entryControlIncrement: 1,
      right: this.layoutBounds.maxX - 60,
      top: 15
    } );
    this.addChild( primaryOperationEntryCarousel );

    // erase button for primary number line
    const primaryNumberLineEraserButton = new EraserButton( {
      iconWidth: 36,
      left: primaryNumberLineNode.right + 8,
      listener: () => {
        model.primaryNumberLine.deactivateAllOperations();
        primaryOperationEntryCarousel.reset();
      }
    } );
    this.addChild( primaryNumberLineEraserButton );

    // erase is disabled if there are no operations
    model.primaryNumberLine.operations.forEach( operation => {
      operation.isActiveProperty.link( () => {
        primaryNumberLineEraserButton.enabled = model.primaryNumberLine.getActiveOperations().length > 0;
      } );
    } );

    // reposition the primary eraser button if the primary number line moves
    model.primaryNumberLine.centerPositionProperty.link( position => {
      primaryNumberLineEraserButton.centerY = position.y;
    } );

    // layer where the secondary number line will live, here so that it can be shown and hidden
    const secondaryNumberLineLayer = new Node( { opacity: 0 } );
    this.addChild( secondaryNumberLineLayer );

    // secondary number line node
    const secondaryNumberLineNode = new OperationTrackingNumberLineNode(
      model.secondaryNumberLine,
      merge( { opacity: 0 }, NUMBER_LINE_NODE_OPTIONS )
    );
    secondaryNumberLineLayer.addChild( secondaryNumberLineNode );

    // point controller for the starting point on the secondary number line, which is always present
    secondaryNumberLineLayer.addChild( new PointControllerNode( model.secondaryLineInitialValuePointController ) );

    // add and remove nodes for the point controllers that come and go from the secondary number line
    model.secondaryNumberLinePointControllers.addItemAddedListener( addedPointController => {
      const pointControllerNode = new PointControllerNode( addedPointController );
      secondaryNumberLineLayer.addChild( pointControllerNode );
      const removalListener = removedPointController => {
        if ( removedPointController === addedPointController ) {
          secondaryNumberLineLayer.removeChild( pointControllerNode );
          pointControllerNode.dispose();
          model.secondaryNumberLinePointControllers.removeItemRemovedListener( removalListener );
        }
      };
      model.secondaryNumberLinePointControllers.addItemRemovedListener( removalListener );
    } );

    // accordion box containing a mathematical description of the operations on the number line
    const secondaryOperationDescriptionAccordionBox = new OperationDescriptionAccordionBox( model.secondaryNumberLine, {
      centerX: this.layoutBounds.centerX,
      bottom: this.layoutBounds.maxY - 20
    } );
    secondaryNumberLineLayer.addChild( secondaryOperationDescriptionAccordionBox );

    // carousel in which the operation entry controls for the upper number line reside
    const secondaryOperationEntryCarousel = new OperationEntryCarousel( model.secondaryNumberLine, {
      entryControlInitialValue: 1,
      entryControlIncrement: 1,
      right: this.layoutBounds.maxX - 60,
      bottom: this.layoutBounds.maxY - 4
    } );
    secondaryNumberLineLayer.addChild( secondaryOperationEntryCarousel );

    // erase button for secondary number line
    const secondaryNumberLineEraserButton = new EraserButton( {
      iconWidth: 36,
      left: secondaryNumberLineNode.right + 8,
      centerY: model.secondaryNumberLine.centerPositionProperty.value.y,
      listener: () => {
        model.secondaryNumberLine.deactivateAllOperations();
        // primaryOperationEntryCarousel.pageNumberProperty.reset();
        // operationEntryControls.forEach( control => {control.clear(); } );
      }
    } );
    secondaryNumberLineLayer.addChild( secondaryNumberLineEraserButton );

    // erase is disabled if there are no operations
    model.secondaryNumberLine.operations.forEach( operation => {
      operation.isActiveProperty.link( () => {
        secondaryNumberLineEraserButton.enabled = model.secondaryNumberLine.getActiveOperations().length > 0;
      } );
    } );

    // add the selector used to show/hide the second number line
    const singleDualNumberLineSelector = new SingleDualNumberLineSelector( model.secondNumberLineVisibleProperty, {
      left: checkboxGroup.left,
      bottom: this.layoutBounds.maxY - 50
    } );
    this.addChild( singleDualNumberLineSelector );

    // the second number line is only visible when enabled
    let secondaryNumberLineFadeAnimation = null;
    model.secondNumberLineVisibleProperty.link( secondNumberLineVisible => {
      const targetOpacity = secondNumberLineVisible ? 1 : 0;
      if ( secondaryNumberLineLayer.opacity !== targetOpacity ) {

        // stop any previous animation
        if ( secondaryNumberLineFadeAnimation ) {
          secondaryNumberLineFadeAnimation.stop();
        }

        secondaryNumberLineFadeAnimation = new Animation( {
          duration: 0.5,
          from: secondaryNumberLineLayer.opacity,
          to: targetOpacity,
          easing: Easing.CUBIC_IN_OUT,
          setValue: value => {
            secondaryNumberLineLayer.opacity = value;
          }
        } );
        secondaryNumberLineFadeAnimation.start();
        secondaryNumberLineFadeAnimation.endedEmitter.addListener( () => {
          secondaryNumberLineFadeAnimation = null;
        } );
      }
    } );

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
        primaryOperationEntryCarousel.reset();
        model.reset();
      },
      right: this.layoutBounds.maxX - NLOConstants.SCREEN_VIEW_X_MARGIN,
      bottom: this.layoutBounds.maxY - NLOConstants.SCREEN_VIEW_Y_MARGIN,
      tandem: tandem.createTandem( 'resetAllButton' )
    } );
    this.addChild( resetAllButton );
  }
}

numberLineOperations.register( 'NLOGenericScreenView', NLOGenericScreenView );
export default NLOGenericScreenView;