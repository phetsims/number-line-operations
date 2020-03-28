// Copyright 2020, University of Colorado Boulder


/**
 * BalanceSheetItemBag is the area in the model where balance sheet items (assets and debts) can be added so that they
 * are factored in to the total net worth.
 */

import Vector2 from '../../../../dot/js/Vector2.js';
import merge from '../../../../phet-core/js/merge.js';
import numberLineOperations from '../../numberLineOperations.js';

// constants
const RADIUS = 120;
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
    this.positionContainedItems();
  }

  /**
   * remove an item from this bag
   * @param {BalanceSheetItem} item
   * @public
   */
  removeItem( item ) {
    assert( this.containedItemList.indexOf( item ) !== -1, 'item is not in bag' );
    this.containedItemList = _.without( this.containedItemList, item );
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
   * Position the items that are in this bag, spreading some out so that they don't overlap too much.  This method it
   * optimized to work with the image artwork for this sim, and may need to be adjusted if that artwork changes.
   * @private
   */
  positionContainedItems() {

    if ( this.containedItemList.length === 1 ) {
      this.containedItemList[ 0 ].animateTo( this.position.plusXY( 0, this.radius / 3 ) );
    }
    else {

      // visually, the center point where items look best is a little below the model center position
      const centerForPositioning = this.position.plusXY( 0, this.radius * 0.22 );
      const distanceFromCenter = this.radius * 0.4; // empirically chosen
      const angleBetweenItems = 2 * Math.PI / this.containedItemList.length;
      let vectorFromCenter = new Vector2( distanceFromCenter, 0 );
      this.containedItemList.forEach( balanceSheetItem => {
        balanceSheetItem.animateTo( centerForPositioning.plus( vectorFromCenter ) );
        vectorFromCenter = vectorFromCenter.rotated( angleBetweenItems );
      } );
    }
  }
}

BalanceSheetItemBag.ACCEPT_ONLY_ASSETS = ACCEPT_ONLY_ASSETS;
BalanceSheetItemBag.ACCEPT_ONLY_DEBTS = ACCEPT_ONLY_DEBTS;

numberLineOperations.register( 'BalanceSheetItemBag', BalanceSheetItemBag );
export default BalanceSheetItemBag;