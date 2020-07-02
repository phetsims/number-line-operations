// Copyright 2020, University of Colorado Boulder

/**
 * BalanceSheetItemBoxNode is the view representation of a box (i.e. a rectangle) where ValueItem instances are
 * stored when not in use.
 */

import Rectangle from '../../../../scenery/js/nodes/Rectangle.js';
import numberLineOperations from '../../numberLineOperations.js';

// constants
const CORNER_RADIUS = 7;

class BalanceSheetItemBoxNode extends Rectangle {

  /**
   * @param {HoldingBox} balanceSheetItemBox - model of the storage box
   */
  constructor( balanceSheetItemBox ) {

    super(
      balanceSheetItemBox.rectangleBounds.minX,
      balanceSheetItemBox.rectangleBounds.minY,
      balanceSheetItemBox.rectangleBounds.width,
      balanceSheetItemBox.rectangleBounds.height,
      CORNER_RADIUS,
      CORNER_RADIUS,
      {
        fill: 'white',
        stroke: 'black'
      }
    );
  }
}

numberLineOperations.register( 'BalanceSheetItemBoxNode', BalanceSheetItemBoxNode );
export default BalanceSheetItemBoxNode;