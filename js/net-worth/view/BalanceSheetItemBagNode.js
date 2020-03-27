// Copyright 2020, University of Colorado Boulder

/**
 * BalanceSheetItemBagNode is the view representation of a BalanceSheetItemBag, which is the place where assets and
 * debts are placed so that they count towards the total net worth tracked by the model.
 */

import Image from '../../../../scenery/js/nodes/Image.js';
import numberLineOperations from '../../numberLineOperations.js';
import assetsBagImage from '../../../images/assets-bag_png.js';
import debtsBagImage from '../../../images/debts-bag_png.js';
import BalanceSheetItemBag from '../model/BalanceSheetItemBag.js';

class BalanceSheetItemBagNode extends Image {

  /**
   * @param {BalanceSheetItemBag} balanceSheetItemBag
   */
  constructor( balanceSheetItemBag ) {

    // get the image that is associated with this bag's balance sheet type
    const image = balanceSheetItemBag.itemAcceptanceTest === BalanceSheetItemBag.ACCEPT_ONLY_DEBTS ?
                  debtsBagImage :
                  assetsBagImage;

    super( image, {
      minWidth: balanceSheetItemBag.radius * 2,
      maxWidth: balanceSheetItemBag.radius * 2,
      centerX: balanceSheetItemBag.position.x,

      // because the bag images have a sort of "tied off" area on top, position the bag based on the bottom
      bottom: balanceSheetItemBag.position.y + balanceSheetItemBag.radius
    } );
  }
}

numberLineOperations.register( 'BalanceSheetItemBagNode', BalanceSheetItemBagNode );
export default BalanceSheetItemBagNode;