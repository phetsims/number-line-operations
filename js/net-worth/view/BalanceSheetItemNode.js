// Copyright 2020, University of Colorado Boulder

/**
 * BalanceSheetItemNode is the view representation of a ValueItem, which is the general term being used in this
 * sim for assets and debts.
 */

import Property from '../../../../axon/js/Property.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import StringUtils from '../../../../phetcommon/js/util/StringUtils.js';
import PhetFont from '../../../../scenery-phet/js/PhetFont.js';
import DragListener from '../../../../scenery/js/listeners/DragListener.js';
import HBox from '../../../../scenery/js/nodes/HBox.js';
import Image from '../../../../scenery/js/nodes/Image.js';
import Node from '../../../../scenery/js/nodes/Node.js';
import Text from '../../../../scenery/js/nodes/Text.js';
import numberLineOperations from '../../numberLineOperations.js';
import asset100InBagImage from '../../../images/asset-100_png.js';
import asset100OutOfBagImage from '../../../images/asset-100-value_png.js';
import asset200InBagImage from '../../../images/asset-200_png.js';
import asset200OutOfBagImage from '../../../images/asset-200-value_png.js';
import asset300InBagImage from '../../../images/asset-300_png.js';
import asset300OutOfBagImage from '../../../images/asset-300-value_png.js';
import asset400InBagImage from '../../../images/asset-400_png.js';
import asset400OutOfBagImage from '../../../images/asset-400-value_png.js';
import debt100InBagImage from '../../../images/debt-100_png.js';
import debt100OutOfBagImage from '../../../images/debt-100-value_png.js';
import debt200InBagImage from '../../../images/debt-200_png.js';
import debt200OutOfBagImage from '../../../images/debt-200-value_png.js';
import debt300InBagImage from '../../../images/debt-300_png.js';
import debt300OutOfBagImage from '../../../images/debt-300-value_png.js';
import debt400InBagImage from '../../../images/debt-400_png.js';
import debt400OutOfBagImage from '../../../images/debt-400-value_png.js';
import numberLineOperationsStrings from '../../numberLineOperationsStrings.js';

//---------------------------------------------------------------------------------------------------------------------
// constants
//---------------------------------------------------------------------------------------------------------------------

// Create a map of asset/debt values to the images, sizes, and other information necessary to create the node for a
// particular value.  Note that the width is the only size provided, and the aspect ratio of the image ends up defining
// the height in the view.
const MAP_OF_VALUES_TO_IMAGE_INFO = new Map( [
  [
    100,
    {
      outOfBagImage: asset100OutOfBagImage,
      outOfBagWidth: 80,
      inBagImage: asset100InBagImage,
      inBagWidth: 50
    }
  ],
  [
    200,
    {
      outOfBagImage: asset200OutOfBagImage,
      outOfBagWidth: 85,
      outOfBagLabelOffset: new Vector2( 0, -3 ),
      inBagImage: asset200InBagImage,
      inBagWidth: 50
    }
  ],
  [
    300,
    {
      outOfBagImage: asset300OutOfBagImage,
      outOfBagWidth: 100,
      outOfBagLabelOffset: new Vector2( 0, 5 ),
      inBagImage: asset300InBagImage,
      inBagWidth: 50
    }
  ],
  [
    400,
    {
      outOfBagImage: asset400OutOfBagImage,
      outOfBagWidth: 50,
      outOfBagLabelOffset: new Vector2( 0, 7 ),
      inBagImage: asset400InBagImage,
      inBagWidth: 20
    }
  ],
  [
    -100,
    {
      outOfBagImage: debt100OutOfBagImage,
      outOfBagWidth: 65,
      outOfBagLabelOffset: new Vector2( 0, 2 ),
      inBagImage: debt100InBagImage,
      inBagWidth: 40
    }
  ],
  [
    -200,
    {
      outOfBagImage: debt200OutOfBagImage,
      outOfBagWidth: 70,
      outOfBagLabelOffset: new Vector2( 8, -2 ),
      inBagImage: debt200InBagImage,
      inBagWidth: 40
    }
  ],
  [
    -300,
    {
      outOfBagImage: debt300OutOfBagImage,
      outOfBagWidth: 65,
      inBagImage: debt300InBagImage,
      inBagWidth: 40
    }
  ],
  [
    -400,
    {
      outOfBagImage: debt400OutOfBagImage,
      outOfBagWidth: 70,
      outOfBagLabelOffset: new Vector2( 8, -2 ),
      inBagImage: debt400InBagImage,
      inBagWidth: 40
    }
  ]
] );

class BalanceSheetItemNode extends Node {

