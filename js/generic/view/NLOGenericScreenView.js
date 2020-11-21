// Copyright 2020, University of Colorado Boulder

/**
 * main screen view for the "Generic" screen
 *
 * @author John Blanco
 */

import ScreenView from '../../../../joist/js/ScreenView.js';
import NLCheckbox from '../../../../number-line-common/js/common/view/NLCheckbox.js';
import NumberLineRangeSelector from '../../../../number-line-common/js/common/view/NumberLineRangeSelector.js';
import PointControllerNode from '../../../../number-line-common/js/common/view/PointControllerNode.js';
import merge from '../../../../phet-core/js/merge.js';
import EraserButton from '../../../../scenery-phet/js/buttons/EraserButton.js';
import ResetAllButton from '../../../../scenery-phet/js/buttons/ResetAllButton.js';
import PhetFont from '../../../../scenery-phet/js/PhetFont.js';
import Node from '../../../../scenery/js/nodes/Node.js';
import Text from '../../../../scenery/js/nodes/Text.js';
import VBox from '../../../../scenery/js/nodes/VBox.js';
import Color from '../../../../scenery/js/util/Color.js';
import Animation from '../../../../twixt/js/Animation.js';
import Easing from '../../../../twixt/js/Easing.js';
import NLOConstants from '../../common/NLOConstants.js';
import OperationEntryCarousel from '../../common/view/OperationEntryCarousel.js';
import OperationTrackingNumberLineNode from '../../common/view/OperationTrackingNumberLineNode.js';
import numberLineOperations from '../../numberLineOperations.js';
import numberLineOperationsStrings from '../../numberLineOperationsStrings.js';
import NumericalExpressionAccordionBox from '../../operations/view/NumericalExpressionAccordionBox.js';
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
const SECONDARY_ENTRY_CAROUSEL_THEME_COLOR = new Color( 0xE5BDF5 );
const SECONDARY_CAROUSEL_BUTTON_OPTIONS = {
  arrowDirection: 'up'
};

class NLOGenericScreenView extends ScreenView {

