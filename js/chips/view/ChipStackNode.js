// Copyright 2020, University of Colorado Boulder

/**
 * ChipStackNode is the view representation of a ValueItem that is intended to look like a stack of game (e.g. poker)
 * chips, with the size of the stack being dependent upon the value of the item being represented.
 */

import Property from '../../../../axon/js/Property.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import PhetFont from '../../../../scenery-phet/js/PhetFont.js';
import DragListener from '../../../../scenery/js/listeners/DragListener.js';
import Circle from '../../../../scenery/js/nodes/Circle.js';
import Node from '../../../../scenery/js/nodes/Node.js';
import Text from '../../../../scenery/js/nodes/Text.js';
import Color from '../../../../scenery/js/util/Color.js';
import numberLineOperations from '../../numberLineOperations.js';

// constants
const CHIP_RADIUS = 23;
const STAGGER_VECTOR = new Vector2( 2, -2 );

class ChipStackNode extends Node {

  /**
   * @param {ValueItem} valueItem
   */
  constructor( valueItem ) {

    assert && assert(
    valueItem.value >= -5 && valueItem.value <= 5 && valueItem.value !== 0,
      'cannot represent item with value ' + valueItem.value
    );

    const chipFill = valueItem.value > 0 ? Color.YELLOW : Color.RED;
    const nextChipCenter = Vector2.ZERO.copy();
    const chips = [];

    _.times( Math.abs( valueItem.value ), () => {
      chips.push( new Circle( CHIP_RADIUS, {
        fill: chipFill,
        stroke: Color.BLACK,
        center: nextChipCenter
      } ) );
      nextChipCenter.add( STAGGER_VECTOR );
    } );

    // add the label to the top chip on the stack
    const signChar = valueItem.value > 0 ? '+' : '';
    const labelNode = new Text(
      signChar + valueItem.value,
      {
        font: new PhetFont( 22 ),
        center: Vector2.ZERO
      }
    );
    chips[ chips.length - 1 ].addChild( labelNode );

    super( {
      children: chips,
      cursor: 'pointer'
    } );

    // prevent from being grabbed when animating
    valueItem.inProgressAnimationProperty.link( inProgressAnimation => {
      this.pickable = inProgressAnimation === null;
    } );

    // drag handler
    let dragOffset = Vector2.ZERO;
    this.addInputListener( new DragListener( {

      dragBoundsProperty: new Property( this.layoutBounds ),

      start: event => {
        valueItem.isDraggingProperty.value = true;
        const dragStartPoint = this.globalToParentPoint( event.pointer.point ); // point in parent frame
        dragOffset = valueItem.positionProperty.value.minus( dragStartPoint );
        this.moveToFront(); // move to the front of the z-order in whatever layer this node is in
      },

      drag: event => {
        const dragPoint = this.globalToParentPoint( event.pointer.point );
        valueItem.teleportTo( dragPoint.plus( dragOffset ) );
      },

      end: () => {
        valueItem.isDraggingProperty.value = false;
      }
    } ) );

    // Position this node based on the model element position.  Note that there is no model-view transform, since we are
    // using the same coordinate system in both the model and view.
    valueItem.positionProperty.link( position => {
      this.center = position;
    } );
  }
}

numberLineOperations.register( 'ChipStackNode', ChipStackNode );
export default ChipStackNode;