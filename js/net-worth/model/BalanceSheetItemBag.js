// Copyright 2020, University of Colorado Boulder


/**
 * BalanceSheetItemBag is the area in the model where balance sheet items (assets and debts) can be added so that they
 * are factored in to the total net worth.
 */

import Vector2 from '../../../../dot/js/Vector2.js';
import merge from '../../../../phet-core/js/merge.js';
import numberLineOperations from '../../numberLineOperations.js';

// constants
const RADIUS = 125;
const ACCEPT_EVERYTHING = () => true;
const ACCEPT_ONLY_ASSETS = balanceSheetItem => balanceSheetItem.value > 0;
const ACCEPT_ONLY_DEBTS = balanceSheetItem => balanceSheetItem.value < 0;

class BalanceSheetItemBag {

  /**
   * @param {Vector2} position - position in model space of the center of the circular storage area
   * @param {Object} [options]
   */
  constructor( position, options ) {

    options = merge( {
      itemAcceptanceTest: ACCEPT_EVERYTHING
    }, options );

    // @public (read-only)
    this.position = position;

    // @public (read-only)
    this.radius = RADIUS;

    // @public (read-only) - balance sheet items that are currently in this bag, use methods to access
    this.containedItemList = [];

    // @private
    this.itemAcceptanceTest = options.itemAcceptanceTest;
  }

  /**
   * test if this bag accepts this type of item
   * @param {BalanceSheetItem }item
   * @public
   */
  acceptsItem( item ) {
    return this.itemAcceptanceTest( item );
  }

  /**
   * add this balance sheet item to this bag
   * @param {BalanceSheetItem} item
   * @public
   */
  addItem( item ) {
    assert && assert( this.itemAcceptanceTest( item ), 'this bag does not accept this type of balance sheet item' );
    assert && assert( this.containedItemList.indexOf( item ) === -1, 'item is already in bag' );
    this.containedItemList.push( item );
    item.inBagProperty.set( true );
    this.positionContainedItems();
  }

  /**
   * remove an item from this bag
   * @param {BalanceSheetItem} item
   * @public
   */
  removeItem( item ) {
    assert && assert( this.containedItemList.indexOf( item ) !== -1, 'item is not in bag' );
    this.containedItemList = _.without( this.containedItemList, item );
    item.inBagProperty.set( false );
    this.positionContainedItems();
  }

  /**
   * @param {BalanceSheetItem} item
   * @returns {boolean}
   * @public
   */
  containsItem( item ) {
    return this.containedItemList.indexOf( item ) !== -1;
  }

  /**
   * @returns {number} - total value of the assets/debts currently in this bag
   * @public
   */
  getTotalValue() {
    return this.containedItemList.reduce( ( total, item ) => total + item.value, 0 );
  }

  /**
   * @param {BalanceSheetItem} item
   * @returns {boolean}
   */
  isWithinCaptureRange( item ) {
    return item.positionProperty.value.distance( this.position ) <= this.radius;
  }

  /**
   * Position the items that are in this bag.  This method is optimized to work with the image artwork for this sim and
   * makes assumptions about how many items can be added, it will need to be adjusted if any of this changes.
   * @private
   */
  positionContainedItems() {
    assert && assert( this.containedItemList.length <= 4, 'too many items in bag' );
    this.containedItemList.forEach( ( item, index ) => {
      const xPosition = this.position.x;
      const yPosition = this.position.y - ( this.radius * 0.2 ) + index * this.radius * 0.3;
      item.animateTo( new Vector2( xPosition, yPosition ) );
    } );
  }
}

BalanceSheetItemBag.ACCEPT_ONLY_ASSETS = ACCEPT_ONLY_ASSETS;
BalanceSheetItemBag.ACCEPT_ONLY_DEBTS = ACCEPT_ONLY_DEBTS;

numberLineOperations.register( 'BalanceSheetItemBag', BalanceSheetItemBag );
export default BalanceSheetItemBag;