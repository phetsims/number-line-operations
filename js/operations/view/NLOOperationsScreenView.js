// Copyright 2020, University of Colorado Boulder

/**
 * @author John Blanco
 */

import BooleanProperty from '../../../../axon/js/BooleanProperty.js';
import Range from '../../../../dot/js/Range.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import ScreenView from '../../../../joist/js/ScreenView.js';
import NLCConstants from '../../../../number-line-common/js/common/NLCConstants.js';
import NLCheckbox from '../../../../number-line-common/js/common/view/NLCheckbox.js';
import EraserButton from '../../../../scenery-phet/js/buttons/EraserButton.js';
import ResetAllButton from '../../../../scenery-phet/js/buttons/ResetAllButton.js';
import PhetFont from '../../../../scenery-phet/js/PhetFont.js';
import VBox from '../../../../scenery/js/nodes/VBox.js';
import NLOConstants from '../../common/NLOConstants.js';
import ControllableOperationNumberLineNode from '../../common/view/ControllableOperationNumberLineNode.js';
import OperationEntryCarousel from '../../common/view/OperationEntryCarousel.js';
import numberLineOperations from '../../numberLineOperations.js';
import numberLineOperationsStrings from '../../numberLineOperationsStrings.js';
import DynamicOperationDescription from './DynamicOperationDescription.js';
import InitialNetWorthAccordionBox from './InitialNetWorthAccordionBox.js';
import NumericalExpressionAccordionBox from './NumericalExpressionAccordionBox.js';

class NLOOperationsScreenView extends ScreenView {

