// Copyright 2020, University of Colorado Boulder

/**
 * HoldingBagNode is the view representation of a HoldingBag, which is the place where items with value are placed so
 * that they count towards the total value tracked by the model.
 *
 * @author John Blanco (PhET Interactive Simulations)
 */

import BackgroundNode from '../../../../scenery-phet/js/BackgroundNode.js';
import PhetFont from '../../../../scenery-phet/js/PhetFont.js';
import Image from '../../../../scenery/js/nodes/Image.js';
import Node from '../../../../scenery/js/nodes/Node.js';
import Text from '../../../../scenery/js/nodes/Text.js';
import Color from '../../../../scenery/js/util/Color.js';
import positiveValueItemsBagImage from '../../../images/assets-bag_png.js';
import negativeValueItemsBagImage from '../../../images/debts-bag_png.js';
import numberLineOperations from '../../numberLineOperations.js';
import HoldingBag from '../model/HoldingBag.js';

class HoldingBagNode extends Node {

  /**
   * @param {HoldingBag} holdingBag
   * @param {string} labelText
   */
  constructor( holdingBag, labelText ) {

    // Get the image that is associated with this bag's supported values.
    const image = holdingBag.itemAcceptanceTest === HoldingBag.ACCEPT_ONLY_NEGATIVE_VALUES ?
                  negativeValueItemsBagImage :
                  positiveValueItemsBagImage;

    const imageNode = new Image( image, {
      minWidth: holdingBag.radius * 2,
      maxWidth: holdingBag.radius * 2,
      centerX: holdingBag.position.x,

      // Because the bag images have a sort of "tied off" area on top, position the bag based on the bottom.
      bottom: holdingBag.position.y + holdingBag.radius
    } );

    // label
    const labelNode = new BackgroundNode(
      new Text( labelText, {
        font: new PhetFont( 20 ),
        maxWidth: 100
      } ),
      {
        xMargin: 15,
        yMargin: 4,
        backgroundOptions: {
          opacity: 1,
          stroke: Color.BLACK,
          cornerRadius: 4
        }
      }
    );

    // Position the label.  This is a bit tweaky, and will need to change if the artwork does.
    if ( holdingBag.itemAcceptanceTest === HoldingBag.ACCEPT_ONLY_NEGATIVE_VALUES ) {
      labelNode.right = imageNode.centerX - 20;
      labelNode.centerY = imageNode.top + 3;
    }
    else {
      labelNode.left = imageNode.centerX + 22;
      labelNode.centerY = imageNode.top + 3;
    }

    super( { children: [ labelNode, imageNode ] } );
  }
}

numberLineOperations.register( 'HoldingBagNode', HoldingBagNode );
export default HoldingBagNode;