  /**
   * @param {ValueItem} balanceSheetItem
   */
  constructor( balanceSheetItem ) {

    // get the imageInfo that is associated with this balance sheet item's value
    const imageInfo = MAP_OF_VALUES_TO_IMAGE_INFO.get( balanceSheetItem.value );
    assert && assert( imageInfo, 'no imageInfo found for value ' + balanceSheetItem.value );

    // out-of-bag image - shown when the balance sheet item is not in a balance sheet item bag
    const outOfBagImageNode = new Image( imageInfo.outOfBagImage, {
      cursor: 'pointer',
      maxWidth: imageInfo.outOfBagWidth,
      center: Vector2.ZERO
    } );

    // in-bag image - shown when the balance sheet item is in a balance sheet item bag
    const inBagImageNode = new Image( imageInfo.inBagImage, {
      cursor: 'pointer',
      maxWidth: imageInfo.inBagWidth
    } );

    const outOfBagLabelNode = new Text(
      StringUtils.fillIn( numberLineOperationsStrings.monetaryValuePattern, {
        sign: '', // don't show minus sign for debts, since that would be a sort of double negative
        currencyUnits: numberLineOperationsStrings.currencyUnits,
        value: Math.abs( balanceSheetItem.value )
      } ),
      {
        font: new PhetFont( 18 ),
        center: imageInfo.outOfBagLabelOffset || Vector2.ZERO,
        maxWidth: outOfBagImageNode.width * 0.9
      }
    );
    const outOfBagRepresentationNode = new Node( { children: [ outOfBagImageNode, outOfBagLabelNode ] } );

    const inBagLabelNode = new Text(
      StringUtils.fillIn( numberLineOperationsStrings.monetaryValuePattern, {
        sign: '', // don't show minus sign for debts, since that would be a sort of double negative
        currencyUnits: numberLineOperationsStrings.currencyUnits,
        value: Math.abs( balanceSheetItem.value )
      } ),
      {
        font: new PhetFont( 20 ),
        maxWidth: 60
      }
    );

    // put the in-bag image under a parent node so that a label can be added if needed
    const inBagImageNodeParent = new Node( { children: [ inBagImageNode ] } );

    const inBagRepresentationNode = new HBox( {
      children: [ inBagImageNodeParent, inBagLabelNode ],
      spacing: 10,
      center: outOfBagImageNode.center
    } );

    // Special Case: There are two values that are loans, and the word "loan" appeared on the original artwork.  We
    // realized fairly late in the game that this word should be translatable, so the following code handles that case.
    // It's specific to the loan images, and is thus fairly fragile, but it was the most expedient way to handle the
    // situation.  If other labels are ever needed, this should be generalized instead of continuing to follow this
    // approach.
    if ( balanceSheetItem.value === -100 || balanceSheetItem.value === -300 ) {

      // out-of-bag representation
      const outOfBagTextLabelNode = new Text( numberLineOperationsStrings.loan, {
        font: new PhetFont( { size: 11, family: 'serif', style: 'italic' } ),
        centerX: 0,
        centerY: outOfBagImageNode.bottom - 15, // offset empirically determined
        maxWidth: outOfBagImageNode.width * 0.65
      } );
      outOfBagRepresentationNode.addChild( outOfBagTextLabelNode );

      // in-bag representation
      const inBagTextLabelNode = new Text( numberLineOperationsStrings.loan, {
        font: new PhetFont( { size: 8, family: 'serif', style: 'italic' } ),
        centerX: inBagImageNode.centerX,
        centerY: inBagImageNode.bottom - 8, // offset empirically determined
        maxWidth: inBagImageNode.width * 0.65
      } );
      inBagImageNodeParent.addChild( inBagTextLabelNode );
    }

    super( {
      children: [ outOfBagRepresentationNode, inBagRepresentationNode ],
      cursor: 'pointer'
    } );

    // prevent from being grabbed when animating
    balanceSheetItem.inProgressAnimationProperty.link( inProgressAnimation => {
      this.pickable = inProgressAnimation === null;
    } );

    // update the visibility of the representations based on whether this item is in a balance sheet item bag
    balanceSheetItem.inBagProperty.link( inBag => {
      outOfBagRepresentationNode.visible = !inBag;
      inBagRepresentationNode.visible = inBag;
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

    // Position this node based on the model element position.  Note that there is no model-view transform, since we are
    // using the same coordinate system in both the model and view.
    balanceSheetItem.positionProperty.link( position => {
      this.center = position;
    } );
  }
}

numberLineOperations.register( 'BalanceSheetItemNode', BalanceSheetItemNode );
export default BalanceSheetItemNode;