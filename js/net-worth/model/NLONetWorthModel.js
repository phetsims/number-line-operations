// Copyright 2020, University of Colorado Boulder

/**
 * @author John Blanco
 */

import BooleanProperty from '../../../../axon/js/BooleanProperty.js';
import NumberProperty from '../../../../axon/js/NumberProperty.js';
import Range from '../../../../dot/js/Range.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import NumberLinePoint from '../../../../number-line-common/js/common/model/NumberLinePoint.js';
import SpatializedNumberLine from '../../../../number-line-common/js/common/model/SpatializedNumberLine.js';
import Color from '../../../../scenery/js/util/Color.js';
import NLOConstants from '../../common/NLOConstants.js';
import numberLineOperations from '../../numberLineOperations.js';
import BalanceSheetItem from './BalanceSheetItem.js';
import BalanceSheetItemBag from './BalanceSheetItemBag.js';
import BalanceSheetItemBox from './BalanceSheetItemBox.js';

// constants
const NET_WORTH_RANGE = new Range( -1000, 1000 );

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

    // @public (read-write)
    this.operationLabelsVisibleProperty = new BooleanProperty( true, {
      tandem: tandem.createTandem( 'operationLabelsVisibleProperty' )
    } );

    // @public (read-write)
    this.operationDescriptionVisibleProperty = new BooleanProperty( true, {
      tandem: tandem.createTandem( 'operationDescriptionVisibleProperty' )
    } );

    // @public (read-write)
    this.netWorthAccordionBoxExpandedProperty = new BooleanProperty( true, {
      tandem: tandem.createTandem( 'netWorthAccordionBoxExpandedProperty' )
    } );

    // @public (read-only) - the number line upon which the net worth and the various operation will be portrayed
    this.numberLine = new SpatializedNumberLine( NLOConstants.LAYOUT_BOUNDS.center.plusXY( 0, -150 ), {
      initialDisplayedRange: NET_WORTH_RANGE,

      // width of the number line in model space, number empirically determined to make it look good
      widthInModelSpace: NLOConstants.LAYOUT_BOUNDS.width - 200
    } );

    // @public (read-only) - the point on the number line that corresponds to the current net worth
    this.netWorthPoint = new NumberLinePoint( this.netWorthProperty.value, Color.BLUE, this.numberLine );
    this.numberLine.addPoint( this.netWorthPoint );

    // update the net worth point's value as the net worth changes
    this.netWorthProperty.link( netWorth => {
      this.netWorthPoint.proposeValue( netWorth );
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
      new Vector2( 800, balanceItemBoxesTop ),
      this.balanceSheetItems.filter( item => item.value > 0 ).sort()
    );
    this.debtsBox = new BalanceSheetItemBox(
      new Vector2( 50, balanceItemBoxesTop ),
      this.balanceSheetItems.filter( item => item.value < 0 ).sort( ( a, b ) => b.value - a.value )
    );
    this.storageBoxes = [ this.assetsBox, this.debtsBox ];

    // add the asset and debt bags
    const balanceItemBagsCenterY = 460;
    this.debtsBag = new BalanceSheetItemBag( new Vector2( 360, balanceItemBagsCenterY ), {
      itemAcceptanceTest: BalanceSheetItemBag.ACCEPT_ONLY_DEBTS
    } );
    this.assetsBag = new BalanceSheetItemBag( new Vector2( 640, balanceItemBagsCenterY ), {
      itemAcceptanceTest: BalanceSheetItemBag.ACCEPT_ONLY_ASSETS
    } );
    this.bags = [ this.debtsBag, this.assetsBag ];

    // Monitor the isDragging state of each balance sheet item and, when it transitions to false, either add it to a
    // bag or return it to a storage box based on where it was dropped.
    this.balanceSheetItems.forEach( balanceSheetItem => {
      balanceSheetItem.isDraggingProperty.lazyLink( isDragging => {
        if ( isDragging ) {

          // if the item was in one of the bags, remove it and update the net worth
          this.bags.forEach( bag => {
            if ( bag.containsItem( balanceSheetItem ) ) {
              bag.removeItem( balanceSheetItem );
            }
          } );
        }
        else {

          // The item was released by the user.  Add it to a bag or return it to the appropriate storage area.
          let addedToBag = false;
          this.bags.forEach( bag => {
            if ( bag.acceptsItem( balanceSheetItem ) && bag.isWithinCaptureRange( balanceSheetItem ) ) {
              bag.addItem( balanceSheetItem );
              addedToBag = true;
            }
          } );
          if ( !addedToBag ) {
            this.storageBoxes.forEach( storageBox => {
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

    this.operationDescriptionVisibleProperty.reset();
    this.operationLabelsVisibleProperty.reset();
    this.netWorthAccordionBoxExpandedProperty.reset();
    this.numberLine.showTickMarksProperty.reset();

    // reset initial state of all balance sheet items
    this.balanceSheetItems.forEach( balanceSheetItem => {

      // see if this item is in a bag and remove it if so
      let itemRemovedFromBag = false;
      this.bags.forEach( bag => {
        if ( bag.containsItem( balanceSheetItem ) ) {
          bag.removeItem( balanceSheetItem );
          itemRemovedFromBag = true;
        }
      } );

      // if it was removed from a bag, add it back to its storage box
      if ( itemRemovedFromBag ) {
        this.storageBoxes.forEach( storageBox => {
          if ( storageBox.holdsItem( balanceSheetItem ) ) {
            storageBox.returnItem( balanceSheetItem, true );
          }
        } );
      }
    } );

    this.updateNetWorth();
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

// statics
NLONetWorthModel.NET_WORTH_RANGE = NET_WORTH_RANGE;

numberLineOperations.register( 'NLONetWorthModel', NLONetWorthModel );
export default NLONetWorthModel;