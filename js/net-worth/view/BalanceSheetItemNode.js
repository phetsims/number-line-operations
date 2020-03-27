// Copyright 2020, University of Colorado Boulder

/**
 * BalanceSheetItemNode is the view representation of a BalanceSheetItem, which is the general term being used in this
 * sim for assets and debts.
 */

import Property from '../../../../axon/js/Property.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import DragListener from '../../../../scenery/js/listeners/DragListener.js';
import Image from '../../../../scenery/js/nodes/Image.js';
import numberLineOperations from '../../numberLineOperations.js';
import asset100Image from '../../../images/asset-100_png.js';
import asset200Image from '../../../images/asset-200_png.js';
import asset300Image from '../../../images/asset-300_png.js';
import asset400Image from '../../../images/asset-400_png.js';
import debt100Image from '../../../images/debt-100_png.js';
import debt200Image from '../../../images/debt-200_png.js';
import debt300Image from '../../../images/debt-300_png.js';
import debt400Image from '../../../images/debt-400_png.js';

//---------------------------------------------------------------------------------------------------------------------
// constants
//---------------------------------------------------------------------------------------------------------------------

// map of asset/debt values to the images that go with each (not using Map constructor because of lack of support in IE)
const MAP_OF_VALUES_TO_IMAGES = new Map();
MAP_OF_VALUES_TO_IMAGES.set( 100, asset100Image );
MAP_OF_VALUES_TO_IMAGES.set( 200, asset200Image );
MAP_OF_VALUES_TO_IMAGES.set( 300, asset300Image );
MAP_OF_VALUES_TO_IMAGES.set( 400, asset400Image );
MAP_OF_VALUES_TO_IMAGES.set( -100, debt100Image );
MAP_OF_VALUES_TO_IMAGES.set( -200, debt200Image );
MAP_OF_VALUES_TO_IMAGES.set( -300, debt300Image );
MAP_OF_VALUES_TO_IMAGES.set( -400, debt400Image );

class BalanceSheetItemNode extends Image {

  /**
   * @param {BalanceSheetItem} balanceSheetItem
   */
  constructor( balanceSheetItem ) {

    // get the image that is associated with this balance sheet item's value
    const image = MAP_OF_VALUES_TO_IMAGES.get( balanceSheetItem.value );
    assert( image, 'no image found for value ' + balanceSheetItem.value );

    super( image, {
      cursor: 'pointer',
      maxWidth: balanceSheetItem.width
    } );

    // Position this node based on the model element position.  Note that there is no model-view transform, since we are
    // using the same coordinate system in both the model and view.
    balanceSheetItem.positionProperty.link( position => {
      this.center = position;
    } );

    // prevent from being grabbed when animating
    balanceSheetItem.inProgressAnimationProperty.link( inProgressAnimation => {
      this.pickable = inProgressAnimation === null;
    } );

    // drag handler
    let dragOffset = Vector2.ZERO;
    this.addInputListener( new DragListener( {

      dragBoundsProperty: new Property( this.layoutBounds ),

      start: event => {
        balanceSheetItem.isDraggingProperty.value = true;
        const dragStartPoint = this.globalToParentPoint( event.pointer.point ); // point in parent frame
        dragOffset = balanceSheetItem.positionProperty.value.minus( dragStartPoint );
      },

      drag: event => {
        const dragPoint = this.globalToParentPoint( event.pointer.point );
        balanceSheetItem.teleportTo( dragPoint.plus( dragOffset ) );
      },

      end: () => {
        balanceSheetItem.isDraggingProperty.value = false;
      }
    } ) );
  }
}

numberLineOperations.register( 'BalanceSheetItemNode', BalanceSheetItemNode );
export default BalanceSheetItemNode;