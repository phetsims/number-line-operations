// Copyright 2020-2023, University of Colorado Boulder

/**
 * NLONetWorthScreenView is the root of the view screen graph for the Net Worth screen.
 *
 * @author John Blanco (PhET Interactive Simulations)
 */

import ScreenView from '../../../../joist/js/ScreenView.js';
import NLCConstants from '../../../../number-line-common/js/common/NLCConstants.js';
import NLCheckbox from '../../../../number-line-common/js/common/view/NLCheckbox.js';
import NLCheckboxGroup from '../../../../number-line-common/js/common/view/NLCheckboxGroup.js';
import MoneyJarDecoration from '../../../../number-line-common/js/explore/model/MoneyJarDecoration.js';
import MoneyJarNode from '../../../../number-line-common/js/explore/view/MoneyJarNode.js';
import ResetAllButton from '../../../../scenery-phet/js/buttons/ResetAllButton.js';
import NLOConstants from '../../common/NLOConstants.js';
import HoldingBagNode from '../../common/view/HoldingBagNode.js';
import HoldingBoxNode from '../../common/view/HoldingBoxNode.js';
import OperationTrackingNumberLineNode from '../../common/view/OperationTrackingNumberLineNode.js';
import TotalValueAccordionBox from '../../common/view/TotalValueAccordionBox.js';
import TotalValueIndicatorNode from '../../common/view/TotalValueIndicatorNode.js';
import numberLineOperations from '../../numberLineOperations.js';
import NumberLineOperationsStrings from '../../NumberLineOperationsStrings.js';
import BalanceSheetItemNode from './BalanceSheetItemNode.js';

class NLONetWorthScreenView extends ScreenView {

  /**
   * @param {NLONetWorthModel} model
   * @param {Tandem} tandem
   */
  constructor( model, tandem ) {

    super( {
      tandem: tandem
    } );

    // checkboxes that will control the presentation options
    const checkboxes = [
      new NLCheckbox( model.numberLine.showOperationDescriptionsProperty, NumberLineOperationsStrings.operationDescriptionsStringProperty ),
      new NLCheckbox( model.numberLine.showOperationLabelsProperty, NumberLineOperationsStrings.operationLabelsStringProperty ),
      new NLCheckbox( model.numberLine.showTickMarksProperty, NumberLineOperationsStrings.tickMarksStringProperty )
    ];
    this.addChild( new NLCheckboxGroup( checkboxes ) );

    // accordion box that displays the net worth when open
    this.addChild( new TotalValueAccordionBox( model.netWorthProperty, {
      titleText: NLOConstants.NET_WORTH_WITH_CURRENCY_STRING_PROPERTY,
      labelText: NumberLineOperationsStrings.netWorthStringProperty,
      showTotalAsCurrency: true,
      expandedProperty: model.netWorthAccordionBoxExpandedProperty,
      centerX: this.layoutBounds.centerX,
      top: this.layoutBounds.minY + NLCConstants.SCREEN_VIEW_Y_MARGIN
    } ) );

    // number line node
    this.numberLineNode = new OperationTrackingNumberLineNode( model.numberLine, {
      pointNodeOptions: {
        radius: 6
      },
      numberLineOperationNodeOptions: {
        useFinancialDescriptions: true
      }
    } );
    this.addChild( this.numberLineNode );

    // piggy bank that displays the net worth and moves as the value changes
    const netWorthPiggyBankNode = new TotalValueIndicatorNode(
      model.netWorthProperty,
      new MoneyJarNode( {
        decorationType: MoneyJarDecoration.NONE,
        maxHeight: 70 // empirically determined
      } ),
      NLOConstants.NET_WORTH_RANGE,
      {
        isCurrency: true,
        centerY: model.numberLine.centerPositionProperty.value.y + 72
      }
    );
    this.addChild( netWorthPiggyBankNode );

    // Update the position of the piggy bank node when the net worth changes.  No unlink needed.
    model.netWorthProperty.link( netWorth => {
      netWorthPiggyBankNode.centerX = model.numberLine.valueToModelPosition( netWorth ).x;
    } );

    // add the view representation for the storage areas where the assets and debts will be when not in use
    this.addChild( new HoldingBoxNode( model.assetsBox ) );
    this.addChild( new HoldingBoxNode( model.debtsBox ) );

    // add the view representations for the areas where the assets and debts will be stored when in use
    this.addChild( new HoldingBagNode( model.assetsBag, NumberLineOperationsStrings.assetsStringProperty ) );
    this.addChild( new HoldingBagNode( model.debtsBag, NumberLineOperationsStrings.debtsStringProperty ) );

    // add the assets and debts
    model.balanceSheetItems.forEach( balanceSheetItem => {
      this.addChild( new BalanceSheetItemNode( balanceSheetItem ) );
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

numberLineOperations.register( 'NLONetWorthScreenView', NLONetWorthScreenView );
export default NLONetWorthScreenView;