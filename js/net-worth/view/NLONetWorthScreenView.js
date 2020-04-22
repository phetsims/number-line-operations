// Copyright 2020, University of Colorado Boulder

/**
 * NLONetWorthScreenView is the root of the view screen graph for the Net Worth screen.
 * @author John Blanco
 */

import ScreenView from '../../../../joist/js/ScreenView.js';
import NLCConstants from '../../../../number-line-common/js/common/NLCConstants.js';
import ResetAllButton from '../../../../scenery-phet/js/buttons/ResetAllButton.js';
import Image from '../../../../scenery/js/nodes/Image.js';
import Text from '../../../../scenery/js/nodes/Text.js';
import VBox from '../../../../scenery/js/nodes/VBox.js';
import Checkbox from '../../../../sun/js/Checkbox.js';
import mockupImage from '../../../images/net-worth-screen-mockup_png.js';
import NLOConstants from '../../common/NLOConstants.js';
import OperationTrackingNumberLineNode from '../../common/view/OperationTrackingNumberLineNode.js';
import numberLineOperationsStrings from '../../numberLineOperationsStrings.js';
import numberLineOperations from '../../numberLineOperations.js';
import NLONetWorthModel from '../model/NLONetWorthModel.js';
import BalanceSheetItemBagNode from './BalanceSheetItemBagNode.js';
import BalanceSheetItemBoxNode from './BalanceSheetItemBoxNode.js';
import BalanceSheetItemNode from './BalanceSheetItemNode.js';
import NetWorthAccordionBox from './NetWorthAccordionBox.js';
import NetWorthPiggyBankNode from './NetWorthPiggyBankNode.js';

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
      spacing: 15,
      align: 'left',

      // position - empirically determined to look decent
      left: this.layoutBounds.minX + 40,
      top: this.layoutBounds.minY + 10
    } );
    this.addChild( checkboxGroup );

    // accordion box that displays the net worth when open
    this.addChild( new NetWorthAccordionBox( model.netWorthProperty, {
      expandedProperty: model.netWorthAccordionBoxExpandedProperty,
      centerX: this.layoutBounds.centerX,
      top: 10
    } ) );

    // number line node
    this.addChild( new OperationTrackingNumberLineNode( model.numberLine, {
      pointNodeOptions: {
        radius: 6
      }
    } ) );

    // piggy bank that displays the net worth and moves as the value changes
    const netWorthPiggyBankNode = new NetWorthPiggyBankNode(
      model.netWorthProperty,
      NLONetWorthModel.NET_WORTH_RANGE,
      { centerY: model.numberLine.centerPosition.y + 75 }
    );
    this.addChild( netWorthPiggyBankNode );

    // update the position of the piggy bank node when the net worth changes
    model.netWorthProperty.link( netWorth => {
      netWorthPiggyBankNode.centerX = model.numberLine.valueToModelPosition( netWorth ).x;
    } );

    // add the view representation for the storage areas where the assets and debts will be when not in use
    this.addChild( new BalanceSheetItemBoxNode( model.assetsBox ) );
    this.addChild( new BalanceSheetItemBoxNode( model.debtsBox ) );

    // add the view representations for the areas where the assets and debts will be stored when in use
    this.addChild( new BalanceSheetItemBagNode( model.assetsBag ) );
    this.addChild( new BalanceSheetItemBagNode( model.debtsBag ) );

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