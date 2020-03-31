// Copyright 2020, University of Colorado Boulder

/**
 * BalanceSheetItemBagNode is the view representation of a BalanceSheetItemBag, which is the place where assets and
 * debts are placed so that they count towards the total net worth tracked by the model.
 */

import PhetFont from '../../../../scenery-phet/js/PhetFont.js';
import Image from '../../../../scenery/js/nodes/Image.js';
import Node from '../../../../scenery/js/nodes/Node.js';
import Text from '../../../../scenery/js/nodes/Text.js';
import numberLineOperationsStrings from '../../numberLineOperationsStrings.js';
import numberLineOperations from '../../numberLineOperations.js';
import assetsBagImage from '../../../images/assets-bag_png.js';
import debtsBagImage from '../../../images/debts-bag_png.js';
import BalanceSheetItemBag from '../model/BalanceSheetItemBag.js';

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
    const labelNode = new Text( labelText, {
      font: new PhetFont( 20 ),
      centerX: balanceSheetItemBag.position.x,
      centerY: balanceSheetItemBag.position.y - 0.5 * balanceSheetItemBag.radius // tweaked for the bag image being used
    } );

    super( { children: [ imageNode, labelNode ] } );
  }
}

numberLineOperations.register( 'BalanceSheetItemBagNode', BalanceSheetItemBagNode );
export default BalanceSheetItemBagNode;