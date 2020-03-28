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

// Create a map of asset/debt values to the images and their sizes that go with each (not using Map constructor because
// of lack of support in IE).  The width is the only size provided, and the aspect ratio of the image ends up defining
// the height in the view.
const MAP_OF_VALUES_TO_IMAGE_INFO = new Map(); // Map<key:<number>,value:<{image:{imageInfo},width:{number}}>
MAP_OF_VALUES_TO_IMAGE_INFO.set( 100, { image: asset100Image, width: 70 } );
MAP_OF_VALUES_TO_IMAGE_INFO.set( 200, { image: asset200Image, width: 80 } );
MAP_OF_VALUES_TO_IMAGE_INFO.set( 300, { image: asset300Image, width: 70 } );
MAP_OF_VALUES_TO_IMAGE_INFO.set( 400, { image: asset400Image, width: 40 } );
MAP_OF_VALUES_TO_IMAGE_INFO.set( -100, { image: debt100Image, width: 60 } );
MAP_OF_VALUES_TO_IMAGE_INFO.set( -200, { image: debt200Image, width: 60 } );
MAP_OF_VALUES_TO_IMAGE_INFO.set( -300, { image: debt300Image, width: 60 } );
MAP_OF_VALUES_TO_IMAGE_INFO.set( -400, { image: debt400Image, width: 60 } );

class BalanceSheetItemNode extends Image {

  /**
   * @param {BalanceSheetItem} balanceSheetItem
   */
  constructor( balanceSheetItem ) {

    // get the imageInfo that is associated with this balance sheet item's value
    const imageInfo = MAP_OF_VALUES_TO_IMAGE_INFO.get( balanceSheetItem.value );
    assert( imageInfo, 'no imageInfo found for value ' + balanceSheetItem.value );

    super( imageInfo.image, {
      cursor: 'pointer',
      maxWidth: imageInfo.width
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
        this.moveToFront(); // move to the front of the z-order in whatever layer this node is in
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