  /**
   * @param {NLOOperationsModel} model
   * @param {tandem} tandem
   */
  constructor( model, tandem ) {

    super( {
      tandem: tandem
    } );

    // number line node
    const numberLineNode = new ControllableOperationNumberLineNode(
      model.numberLine,
      model.initialValuePointController,
      model.pointControllers,
      this.layoutBounds,
      {
        numberLineNodeOptions: {
          pointNodeOptions: {
            radius: 6
          },
          numberLineOperationNodeOptions: {
            useFinancialDescriptions: true,
            operationLabelFont: new PhetFont( 22 ),
            labelDistanceFromApex: 20
          }
        }
      }
    );
    this.addChild( numberLineNode );

    // checkboxes that will control the presentation options
    const checkboxes = [
      new NLCheckbox(
        numberLineOperationsStrings.pointLabels,
        model.numberLine.showPointLabelsProperty
      ),
      new NLCheckbox(
        numberLineOperationsStrings.operationLabels,
        model.numberLine.showOperationLabelsProperty
      ),
      new NLCheckbox(
        numberLineOperationsStrings.operationDescription,
        model.numberLine.showOperationDescriptionsProperty
      ),
      new NLCheckbox(
        numberLineOperationsStrings.tickMarks,
        model.numberLine.showTickMarksProperty
      )
    ];
    const checkboxGroup = new VBox( {
      children: checkboxes,
      spacing: NLOConstants.CHECKBOX_SPACING,
      align: 'left',
      left: this.layoutBounds.minX + NLCConstants.SCREEN_VIEW_X_MARGIN,
      top: this.layoutBounds.minY + NLCConstants.SCREEN_VIEW_Y_MARGIN
    } );
    this.addChild( checkboxGroup );

    // accordion box containing a mathematical description of the operations on the number line
    const numericalExpressionAccordionBox = new NumericalExpressionAccordionBox( model.numberLine, {
      centerX: this.layoutBounds.centerX,
      top: this.layoutBounds.minY + NLCConstants.SCREEN_VIEW_Y_MARGIN
    } );
    this.addChild( numericalExpressionAccordionBox );

    const commonEntryControlOptions = {
      numberPickerRange: new Range( -1000, 1000 ),
      numberPickerOptions: {
        timerDelay: 400,
        timerInterval: 100
      }
    };

    // carousel with the operation entry controls
    const operationEntryCarousel = new OperationEntryCarousel( model.numberLine, {
      right: this.layoutBounds.maxX - NLOConstants.OPERATION_ENTRY_CAROUSEL_LEFT_INSET,
      top: this.layoutBounds.minY + NLCConstants.SCREEN_VIEW_Y_MARGIN,
      entryControl1Options: commonEntryControlOptions,
      entryControl2Options: commonEntryControlOptions
    } );
    this.addChild( operationEntryCarousel );

    // A flag that tracks whether the operation entry carousel is "in focus", which in this context means that the most
    // recent pointer down event had the carousel in its trail.  See usages to better understand why this is needed.
    const operationEntryCarouselHasFocusProperty = new BooleanProperty( false );

    // Add a listener that detects when pointer down events occur that are outside the operation entry carousel and
    // updated a property to reflect whether the carousel has focus.  This code was highly leveraged from some code that
    // exists for a similar purpose in BuildingLabScreenView.  See
    // https://github.com/phetsims/number-line-operations/issues/23.
    phet.joist.display.addInputListener( {
      down: event => {
        const screen = phet.joist.sim.screenProperty.value;
        if ( screen && screen.view === this ) {

          // See if our press was a "miss" (trail length 1) or a hit on our screen (screen.view in the trail). This is
          // necessary to exclude home-screen clicks.
          const doesTrailMatch = _.includes( event.trail.nodes, screen.view ) || event.trail.length <= 1;

          if ( doesTrailMatch ) {
            operationEntryCarouselHasFocusProperty.set( _.includes( event.trail.nodes, operationEntryCarousel ) );
          }
        }
      }
    } );

    // local constant that tracks if a reset is in progress, needed by the dynamic operation description
    const resetInProgressProperty = new BooleanProperty( false );

    // @private - Textual descriptions of the operations that are shown as the user manipulates a potential operation
    // before adding it to the number line.
    this.dynamicOperationDescriptions = [];
    model.numberLine.operations.forEach( ( operation, index ) => {
      const dynamicOperationDescription = new DynamicOperationDescription(
        model.numberLine.showOperationDescriptionsProperty,
        new Vector2( this.layoutBounds.centerX, this.layoutBounds.minY + 115 ), // y offset empirically determined
        new Vector2( this.layoutBounds.centerX, this.layoutBounds.minY + 190 ), // y offset empirically determined
        operation,
        index,
        operationEntryCarousel.selectedPageProperty,
        model.numberLine,
        resetInProgressProperty,
        operationEntryCarouselHasFocusProperty,
        { maxWidth: 300 }
      );
      this.addChild( dynamicOperationDescription );
      this.dynamicOperationDescriptions.push( dynamicOperationDescription );
    } );

    // erase button
    const eraserButton = new EraserButton( {
      iconWidth: NLOConstants.ERASER_BUTTON_ICON_WIDTH,
      right: this.layoutBounds.maxX - NLOConstants.ERASER_BUTTON_INSET,
      centerY: model.numberLine.centerPositionProperty.value.y,
      listener: () => {
        model.numberLine.deactivateAllOperations();
        operationEntryCarousel.reset();

        // By design, the operations are set to have values of zero rather than their default values when the eraser
        // button is used.
        model.numberLine.operations.forEach( operation => operation.amountProperty.set( 0 ) );
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
        resetInProgressProperty.set( true );
        this.interruptSubtreeInput(); // cancel interactions that may be in progress
        numericalExpressionAccordionBox.reset();
        operationEntryCarousel.reset();
        model.reset();
        model.numberLine.deactivateAllOperations();
        resetInProgressProperty.set( false );
      },
      right: this.layoutBounds.maxX - NLCConstants.SCREEN_VIEW_X_MARGIN,
      bottom: this.layoutBounds.maxY - NLCConstants.SCREEN_VIEW_Y_MARGIN,
      tandem: tandem.createTandem( 'resetAllButton' )
    } );
    this.addChild( resetAllButton );
  }
}

numberLineOperations.register( 'NLOOperationsScreenView', NLOOperationsScreenView );
export default NLOOperationsScreenView;