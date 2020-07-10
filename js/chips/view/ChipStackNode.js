// Copyright 2020, University of Colorado Boulder

/**
 * ChipStackNode is the view representation of a ValueItem that is intended to look like a stack of game (e.g. poker)
 * chips, with the size of the stack being dependent upon the value of the item being represented.
 */

import Property from '../../../../axon/js/Property.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import Shape from '../../../../kite/js/Shape.js';
import PhetFont from '../../../../scenery-phet/js/PhetFont.js';
import DragListener from '../../../../scenery/js/listeners/DragListener.js';
import Circle from '../../../../scenery/js/nodes/Circle.js';
import Node from '../../../../scenery/js/nodes/Node.js';
import Path from '../../../../scenery/js/nodes/Path.js';
import Text from '../../../../scenery/js/nodes/Text.js';
import Color from '../../../../scenery/js/util/Color.js';
import LinearGradient from '../../../../scenery/js/util/LinearGradient.js';
import numberLineOperations from '../../numberLineOperations.js';

// constants
const CHIP_RADIUS = 23;
const STACKING_STAGGER_AMOUNT = new Vector2( 2, -2 );
const SHADOW_OFFSET = new Vector2( 5, 5 );

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

    // add the layer where the chips will reside
    const chipsLayer = new Node();

    // create a shape that will be used to create the shadow
    let shadowShape = null;

    // create the chips and their shadows and add them to their respective layers
    let topChip = null;
    _.times( Math.abs( valueItem.value ), () => {
      const chip = new Circle( CHIP_RADIUS, {
        fill: chipFill,
        stroke: Color.BLACK,
        center: nextChipCenter
      } );
      chipsLayer.addChild( chip );
      topChip = chip;

      // Add the next portions of the shadow shape.
      if ( shadowShape ) {
        shadowShape = shadowShape.shapeUnion( Shape.circle( nextChipCenter.x, nextChipCenter.y, CHIP_RADIUS ) );
      }
      else {
        shadowShape = Shape.circle( nextChipCenter.x, nextChipCenter.y, CHIP_RADIUS );
      }

      // Adjust the
      nextChipCenter.add( STACKING_STAGGER_AMOUNT );
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
    topChip.addChild( labelNode );

    // Create the shadow from the shape.
    const vectorToShadowEdge = SHADOW_OFFSET.copy().setMagnitude( CHIP_RADIUS );
    const shadowNode = new Path( shadowShape, {
      fill: new LinearGradient( shadowShape.bounds.centerX, shadowShape.bounds.centerY, vectorToShadowEdge.x, vectorToShadowEdge.y )
        .addColorStop( 0.5, new Color( 20, 20, 20, 0.4 ) )
        .addColorStop( 1, new Color( 80, 80, 80, 0.2 ) )
    } );

    super( {
      children: [ shadowNode, chipsLayer ],
      cursor: 'pointer'
    } );

    // Move the shadow into position and make it visible when this item is being dragged.
    valueItem.isDraggingProperty.link( isDragging => {
      shadowNode.visible = isDragging;
      if ( isDragging ) {
        shadowNode.translation = SHADOW_OFFSET;
      }
      else {
        shadowNode.translation = Vector2.ZERO;
      }
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