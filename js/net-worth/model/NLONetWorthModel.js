// Copyright 2020, University of Colorado Boulder

/**
 * @author John Blanco
 */

import BooleanProperty from '../../../../axon/js/BooleanProperty.js';
import NumberProperty from '../../../../axon/js/NumberProperty.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import numberLineOperations from '../../numberLineOperations.js';
import BalanceSheetItem from './BalanceSheetItem.js';
import BalanceSheetItemBag from './BalanceSheetItemBag.js';
import BalanceSheetItemBox from './BalanceSheetItemBox.js';

/**
 * @constructor
 */
class NLONetWorthModel {

  /**
   * @param {Tandem} tandem
   */
  constructor( tandem ) {

    // @public (read-write) - total net worth, which is total assets minus total liabilities
    this.netWorthProperty = new NumberProperty( 0, {
      tandem: tandem.createTandem( 'netWorthProperty' )
    } );

    // @public (read-only) - list of balance sheet items (i.e. assets and debts) that the user can manipulate
    this.balanceSheetItems = [
      new BalanceSheetItem( -400 ),
      new BalanceSheetItem( -300 ),
      new BalanceSheetItem( -200 ),
      new BalanceSheetItem( -100 ),
      new BalanceSheetItem( 100 ),
      new BalanceSheetItem( 200 ),
      new BalanceSheetItem( 300 ),
      new BalanceSheetItem( 400 )
    ];

    // add the storage areas for the balance sheet items - this is where they reside when not in use
    const balanceItemBoxesTop = 300;
    this.assetsBox = new BalanceSheetItemBox(
      new Vector2( 750, balanceItemBoxesTop ),
      this.balanceSheetItems.filter( item => item.value > 0 )
    );
    this.debtsBox = new BalanceSheetItemBox(
      new Vector2( 50, balanceItemBoxesTop ),
      this.balanceSheetItems.filter( item => item.value < 0 )
    );
    const storageBoxes = [ this.assetsBox, this.debtsBox ];

    // add the asset and debt bags
    const balanceItemBagsCenterY = 460;
    this.debtsBag = new BalanceSheetItemBag( new Vector2( 380, balanceItemBagsCenterY ), {
      itemAcceptanceTest: BalanceSheetItemBag.ACCEPT_ONLY_DEBTS
    } );
    this.assetsBag = new BalanceSheetItemBag( new Vector2( 620, balanceItemBagsCenterY ), {
      itemAcceptanceTest: BalanceSheetItemBag.ACCEPT_ONLY_ASSETS
    } );
    const bags = [ this.debtsBag, this.assetsBag ];

    // @public (read-write)
    this.operationLabelsVisibleProperty = new BooleanProperty( true, {
      tandem: tandem.createTandem( 'operationLabelsVisibleProperty' )
    } );

    // @public (read-write)
    this.operationDescriptionVisibleProperty = new BooleanProperty( true, {
      tandem: tandem.createTandem( 'operationDescriptionVisibleProperty' )
    } );

    // @public (read-write) - whether the tick marks should be visible on the number line
    this.tickMarksVisibleProperty = new BooleanProperty( true, {
      tandem: tandem.createTandem( 'tickMarksVisibleProperty' )
    } );

    // Monitor the isDragging state of each balance sheet item and, when it transitions to false, either add it to a
    // bag or return it to a storage box based on where it was dropped.
    this.balanceSheetItems.forEach( balanceSheetItem => {
      balanceSheetItem.isDraggingProperty.lazyLink( isDragging => {
        if ( isDragging ) {

          // if the item was in one of the bags, remove it and update the net worth
          bags.forEach( bag => {
            if ( bag.containsItem( balanceSheetItem ) ) {
              bag.removeItem( balanceSheetItem );
            }
          } );
        }
        else {

          // The item was released by the user.  Add it to a bag or return it to the appropriate storage area.
          let addedToBag = false;
          bags.forEach( bag => {
            if ( bag.acceptsItem( balanceSheetItem ) && bag.isWithinCaptureRange( balanceSheetItem ) ) {
              bag.addItem( balanceSheetItem );
              addedToBag = true;
            }
          } );
          if ( !addedToBag ) {
            storageBoxes.forEach( storageBox => {
              if ( storageBox.holdsItem( balanceSheetItem ) ) {
                storageBox.returnItem( balanceSheetItem, true );
              }
            } );
          }
        }
        this.updateNetWorth();
      } );
    } );
  }

  updateNetWorth() {
    this.netWorthProperty.set( this.assetsBag.getTotalValue() + this.debtsBag.getTotalValue() );
  }

  /**
   * Resets the model.
   * @public
   */
  reset() {
    //TODO
  }

  /**
   * Steps the model.
   * @param {number} dt - time step, in seconds
   * @public
   */
  step( dt ) {
    //TODO
  }
}

numberLineOperations.register( 'NLONetWorthModel', NLONetWorthModel );
export default NLONetWorthModel;