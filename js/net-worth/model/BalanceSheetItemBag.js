// Copyright 2020, University of Colorado Boulder


/**
 * BalanceSheetItemBag is the area in the model where balance sheet items (assets and debts) can be added so that they
 * are factored in to the total net worth.
 */

import merge from '../../../../phet-core/js/merge.js';
import numberLineOperations from '../../numberLineOperations.js';

// constants
const RADIUS = 110;
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
    assert( this.itemAcceptanceTest( item ), 'this bag does not accept this type of balance sheet item' );
    assert( this.containedItemList.indexOf( item ) === -1, 'item is already in bag' );
    this.containedItemList.push( item );
    item.animateTo( this.position );
  }

  /**
   * remove an item from this bag
   * @param {BalanceSheetItem} item
   * @public
   */
  removeItem( item ) {
    assert( this.containedItemList.indexOf( item ) !== -1, 'item is not in bag' );
    this.containedItemList = _.without( this.containedItemList, item );
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
}

BalanceSheetItemBag.ACCEPT_ONLY_ASSETS = ACCEPT_ONLY_ASSETS;
BalanceSheetItemBag.ACCEPT_ONLY_DEBTS = ACCEPT_ONLY_DEBTS;

numberLineOperations.register( 'BalanceSheetItemBag', BalanceSheetItemBag );
export default BalanceSheetItemBag;