// Copyright 2020, University of Colorado Boulder

/**
 * model for the "Chips" screen of the "Number Line: Operations" sim
 *
 * @author John Blanco
 */

import BooleanProperty from '../../../../axon/js/BooleanProperty.js';
import NumberProperty from '../../../../axon/js/NumberProperty.js';
import Dimension2 from '../../../../dot/js/Dimension2.js';
import Range from '../../../../dot/js/Range.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import Color from '../../../../scenery/js/util/Color.js';
import Operations from '../../common/model/Operations.js';
import OperationTrackingNumberLine from '../../common/model/OperationTrackingNumberLine.js';
import NLOConstants from '../../common/NLOConstants.js';
import numberLineOperations from '../../numberLineOperations.js';
import ValueItem from '../../common/model/ValueItem.js';
import HoldingBag from '../../common/model/HoldingBag.js';
import HoldingBox from '../../common/model/HoldingBox.js';

// constants
const NET_WORTH_RANGE = new Range( -1000, 1000 );
const HOLDING_BOX_SIZE = new Dimension2( 122, 300 ); // empirically determined to fit the items that will go in it

/**
 * @constructor
 */
class NLOChipsModel {

  /**
   * @param {Tandem} tandem
   */
  constructor( tandem ) {

    // @public (read-write) - total net worth, which is total assets minus total liabilities
    this.netWorthProperty = new NumberProperty( 0 );

    // @public (read-write)
    this.netWorthAccordionBoxExpandedProperty = new BooleanProperty( true, {
      tandem: tandem.createTandem( 'netWorthAccordionBoxExpandedProperty' )
    } );

    // @public (read-only) - the number line upon which the net worth and the various operation will be portrayed
    this.numberLine = new OperationTrackingNumberLine(
      NLOConstants.LAYOUT_BOUNDS.center.minusXY( 0, 110 ),
      {
        initialDisplayedRange: NET_WORTH_RANGE,
        tickMarksInitiallyVisible: true,
        preventOverlap: false,
        startingPointColor: new Color( 0x4ddff ),

        // width of the number line in model space, number empirically determined to match design
        widthInModelSpace: NLOConstants.NUMBER_LINE_WIDTH
      }
    );

    // convenience variable (note that there is only one operation shown on this number line)
    const operation = this.numberLine.operations[ 0 ];

    // @public (read-only) - list of balance sheet items (i.e. assets and debts) that the user can manipulate
    this.balanceSheetItems = [
      new ValueItem( -400 ),
      new ValueItem( -300 ),
      new ValueItem( -200 ),
      new ValueItem( -100 ),
      new ValueItem( 100 ),
      new ValueItem( 200 ),
      new ValueItem( 300 ),
      new ValueItem( 400 )
    ];

    // add the storage areas for the balance sheet items - this is where they reside when not in use
    const balanceItemBoxesTop = 310;
    this.debtsBox = new HoldingBox(
      new Vector2( 105, balanceItemBoxesTop ),
      HOLDING_BOX_SIZE,
      this.balanceSheetItems.filter( item => item.value < 0 ).sort( ( a, b ) => b.value - a.value )
    );
    this.assetsBox = new HoldingBox(
      new Vector2( 800, balanceItemBoxesTop ),
      HOLDING_BOX_SIZE,
      this.balanceSheetItems.filter( item => item.value > 0 ).sort()
    );
    this.storageBoxes = [ this.assetsBox, this.debtsBox ];

    // add the asset and debt bags
    const balanceItemBagsCenterY = 475;
    this.debtsBag = new HoldingBag( new Vector2( 380, balanceItemBagsCenterY ), {
      itemAcceptanceTest: HoldingBag.ACCEPT_ONLY_NEGATIVE_VALUES
    } );
    this.assetsBag = new HoldingBag( new Vector2( 645, balanceItemBagsCenterY ), {
      itemAcceptanceTest: HoldingBag.ACCEPT_ONLY_POSITIVE_VALUES
    } );
    this.bags = [ this.debtsBag, this.assetsBag ];

    // Monitor the isDragging state of each balance sheet item and, when it transitions to false, either add it to a
    // bag or return it to a storage box based on where it was dropped.
    this.balanceSheetItems.forEach( balanceSheetItem => {
      balanceSheetItem.isDraggingProperty.lazyLink( isDragging => {
        if ( isDragging ) {

          // if the item was in one of the bags, remove it
          this.bags.forEach( bag => {
            if ( bag.containsItem( balanceSheetItem ) ) {
              bag.removeItem( balanceSheetItem );

              // Update the operation on the number line to reflect this latest transaction.  Cycle the inactive state
              // to trigger the animation in the view.
              operation.isActiveProperty.set( false );
              this.numberLine.startingValueProperty.set( this.netWorthProperty.value );
              operation.operationTypeProperty.set( Operations.SUBTRACTION );
              operation.amountProperty.set( balanceSheetItem.value );
              operation.isActiveProperty.set( true );
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

              this.numberLine.startingValueProperty.set( this.netWorthProperty.value );

              // Update the operation.  The "active" state is cycled in order to trigger animation in the view.
              operation.isActiveProperty.set( false );
              operation.operationTypeProperty.set( Operations.ADDITION );
              operation.amountProperty.set( balanceSheetItem.value );
              operation.isActiveProperty.set( true );
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
        this.netWorthProperty.set( this.assetsBag.getTotalValue() + this.debtsBag.getTotalValue() );
      } );
    } );
  }

  /**
   * Resets the model.
   * @public
   */
  reset() {

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

    this.netWorthAccordionBoxExpandedProperty.reset();
    this.numberLine.reset();
    this.netWorthProperty.reset();
  }
}

// statics
NLOChipsModel.NET_WORTH_RANGE = NET_WORTH_RANGE;

numberLineOperations.register( 'NLOChipsModel', NLOChipsModel );
export default NLOChipsModel;