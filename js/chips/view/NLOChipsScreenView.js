// Copyright 2020, University of Colorado Boulder

/**
 * NLOChipsScreenView is the root of the view screen graph for the "Chips" screen.
 *
 * @author John Blanco (PhET Interactive Simulations)
 */

import Vector2 from '../../../../dot/js/Vector2.js';
import ScreenView from '../../../../joist/js/ScreenView.js';
import NLCConstants from '../../../../number-line-common/js/common/NLCConstants.js';
import NLCheckbox from '../../../../number-line-common/js/common/view/NLCheckbox.js';
import NLCheckboxGroup from '../../../../number-line-common/js/common/view/NLCheckboxGroup.js';
import ResetAllButton from '../../../../scenery-phet/js/buttons/ResetAllButton.js';
import Color from '../../../../scenery/js/util/Color.js';
import HoldingBagNode from '../../common/view/HoldingBagNode.js';
import HoldingBoxNode from '../../common/view/HoldingBoxNode.js';
import OperationTrackingNumberLineNode from '../../common/view/OperationTrackingNumberLineNode.js';
import TotalValueAccordionBox from '../../common/view/TotalValueAccordionBox.js';
import TotalValueIndicatorNode from '../../common/view/TotalValueIndicatorNode.js';
import numberLineOperations from '../../numberLineOperations.js';
import numberLineOperationsStrings from '../../numberLineOperationsStrings.js';
import NLOChipsModel from '../model/NLOChipsModel.js';
import ChipStackNode from './ChipStackNode.js';
import FillableBagNode from './FillableBagNode.js';

class NLOChipsScreenView extends ScreenView {

  /**
   * @param {NLOChipsModel} model
   * @param {Tandem} tandem
   */
  constructor( model, tandem ) {

    super( {
      tandem: tandem
    } );

    // checkboxes that will control the presentation options
    const checkboxes = [
      new NLCheckbox(
        numberLineOperationsStrings.operationDescriptions,
        model.numberLine.showOperationDescriptionsProperty
      ),
      new NLCheckbox(
        numberLineOperationsStrings.operationLabels,
        model.numberLine.showOperationLabelsProperty
      ),
      new NLCheckbox(
        numberLineOperationsStrings.tickMarks,
        model.numberLine.showTickMarksProperty
      )
    ];
    this.addChild( new NLCheckboxGroup( checkboxes ) );

    // accordion box that displays the net worth when open
    this.addChild( new TotalValueAccordionBox( model.totalInBagsProperty, {
      expandedProperty: model.netWorthAccordionBoxExpandedProperty,
      centerX: this.layoutBounds.centerX,
      top: this.layoutBounds.minY + NLCConstants.SCREEN_VIEW_Y_MARGIN
    } ) );

    // number line node
    this.numberLineNode = new OperationTrackingNumberLineNode( model.numberLine, {
      pointNodeOptions: {
        radius: 6
      }
    } );
    this.addChild( this.numberLineNode );

    // piggy bank that displays the net worth and moves as the value changes
    const totalValueIndicatorNode = new TotalValueIndicatorNode(
      model.totalInBagsProperty,
      new FillableBagNode( {
        maxWidth: 46 // empirically determined to match design doc
      } ),
      NLOChipsModel.CHIPS_NUMBER_LINE_RANGE,
      {
        centerY: model.numberLine.centerPositionProperty.value.y + 64,
        labelCenterOffset: new Vector2( 0, 5 ),
        leastPositiveFill: new Color( '#FFFFCC' ),
        mostPositiveFill: Color.YELLOW
      }
    );
    this.addChild( totalValueIndicatorNode );

    // update the position of the piggy bank node when the net worth changes - no unlink necessary
    model.totalInBagsProperty.link( netWorth => {
      totalValueIndicatorNode.centerX = model.numberLine.valueToModelPosition( netWorth ).x;
    } );

    // add the view representation for the storage areas where the chips will reside when not in use
    this.addChild( new HoldingBoxNode( model.positiveChipsBox ) );
    this.addChild( new HoldingBoxNode( model.negativeChipsBox ) );

    // add the view representations for the bags into which the chips can be placed
    this.addChild( new HoldingBagNode( model.positiveChipsBag, numberLineOperationsStrings.positives ) );
    this.addChild( new HoldingBagNode( model.negativeChipsBag, numberLineOperationsStrings.negatives ) );

    // add the chip nodes
    model.chips.forEach( chip => {
      this.addChild( new ChipStackNode( chip ) );
    } );

    // reset all button
    const resetAllButton = new ResetAllButton( {
      listener: () => {
        this.interruptSubtreeInput(); // cancel interactions that may be in progress
        model.reset();
      },
      right: this.layoutBounds.maxX - NLCConstants.SCREEN_VIEW_X_MARGIN,
      bottom: this.layoutBounds.maxY - NLCConstants.SCREEN_VIEW_Y_MARGIN,
      tandem: tandem.createTandem( 'resetAllButton' )
    } );
    this.addChild( resetAllButton );
  }

  /**
   * @public
   */
  step() {
    this.numberLineNode.step();
  }
}

numberLineOperations.register( 'NLOChipsScreenView', NLOChipsScreenView );
export default NLOChipsScreenView;