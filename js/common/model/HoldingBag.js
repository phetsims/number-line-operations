// Copyright 2020, University of Colorado Boulder


/**
 * HoldingBag is the area in the model where items that have value can be held.  Vague, I admit, but that's what it is.
 *
 * @author John Blanco (PhET Interactive Simulations)
 */

import Vector2 from '../../../../dot/js/Vector2.js';
import merge from '../../../../phet-core/js/merge.js';
import numberLineOperations from '../../numberLineOperations.js';
import Utils from '../../../../dot/js/Utils.js';

// constants
const RADIUS = 125;

// stock item acceptance tests
const ACCEPT_EVERYTHING = () => true;
const ACCEPT_ONLY_POSITIVE_VALUES = valueItem => valueItem.value > 0;
const ACCEPT_ONLY_NEGATIVE_VALUES = valueItem => valueItem.value < 0;

class HoldingBag {

  /**
   * @param {Vector2} position - position in model space of the center of the circular storage area
   * @param {Object} [options]
   */
  constructor( position, options ) {

    options = merge( {

      // @function - a predicate that defines what sort of items this can hold
      itemAcceptanceTest: ACCEPT_EVERYTHING,

      // @number - the maximum number of items that this bag can hold
      capacity: 4

    }, options );

    // @public (read-only)
    this.position = position;

    // @public (read-only)
    this.radius = RADIUS;

    // @public (read-only) - value items that are currently in this bag, use methods to access
    this.containedItemList = [];

    // @private
    this.itemAcceptanceTest = options.itemAcceptanceTest;
    this.capacity = options.capacity;
  }

  /**
   * test if this bag accepts this type of item
   * @param {ValueItem }item
   * @public
   */
  acceptsItem( item ) {
    return this.itemAcceptanceTest( item );
  }

  /**
   * add the provide item to this bag
   * @param {ValueItem} item
   * @public
   */
  addItem( item ) {
    assert && assert( this.itemAcceptanceTest( item ), 'this bag does not accept this type of item' );
    assert && assert( this.containedItemList.indexOf( item ) === -1, 'item is already in bag' );
    assert && assert( this.containedItemList.length < this.capacity, 'there is insufficient space in bag for this item' );
    this.containedItemList.push( item );
    item.inBagProperty.set( true );
    this.positionContainedItems();
  }

  /**
   * remove an item from this bag
   * @param {ValueItem} item
   * @public
   */
  removeItem( item ) {
    assert && assert( this.containedItemList.indexOf( item ) !== -1, 'item is not in bag' );
    this.containedItemList = _.without( this.containedItemList, item );
    item.inBagProperty.set( false );
    this.positionContainedItems();
  }

  /**
   * @param {ValueItem} item
   * @returns {boolean}
   * @public
   */
  containsItem( item ) {
    return this.containedItemList.indexOf( item ) !== -1;
  }

  /**
   * @returns {number} - total value of the items currently in this bag
   * @public
   */
  getTotalValue() {
    return this.containedItemList.reduce( ( total, item ) => total + item.value, 0 );
  }

  /**
   * Test whether a value item is within the "capture range" of this bag.
   * @param {ValueItem} item
   * @returns {boolean}
   * @public
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
    assert && assert( this.containedItemList.length <= this.capacity, 'too many items in bag' );
    assert && assert( this.capacity >= 4 && this.capacity <= 5, 'unable to position for this bag\'s capacity' );
    if ( this.capacity === 4 ) {

      // position items in a vertical stack
      this.containedItemList.forEach( ( item, index ) => {
        const xPosition = this.position.x;
        const yPosition = this.position.y - ( this.radius * 0.2 ) + index * this.radius * 0.3;
        item.animateTo( new Vector2( xPosition, yPosition ) );
      } );
    }
    else if ( this.capacity === 5 ) {

      // position items with one centered at the top and the remaining four in a grid pattern
      this.containedItemList.forEach( ( item, index ) => {
        let xPosition;
        let yPosition;
        if ( index === 0 ) {
          xPosition = this.position.x;
          yPosition = this.position.y - ( this.radius * 0.35 );
        }
        else {
          xPosition = this.position.x + ( index % 2 ? -1 : 1 ) * this.radius * 0.35;
          yPosition = this.position.y + Utils.sign( index - 2.5 ) * this.radius * 0.25 + this.radius * 0.25;
        }
        item.animateTo( new Vector2( xPosition, yPosition ) );
      } );
    }
  }
}

HoldingBag.ACCEPT_ONLY_POSITIVE_VALUES = ACCEPT_ONLY_POSITIVE_VALUES;
HoldingBag.ACCEPT_ONLY_NEGATIVE_VALUES = ACCEPT_ONLY_NEGATIVE_VALUES;

numberLineOperations.register( 'HoldingBag', HoldingBag );
export default HoldingBag;