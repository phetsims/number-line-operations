// Copyright 2020, University of Colorado Boulder

/**
 * TotalValueIndicatorNode is a Scenery node that takes a background node and shows a total value over it, and fills
 * the total value node with different colors based on the total value.
 */

import Vector2 from '../../../../dot/js/Vector2.js';
import merge from '../../../../phet-core/js/merge.js';
import StringUtils from '../../../../phetcommon/js/util/StringUtils.js';
import MathSymbols from '../../../../scenery-phet/js/MathSymbols.js';
import PhetFont from '../../../../scenery-phet/js/PhetFont.js';
import Node from '../../../../scenery/js/nodes/Node.js';
import Text from '../../../../scenery/js/nodes/Text.js';
import Color from '../../../../scenery/js/util/Color.js';
import numberLineOperations from '../../numberLineOperations.js';
import numberLineOperationsStrings from '../../numberLineOperationsStrings.js';

// constants
const ZERO_FILL = Color.WHITE;
const MOST_POSITIVE_FILL = Color.toColor( '#1fb493' );
const LEAST_POSITIVE_FILL = Color.toColor( '#a5e1d4' );
const MOST_NEGATIVE_FILL = Color.toColor( '#fb1d25' );
const LEAST_NEGATIVE_FILL = Color.toColor( '#fda5a8' );

class TotalValueIndicatorNode extends Node {

  /**
   * @param {NumberProperty} totalValueProperty
   * @param {Node} fillableBackgroundNode - the node that will serve as the background to the value, must support setting fill
   * @param {Range} range
   * @param {Object} [options]
   */
  constructor( totalValueProperty, fillableBackgroundNode, range, options ) {

    options = merge( {

      // {Vector2} - offset of the label from the center of the background node
      labelCenterOffset: Vector2.ZERO,

      // {boolean} - if false, just shows the number, if true, uses a currency symbol and pattern
      isCurrency: false

    }, options );

    // label the represent the value
    const labelNode = new Text( '', {
      font: new PhetFont( 20 ),
      fill: 'white',
      stroke: 'black',
      center: Vector2.ZERO,
      maxWidth: 65
    } );

    super( merge( { children: [ fillableBackgroundNode, labelNode ] }, options ) );

    // update the fill and label as the total value changes
    totalValueProperty.link( totalValue => {

      // update value
      if ( options.isCurrency ) {
        labelNode.text = StringUtils.fillIn( numberLineOperationsStrings.monetaryValuePattern, {
          sign: totalValue < 0 ? MathSymbols.MINUS : '',
          currencyUnits: numberLineOperationsStrings.currencyUnits,
          value: Math.abs( totalValue )
        } );
      }
      else {
        labelNode.text = totalValue;
      }

      // reposition the label
      labelNode.center = fillableBackgroundNode.center.plus( options.labelCenterOffset );

      // set the fill
      let fill = ZERO_FILL;
      if ( totalValue < 0 ) {
        fill = Color.interpolateRGBA(
          LEAST_NEGATIVE_FILL,
          MOST_NEGATIVE_FILL,
          totalValue / range.min
        );
      }
      else if ( totalValue > 0 ) {
        fill = Color.interpolateRGBA(
          LEAST_POSITIVE_FILL,
          MOST_POSITIVE_FILL,
          totalValue / range.max
        );
      }
      fillableBackgroundNode.fill = fill;
    } );
  }
}

numberLineOperations.register( 'TotalValueIndicatorNode', TotalValueIndicatorNode );
export default TotalValueIndicatorNode;