  /**
   * @param {NLOGenericModel} model
   * @param {Tandem} tandem
   */
  constructor( model, tandem ) {

    super( {
      tandem: tandem
    } );

    // checkboxes that will control the presentation options
    const checkboxes = [
      new NLCheckbox(
        numberLineOperationsStrings.pointLabels,
        model.primaryNumberLine.showPointLabelsProperty
      ),
      new NLCheckbox(
        numberLineOperationsStrings.operationLabels,
        model.primaryNumberLine.showOperationLabelsProperty
      ),
      new NLCheckbox(
        numberLineOperationsStrings.tickMarks,
        model.primaryNumberLine.showTickMarksProperty
      )
    ];
    const checkboxGroup = new VBox( {
      children: checkboxes,
      spacing: NLOConstants.CHECKBOX_SPACING,
      align: 'left',
      left: this.layoutBounds.minX + NLOConstants.SCREEN_VIEW_X_MARGIN,
      top: this.layoutBounds.minY + NLOConstants.SCREEN_VIEW_Y_MARGIN
    } );
    this.addChild( checkboxGroup );

    // create and add the representation of the primary number line
    const primaryNumberLineView = new InteractiveNumberLineView(
      model.primaryNumberLine,
      model.primaryLineInitialValuePointController,
      model.primaryNumberLinePointControllers,
      this.layoutBounds,
      {
        numericalExpressionAccordionBoxOptions: {
          top: this.layoutBounds.minY + NLOConstants.SCREEN_VIEW_Y_MARGIN
        },
        operationEntryCarouselOptions: {
          top: this.layoutBounds.minY + NLOConstants.SCREEN_VIEW_Y_MARGIN
        }
      }
    );
    this.addChild( primaryNumberLineView );

    // layer where the secondary number line will live, here so that it can be shown and hidden
    const secondaryNumberLineLayer = new Node( { opacity: 0 } );
    this.addChild( secondaryNumberLineLayer );

    // create and add the representation of the secondary number line
    const secondaryNumberLineView = new InteractiveNumberLineView(
      model.secondaryNumberLine,
      model.secondaryLineInitialValuePointController,
      model.secondaryNumberLinePointControllers,
      this.layoutBounds,
      {
        numericalExpressionAccordionBoxOptions: {
          bottom: this.layoutBounds.maxY - NLOConstants.SCREEN_VIEW_Y_MARGIN
        },
        operationEntryCarouselOptions: {
          bottom: this.layoutBounds.maxY - NLOConstants.SCREEN_VIEW_Y_MARGIN,
          themeColor: SECONDARY_ENTRY_CAROUSEL_THEME_COLOR,
          entryControl1Options: SECONDARY_CAROUSEL_BUTTON_OPTIONS,
          entryControl2Options: SECONDARY_CAROUSEL_BUTTON_OPTIONS,
          pageControlPosition: OperationEntryCarousel.PageControlPosition.ABOVE
        }
      }
    );
    secondaryNumberLineLayer.addChild( secondaryNumberLineView );

    // add the selector used to show/hide the second number line
    const singleDualNumberLineSelector = new SingleDualNumberLineSelector( model.secondNumberLineVisibleProperty, {
      left: checkboxGroup.left,
      bottom: this.layoutBounds.maxY - 46
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

    // keep the selected range of the secondary number line in sync with that of the primary
    model.primaryNumberLine.displayedRangeProperty.link( displayedRange => {
      model.secondaryNumberLine.displayedRangeProperty.set( displayedRange );
    } );

    // reset all
    const resetAllButton = new ResetAllButton( {
      listener: () => {
        this.interruptSubtreeInput(); // cancel interactions that may be in progress
        primaryNumberLineView.reset();
        secondaryNumberLineView.reset();
        model.reset();
      },
      right: this.layoutBounds.maxX - NLOConstants.SCREEN_VIEW_X_MARGIN,
      bottom: this.layoutBounds.maxY - NLOConstants.SCREEN_VIEW_Y_MARGIN,
      tandem: tandem.createTandem( 'resetAllButton' )
    } );
    this.addChild( resetAllButton );
  }
}

/**
 * InteractiveNumberLineView is an inner class to creates and positions the various view elements used to represent and
 * interact with a number line.  It exists primarily to avoid code duplication.
 */
class InteractiveNumberLineView extends Node {

  /**
   * Add the various view elements for the provided number line.  This method exists primarily to minimize code
   * duplication.
   * @param {OperationTrackingNumberLine} numberLine
   * @param {PointController} initialValuePointController
   * @param {ObservableArrayDef<PointController>} pointControllerObservableArray
   * @param {Bounds2} layoutBounds - the bounds into which this must be laid out
   * @param {Object} [options]
   */
  constructor( numberLine, initialValuePointController, pointControllerObservableArray, layoutBounds, options ) {

    options = merge( {

      numericalExpressionAccordionBoxOptions: {
        titleNode: new Text( numberLineOperationsStrings.numericalExpression, {
          font: new PhetFont( 18 ),
          maxWidth: 250
        } ),
        centerX: layoutBounds.centerX
      },
      operationEntryCarouselOptions: {
        entryControl1Options: {
          increment: 1
        },
        entryControl2Options: {
          increment: 1
        },
        right: layoutBounds.maxX - NLOConstants.OPERATION_ENTRY_CAROUSEL_LEFT_INSET
      }

    }, options );

    super();

    // layer where the point controllers go so that they stay behind the points
    const pointControllerLayer = new Node();
    this.addChild( pointControllerLayer );

    // node that represents the number line itself
    const numberLineNode = new OperationTrackingNumberLineNode(
      numberLine,
      NUMBER_LINE_NODE_OPTIONS
    );
    this.addChild( numberLineNode );

    // point controller for the starting point on the number line, which is always present
    pointControllerLayer.addChild( new PointControllerNode( initialValuePointController ) );

    // add and remove nodes for the point controllers that come and go from the number line
    pointControllerObservableArray.addItemAddedListener( addedPointController => {
      const pointControllerNode = new PointControllerNode( addedPointController );
      pointControllerLayer.addChild( pointControllerNode );
      const removalListener = removedPointController => {
        if ( removedPointController === addedPointController ) {
          pointControllerLayer.removeChild( pointControllerNode );
          pointControllerNode.dispose();
          pointControllerObservableArray.removeItemRemovedListener( removalListener );
        }
      };
      pointControllerObservableArray.addItemRemovedListener( removalListener );
    } );

    // accordion box containing a mathematical description of the operations on the number line
    const numericalExpressionAccordionBox = new NumericalExpressionAccordionBox(
      numberLine,
      options.numericalExpressionAccordionBoxOptions
    );
    this.addChild( numericalExpressionAccordionBox );

    // @private - carousel in which the operation entry controls reside
    this.operationEntryCarousel = new OperationEntryCarousel( numberLine, options.operationEntryCarouselOptions );
    this.addChild( this.operationEntryCarousel );

    // erase button
    const eraserButton = new EraserButton( {
      iconWidth: NLOConstants.ERASER_BUTTON_ICON_WIDTH,
      right: layoutBounds.maxX - NLOConstants.ERASER_BUTTON_INSET,
      listener: () => {
        numberLine.deactivateAllOperations();
        this.operationEntryCarousel.reset();

        // By design, the operations are set to have values of zero rather than their default values when the eraser
        // button is used.
        numberLine.operations.forEach( operation => operation.amountProperty.set( 0 ) );
      }
    } );
    this.addChild( eraserButton );

    // erase is disabled if there are no operations
    numberLine.operations.forEach( operation => {
      operation.isActiveProperty.link( () => {
        eraserButton.enabled = numberLine.getActiveOperations().length > 0;
      } );
    } );

    // reposition the eraser button if the number line moves
    numberLine.centerPositionProperty.link( position => {
      eraserButton.centerY = position.y;
    } );

    // Monitor the points on the number line and make sure that the operation being manipulated is the one being shown
    // in the corresponding operation entry carousel.
    numberLine.residentPoints.addItemAddedListener( addedPoint => {

      // Hook up a listener to the new point that will make sure that the operation entry carousel is showing the
      // operation that is being manipulated.
      const pointIsDraggingListener = isDragging => {
        if ( isDragging ) {
          this.operationEntryCarousel.showOperationWithEndpoint( addedPoint );
        }
      };
      addedPoint.isDraggingProperty.lazyLink( pointIsDraggingListener );

      // Listen for when this point is removed and unhook the listener when it is.
      numberLine.residentPoints.addItemRemovedListener( function pointRemovedListener( removedPoint ) {
        if ( removedPoint === addedPoint ) {
          removedPoint.isDraggingProperty.unlink( pointIsDraggingListener );
          numberLine.residentPoints.removeItemRemovedListener( pointRemovedListener );
        }
      } );
    } );
  }

  /**
   * @public
   */
  reset() {
    this.operationEntryCarousel.reset();
  }
}

numberLineOperations.register( 'NLOGenericScreenView', NLOGenericScreenView );
export default NLOGenericScreenView;