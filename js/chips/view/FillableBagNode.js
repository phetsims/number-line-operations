// Copyright 2020, University of Colorado Boulder

/**
 * a node that represents a bag and that can be filled with different colors
 *
 * @author John Blanco (PhET Interactive Simulations)
 */

import Vector2 from '../../../../dot/js/Vector2.js';
import Shape from '../../../../kite/js/Shape.js';
import merge from '../../../../phet-core/js/merge.js';
import Image from '../../../../scenery/js/nodes/Image.js';
import Node from '../../../../scenery/js/nodes/Node.js';
import Path from '../../../../scenery/js/nodes/Path.js';
import numberLineCommon from '../../numberLineOperations.js';
import bagForeground from '../../../images/nl-bag-foreground_png.js';

// constants
const BAG_OUTLINE_SVG_STRING = 'M367.541,188.392c0,0,47.98-77.735,37.31-89.527\n' +
                               '\tc-5.488-6.056-29.624-11.908-34.646-14.135c-4.862-2.14-41.911-7.061-69.322-7.061c-24.122,0-62.844,7.992-63.994,14.121\n' +
                               '\tc-2.664,14.135,13.334,77.75,10.67,101.304c0,0-87.984,42.405-146.649,110.722S-3.072,482.855,2.256,546.456\n' +
                               '\ts31.997,141.351,101.318,155.485c69.321,14.136,327.959,21.195,423.95-7.074c0,0,18.662-2.358,29.333-21.195\n' +
                               '\tc10.67-18.852,53.323-70.676,53.323-171.979S551.515,282.621,367.541,188.392z';

const BAG_OUTLINE_SHAPE = new Shape( BAG_OUTLINE_SVG_STRING );

class FillableBagNode extends Node {

  /**
   * @param {Object} [options]
   * @public
   */
  constructor( options ) {

    options = merge( {
      fill: 'rgba( 0, 0, 0, 0 )', // initially transparent so that it is invisible but has size
      lineWidth: 0
    }, options );

    const bagOutlineNode = new Path( BAG_OUTLINE_SHAPE, {
      fill: options.fill,
      lineWidth: options.lineWidth,
      center: Vector2.ZERO
    } );
    const overlayImage = new Image( bagForeground, { opacity: 0.9 } );
    overlayImage.setScaleMagnitude( bagOutlineNode.width / overlayImage.width );
    overlayImage.center = Vector2.ZERO;
    options.children = [ bagOutlineNode, overlayImage ];
    super( options );

    // @private
    this.outline = bagOutlineNode;
  }

  /**
   * @returns {ColorDef} the color of this piggy bank's fill
   * @public
   */
  getFill() {
    return this.outline.fill;
  }

  get fill() { return this.getFill(); }

  /**
   * @param {ColorDef} fill
   * @public
   */
  setFill( fill ) {
    this.outline.fill = fill;
  }

  set fill( fill ) { this.setFill( fill ); }
}

numberLineCommon.register( 'FillableBagNode', FillableBagNode );
export default FillableBagNode;