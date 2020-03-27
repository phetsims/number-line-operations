// Copyright 2020, University of Colorado Boulder


/**
 * BalanceSheetItemBox is the area in the model where balance sheet items (assets and debts) hang out when not in use.
 * It is basically just a rectangular space that keeps track of where things go within it.
 */

import Bounds2 from '../../../../dot/js/Bounds2.js';
import Dimension2 from '../../../../dot/js/Dimension2.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import numberLineOperations from '../../numberLineOperations.js';

// constants
const DIMENSIONS = new Dimension2( 200, 300 );

class BalanceSheetItemBox {

  /**
   * @param {Vector2} position - position in model space of the rectangle's upper left corner
   * @param {BalanceSheetItem[]} items
   */
  constructor( position, items ) {

    // @public (read-only)
    this.rectangleBounds = new Bounds2( position.x, position.y, position.x + DIMENSIONS.width, position.y + DIMENSIONS.height );

    // map of items to storage positions, populated below
    this.mapOfItemsToStoragePositions = new Map();

    // position each of the balance sheet items and remember where each one goes when returned
    const interItemSpacing = DIMENSIONS.height / items.length;
    const yPositionOffset = interItemSpacing / 2;
    items.forEach( ( item, index ) => {
      item.teleportTo( new Vector2(
        this.rectangleBounds.centerX,
        this.rectangleBounds.minY + yPositionOffset + index * interItemSpacing
      ) );
      this.mapOfItemsToStoragePositions.set( item, item.positionProperty.value );
    } );
  }

  /**
   * return the provided item to its original location within this box
   * @param {BalanceSheetItem }item
   * @param {boolean} animate
   */
  returnItem( item, animate ) {

    const storagePosition = this.mapOfItemsToStoragePositions.get( item );
    assert( storagePosition, 'the provided item does not go in this box' );
    if ( animate ) {
      item.animateTo( storagePosition );
    }
    else {
      item.teleportTo( storagePosition );
    }
  }
}

numberLineOperations.register( 'BalanceSheetItemBox', BalanceSheetItemBox );
export default BalanceSheetItemBox;