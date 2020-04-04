// Copyright 2020, University of Colorado Boulder

/**
 * NetWorthPiggyBankNode is a Scenery node that depicts a piggy bank that corresponds to a net worth value.  The
 * position, label, and fill of the piggy bank changes as the net worth value changes.
 */

import Vector2 from '../../../../dot/js/Vector2.js';
import StringUtils from '../../../../phetcommon/js/util/StringUtils.js';
import MathSymbols from '../../../../scenery-phet/js/MathSymbols.js';
import PhetFont from '../../../../scenery-phet/js/PhetFont.js';
import Node from '../../../../scenery/js/nodes/Node.js';
import Text from '../../../../scenery/js/nodes/Text.js';
import Color from '../../../../scenery/js/util/Color.js';
import PiggyBankDecoration from '../../../../number-line-common/js/explore/model/PiggyBankDecoration.js';
import PiggyBankNode from '../../../../number-line-common/js/explore/view/PiggyBankNode.js';
import numberLineOperations from '../../numberLineOperations.js';
import numberLineOperationsStrings from '../../numberLineOperationsStrings.js';

// constants
const ZERO_FILL = Color.WHITE;
const MOST_POSITIVE_FILL = Color.toColor( '#1fb493' );
const LEAST_POSITIVE_FILL = Color.toColor( '#a5e1d4' );
const MOST_NEGATIVE_FILL = Color.toColor( '#fb1d25' );
const LEAST_NEGATIVE_FILL = Color.toColor( '#fda5a8' );

class NetWorthPiggyBankNode extends Node {

  /**
   * @param {NumberProperty} netWorthProperty
   * @param {NumberLinePoint} netWorthPoint
   * @param {number} yPosition
   * @param {Range} range
   */
  constructor( netWorthProperty, netWorthPoint, yPosition, range ) {

    const piggyBankNode = new PiggyBankNode( {
      decorationType: PiggyBankDecoration.LIGHTNING,
      maxWidth: 90,
      centerY: yPosition,
      centerX: 100
    } );

    // label the represent the value
    const labelNode = new Text( '', {
      font: new PhetFont( 20 ),
      fill: 'white',
      stroke: 'black',
      center: Vector2.ZERO,
      maxWidth: 65
    } );

    super( { children: [ piggyBankNode, labelNode ] } );

    // update the fill and label as the net worth value changes
    netWorthProperty.link( netWorth => {
      labelNode.text = StringUtils.fillIn( numberLineOperationsStrings.monetaryValuePattern, {
        sign: netWorth < 0 ? MathSymbols.UNARY_MINUS : '',
        currencyUnits: numberLineOperationsStrings.currencyUnits,
        value: Math.abs( netWorth )
      } );
      labelNode.center = piggyBankNode.center;
      let piggyBankFill = ZERO_FILL;
      if ( netWorth < 0 ) {
        piggyBankFill = Color.interpolateRGBA(
          LEAST_NEGATIVE_FILL,
          MOST_NEGATIVE_FILL,
          netWorth / range.min
        );
      }
      else if ( netWorth > 0 ) {
        piggyBankFill = Color.interpolateRGBA(
          LEAST_POSITIVE_FILL,
          MOST_POSITIVE_FILL,
          netWorth / range.max
        );
      }
      piggyBankNode.fill = piggyBankFill;
    } );

    // update the position as the net worth point position changes
    netWorthPoint.valueProperty.link( () => {
      this.centerX = netWorthPoint.getPositionInModelSpace().x;
    } );

  }
}

numberLineOperations.register( 'NetWorthPiggyBankNode', NetWorthPiggyBankNode );
export default NetWorthPiggyBankNode;