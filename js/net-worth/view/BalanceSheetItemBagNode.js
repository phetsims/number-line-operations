// Copyright 2020, University of Colorado Boulder

/**
 * BalanceSheetItemBagNode is the view representation of a BalanceSheetItemBag, which is the place where assets and
 * debts are placed so that they count towards the total net worth tracked by the model.
 */

import BackgroundNode from '../../../../scenery-phet/js/BackgroundNode.js';
import PhetFont from '../../../../scenery-phet/js/PhetFont.js';
import Image from '../../../../scenery/js/nodes/Image.js';
import Node from '../../../../scenery/js/nodes/Node.js';
import Text from '../../../../scenery/js/nodes/Text.js';
import numberLineOperationsStrings from '../../numberLineOperationsStrings.js';
import numberLineOperations from '../../numberLineOperations.js';
import assetsBagImage from '../../../images/assets-bag_png.js';
import debtsBagImage from '../../../images/debts-bag_png.js';
import BalanceSheetItemBag from '../model/BalanceSheetItemBag.js';
import Color from '../../../../scenery/js/util/Color.js';

class BalanceSheetItemBagNode extends Node {

  /**
   * @param {BalanceSheetItemBag} balanceSheetItemBag
   */
  constructor( balanceSheetItemBag ) {

    // get the image that is associated with this bag's balance sheet type
    const image = balanceSheetItemBag.itemAcceptanceTest === BalanceSheetItemBag.ACCEPT_ONLY_DEBTS ?
                  debtsBagImage :
                  assetsBagImage;

    const imageNode = new Image( image, {
      minWidth: balanceSheetItemBag.radius * 2,
      maxWidth: balanceSheetItemBag.radius * 2,
      centerX: balanceSheetItemBag.position.x,

      // because the bag images have a sort of "tied off" area on top, position the bag based on the bottom
      bottom: balanceSheetItemBag.position.y + balanceSheetItemBag.radius
    } );

    // label
    const labelText = balanceSheetItemBag.itemAcceptanceTest === BalanceSheetItemBag.ACCEPT_ONLY_DEBTS ?
                      numberLineOperationsStrings.debts :
                      numberLineOperationsStrings.assets;
    const labelNode = new BackgroundNode( new Text( labelText, { font: new PhetFont( 20 ) } ), {
      xMargin: 15,
      yMargin: 8,
      backgroundOptions: {
        opacity: 1,
        stroke: Color.BLACK,
        cornerRadius: 5
      }
    } );

    // Position the label.  This is a bit tweaky, and will need to change if the artwork does.
    if ( balanceSheetItemBag.itemAcceptanceTest === BalanceSheetItemBag.ACCEPT_ONLY_DEBTS ) {
      labelNode.right = imageNode.centerX - 20;
      labelNode.centerY = imageNode.top - 4;
    }
    else {
      labelNode.left = imageNode.centerX + 22;
      labelNode.centerY = imageNode.top - 5;
    }

    super( { children: [ labelNode, imageNode ] } );
  }
}

numberLineOperations.register( 'BalanceSheetItemBagNode', BalanceSheetItemBagNode );
export default BalanceSheetItemBagNode;