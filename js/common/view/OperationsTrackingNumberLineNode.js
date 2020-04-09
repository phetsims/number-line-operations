// Copyright 2020, University of Colorado Boulder

/**
 * OperationsTrackingNumberLineNode is a specialization of SpatializedNumberLineNode that adds the ability to depict
 * labeled operations that have occurred between the points on the number line.
 */

import Matrix3 from '../../../../dot/js/Matrix3.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import Shape from '../../../../kite/js/Shape.js';
import SpatializedNumberLineNode from '../../../../number-line-common/js/common/view/SpatializedNumberLineNode.js';
import merge from '../../../../phet-core/js/merge.js';
import Node from '../../../../scenery/js/nodes/Node.js';
import Path from '../../../../scenery/js/nodes/Path.js';
import numberLineOperations from '../../numberLineOperations.js';

//---------------------------------------------------------------------------------------------------------------------
// constants
//---------------------------------------------------------------------------------------------------------------------

// an unscaled version of the arrowhead shape, pointing straight up, tip at 0,0, length normalized to 1
const NORMALIZED_ARROWHEAD_SHAPE = new Shape()
  .moveTo( 0, 0 ) // TODO - is this needed?
  .lineTo( -0.4, 1.14 )
  .lineTo( 0, 1 )
  .lineTo( 0.4, 1.14 )
  .lineTo( 0, 0 );

const ARROWHEAD_LENGTH = 15; // in screen coordinates, empirically chosen

class OperationsTrackingNumberLineNode extends SpatializedNumberLineNode {

  /**
   * {OperationTrackingNumberLine} numberLine - model of a number line
   * {Object} [options] - options that control the appearance of the number line
   * @public
   */
  constructor( numberLine, options ) {

    super( numberLine, options );

    const mapOfOperationsToOperationNodes = new Map();

    numberLine.operationsList.addItemAddedListener( addedOperation => {
      const operationArrowNode = new OperationArrowNode(
        addedOperation,
        numberLine.showOperationLabelsProperty,
        numberLine.showOperationDescriptionsProperty,
        numberLine
      );
      this.addChild( operationArrowNode );
      mapOfOperationsToOperationNodes.set( addedOperation, operationArrowNode );

      // put the arrow node at the back of the z-order so that it is behind the points
      operationArrowNode.moveToBack();
    } );
    numberLine.operationsList.addItemRemovedListener( removedOperation => {
      const operationNode = mapOfOperationsToOperationNodes.get( removedOperation );
      assert && assert( operationNode, 'no operation node found for removed operation' );
      this.removeChild( operationNode );
    } );
  }
}

/**
 * OperationArrowNode (sounds like a movie title, no?) is used to depict an operation on a number line as an arrow from
 * the starting value to the ending value.  It looks like a curved arrow, and has a label and a description that can
 * be optionally shown.
 */
class OperationArrowNode extends Node {

  /**
   * @param {Operation} operation
   * @param {BooleanProperty} showLabelProperty
   * @param {BooleanProperty} showDescriptionProperty
   * @param {SpatializedNumberLine} numberLine
   */
  constructor( operation, showLabelProperty, showDescriptionProperty, numberLine ) {

    // TODO: Check for horizontal, since that's all that is currently supported.

    const arrowStartPoint = numberLine.valueToModelPosition( operation.startValue );
    const arrowEndPoint = numberLine.valueToModelPosition( operation.getEndValue() );

    // Calculate the radius of the circle that will be used to define this arrow's path using the distance between the
    // points and the distance of the top of the arc from the number line.  I (jbphet) derived this myself because I
    // couldn't easily find a description online, and it seems to work.
    const distanceOfTopFromNumberLine = 20; // empirically chosen to look decent, change at will
    const radiusOfCircle = Math.pow( arrowStartPoint.distance( arrowEndPoint ), 2 ) /
                           ( 8 * distanceOfTopFromNumberLine ) +
                           distanceOfTopFromNumberLine / 2;

    const centerOfCircle = new Vector2(
      ( arrowStartPoint.x + arrowEndPoint.x ) / 2,
      arrowStartPoint.y - distanceOfTopFromNumberLine + radiusOfCircle
    );

    const startAngle = arrowStartPoint.minus( centerOfCircle ).getAngle();
    const endAngle = arrowEndPoint.minus( centerOfCircle ).getAngle();

    // create the arc
    const arcShape = Shape.arc(
      centerOfCircle.x,
      centerOfCircle.y,
      radiusOfCircle,
      startAngle,
      endAngle,
      arrowStartPoint.x > arrowEndPoint.x
    );
    const arcNode = new Path( arcShape, {
      stroke: 'black',
      lineWidth: 2
    } );

    // Create the arrowhead.  The angle is calculated by using the angle at the starting point and then moving back a
    // bit along the circle to the head of the arrow.
    let arrowheadAngle;
    const compensationAngle = ARROWHEAD_LENGTH / ( 2 * radiusOfCircle );
    if ( arrowStartPoint.x > arrowEndPoint.x ) {
      arrowheadAngle = Math.PI - startAngle + compensationAngle;
    }
    else {
      arrowheadAngle = Math.PI + endAngle - compensationAngle;
    }
    const arrowheadNode = new ArrowheadNode(
      ARROWHEAD_LENGTH,
      arrowheadAngle,
      { x: arrowEndPoint.x, y: arrowEndPoint.y }
    );

    super( { children: [ arcNode, arrowheadNode ] } );
  }
}

/**
 * Inner class for creating the type of arrowhead needed for the operations lines.  Position the point of the arrowhead
 * by specifying the x and y position of the node.
 */
class ArrowheadNode extends Path {

  /**
   * @param {number} length
   * @param {number} rotation
   * @param {Object} [options]
   */
  constructor( length, rotation, options ) {

    options = merge( {
      lineJoin: 'round',
      fill: 'black'
    }, options );

    const arrowHeadShape = NORMALIZED_ARROWHEAD_SHAPE
      .transformed( Matrix3.scale( length ) )
      .transformed( Matrix3.rotationAround( rotation, 0, 0 ) );
    super( arrowHeadShape, options );
  }
}

numberLineOperations.register( 'OperationsTrackingNumberLineNode', OperationsTrackingNumberLineNode );
export default OperationsTrackingNumberLineNode;