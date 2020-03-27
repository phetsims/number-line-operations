// Copyright 2020, University of Colorado Boulder

/**
 * @author John Blanco
 */

import ScreenView from '../../../../joist/js/ScreenView.js';
import ResetAllButton from '../../../../scenery-phet/js/buttons/ResetAllButton.js';
import Text from '../../../../scenery/js/nodes/Text.js';
import VBox from '../../../../scenery/js/nodes/VBox.js';
import Checkbox from '../../../../sun/js/Checkbox.js';
import NLOConstants from '../../common/NLOConstants.js';
import numberLineOperationsStrings from '../../number-line-operations-strings.js';
import numberLineOperations from '../../numberLineOperations.js';
import BalanceSheetItemNode from './BalanceSheetItemNode.js';
import NetWorthAccordionBox from './NetWorthAccordionBox.js';

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
      new Checkbox(
        new Text( numberLineOperationsStrings.operationLabels, NLOConstants.CHECKBOX_TEXT_OPTIONS ),
        model.operationLabelsVisibleProperty,
        NLOConstants.CHECKBOX_OPTIONS
      ),
      new Checkbox(
        new Text( numberLineOperationsStrings.operationDescription, NLOConstants.CHECKBOX_TEXT_OPTIONS ),
        model.operationDescriptionVisibleProperty,
        NLOConstants.CHECKBOX_OPTIONS
      ),
      new Checkbox(
        new Text( numberLineOperationsStrings.tickMarks, NLOConstants.CHECKBOX_TEXT_OPTIONS ),
        model.tickMarksVisibleProperty,
        NLOConstants.CHECKBOX_OPTIONS
      )
    ];
    const checkboxGroup = new VBox( {
      children: checkboxes,
      spacing: 15,
      align: 'left',

      // position - empirically determined to look decent
      left: this.layoutBounds.maxX - 220,
      top: this.layoutBounds.minY + 10
    } );
    this.addChild( checkboxGroup );

    // accordion box that displays the net worth when open
    this.addChild( new NetWorthAccordionBox( model.netWorthProperty, {
      centerX: this.layoutBounds.centerX,
      top: 10
    } ) );

    // add the assets and debts
    model.balanceSheetItems.forEach( balanceSheetItem => {
      this.addChild( new BalanceSheetItemNode( balanceSheetItem ) );
    } );

    // reset all button
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

numberLineOperations.register( 'NLONetWorthScreenView', NLONetWorthScreenView );
export default NLONetWorthScreenView;