// Copyright 2020, University of Colorado Boulder

import ScreenView from '../../../../joist/js/ScreenView.js';
import NLCheckbox from '../../../../number-line-common/js/common/view/NLCheckbox.js';
import ResetAllButton from '../../../../scenery-phet/js/buttons/ResetAllButton.js';
import Image from '../../../../scenery/js/nodes/Image.js';
import VBox from '../../../../scenery/js/nodes/VBox.js';
import mockupImage from '../../../images/net-worth-screen-mockup_png.js';
import NLOConstants from '../../common/NLOConstants.js';
import HoldingBagNode from '../../common/view/HoldingBagNode.js';
import HoldingBoxNode from '../../common/view/HoldingBoxNode.js';
import OperationTrackingNumberLineNode from '../../common/view/OperationTrackingNumberLineNode.js';
import TotalValueAccordionBox from '../../common/view/TotalValueAccordionBox.js';
import TotalValueIndicatorNode from '../../common/view/TotalValueIndicatorNode.js';
import numberLineOperations from '../../numberLineOperations.js';
import numberLineOperationsStrings from '../../numberLineOperationsStrings.js';
import NLONetWorthModel from '../model/NLONetWorthModel.js';
import BalanceSheetItemNode from './BalanceSheetItemNode.js';

/**
 * NLONetWorthScreenView is the root of the view screen graph for the Net Worth screen.
 *
 * @author John Blanco
 */
class NLONetWorthScreenView extends ScreenView {

  /**
   * @param {NLONetWorthModel} model
   * @param {Tandem} tandem
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

    // checkboxes that will control the presentation options
    const checkboxes = [
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
      left: this.layoutBounds.minX + NLOConstants.SCREEN_VIEW_X_MARGIN,
      top: this.layoutBounds.minY + NLOConstants.SCREEN_VIEW_Y_MARGIN
    } );
    this.addChild( checkboxGroup );

    // accordion box that displays the net worth when open
    this.addChild( new TotalValueAccordionBox( model.netWorthProperty, {
      expandedProperty: model.netWorthAccordionBoxExpandedProperty,
      centerX: this.layoutBounds.centerX,
      top: this.layoutBounds.minY + NLOConstants.SCREEN_VIEW_Y_MARGIN
    } ) );

    // number line node
    this.addChild( new OperationTrackingNumberLineNode( model.numberLine, {
      pointNodeOptions: {
        radius: 6
      }
    } ) );

    // piggy bank that displays the net worth and moves as the value changes
    const netWorthPiggyBankNode = new TotalValueIndicatorNode(
      model.netWorthProperty,
      NLONetWorthModel.NET_WORTH_RANGE,
      { centerY: model.numberLine.centerPositionProperty.value.y + 68 }
    );
    this.addChild( netWorthPiggyBankNode );

    // update the position of the piggy bank node when the net worth changes
    model.netWorthProperty.link( netWorth => {
      netWorthPiggyBankNode.centerX = model.numberLine.valueToModelPosition( netWorth ).x;
    } );

    // add the view representation for the storage areas where the assets and debts will be when not in use
    this.addChild( new HoldingBoxNode( model.assetsBox ) );
    this.addChild( new HoldingBoxNode( model.debtsBox ) );

    // add the view representations for the areas where the assets and debts will be stored when in use
    this.addChild( new HoldingBagNode( model.assetsBag, numberLineOperationsStrings.assets ) );
    this.addChild( new HoldingBagNode( model.debtsBag, numberLineOperationsStrings.debts ) );

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
      right: this.layoutBounds.maxX - NLOConstants.SCREEN_VIEW_X_MARGIN,
      bottom: this.layoutBounds.maxY - NLOConstants.SCREEN_VIEW_Y_MARGIN,
      tandem: tandem.createTandem( 'resetAllButton' )
    } );
    this.addChild( resetAllButton );
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

numberLineOperations.register( 'NLONetWorthScreenView', NLONetWorthScreenView );
export default NLONetWorthScreenView;