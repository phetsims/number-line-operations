// Copyright 2020, University of Colorado Boulder

/**
 * OperationsTrackingNumberLineNode is a specialization of SpatializedNumberLineNode that adds the ability to depict
 * labeled operations that have occurred between the points on the number line.
 */

import Easing from '../../../../twixt/js/Easing.js';
import Animation from '../../../../twixt/js/Animation.js';
import Matrix3 from '../../../../dot/js/Matrix3.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import Shape from '../../../../kite/js/Shape.js';
import SpatializedNumberLineNode from '../../../../number-line-common/js/common/view/SpatializedNumberLineNode.js';
import merge from '../../../../phet-core/js/merge.js';
import StringUtils from '../../../../phetcommon/js/util/StringUtils.js';
import BackgroundNode from '../../../../scenery-phet/js/BackgroundNode.js';
import MathSymbols from '../../../../scenery-phet/js/MathSymbols.js';
import PhetFont from '../../../../scenery-phet/js/PhetFont.js';
import Node from '../../../../scenery/js/nodes/Node.js';
import Path from '../../../../scenery/js/nodes/Path.js';
import Text from '../../../../scenery/js/nodes/Text.js';
import numberLineOperations from '../../numberLineOperations.js';
import numberLineOperationsStrings from '../../numberLineOperationsStrings.js';
import Operations from '../model/Operations.js';

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
      operationNode.dispose();
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

    // Make sure the number line is in the horizontal orientation.  While it wouldn't be too difficult to generalize
    // this class to handle the vertical orientation, to date it hasn't been needed, so it hasn't been done.
    assert && assert( numberLine.isHorizontal, 'this class is not generalized to handle vertical number lines ' );

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

    // operation label
    const operationChar = operation.operationType === Operations.ADDITION ? '+' : '-';
    const unarySignChar = operation.amount < 0 ? MathSymbols.UNARY_MINUS : MathSymbols.UNARY_PLUS;
    const operationText = operationChar + ' ' + unarySignChar + Math.abs( operation.amount ).toString( 10 );
    const operationLabelTextNode = new Text( operationText, {
      font: new PhetFont( 20 )
    } );
    const operationLabel = new BackgroundNode( operationLabelTextNode, {
      centerX: arcNode.centerX,
      bottom: arcNode.top - 3
    } );
    const showLabelLinkAttribute = showLabelProperty.linkAttribute( operationLabel, 'visible' );

    // operation description
    const operationDescriptionText = StringUtils.fillIn( numberLineOperationsStrings.addRemoveAssetDebtPattern, {
      addOrRemove: operation.operationType === Operations.ADDITION ?
                   numberLineOperationsStrings.add :
                   numberLineOperationsStrings.remove,
      assetOrDebt: operation.amount > 0 ? numberLineOperationsStrings.asset : numberLineOperationsStrings.debt,
      currencyUnits: numberLineOperationsStrings.currencyUnits,
      value: Math.abs( operation.amount )
    } );
    const operationDescriptionTextNode = new Text( operationDescriptionText, {
      font: new PhetFont( 20 )
    } );
    const descriptionBottomWhenLabelVisible = operationLabel.top;
    const descriptionBottomWhenLabelNotVisible = operationLabel.bottom;
    const operationDescription = new BackgroundNode( operationDescriptionTextNode, {
      centerX: arcNode.centerX,
      bottom: showLabelProperty.value ? descriptionBottomWhenLabelVisible : descriptionBottomWhenLabelNotVisible
    } );
    const showDescriptionAttribute = showDescriptionProperty.linkAttribute( operationDescription, 'visible' );

    // Position the operation description above/below the label when the label is visible, or in the label's spot when
    // the label is invisible.  Use an animation to make it look pro.
    let descriptionMovementAnimation = null;
    const commonAnimationOptions = {
      duration: 0.25,
      easing: Easing.CUBIC_IN_OUT,
      setValue: value => { operationDescription.bottom = value; }
    };
    showLabelProperty.lazyLink( labelVisible => {
      if ( labelVisible && operationDescription.bottom !== descriptionBottomWhenLabelVisible ) {
        descriptionMovementAnimation && descriptionMovementAnimation.stop();
        descriptionMovementAnimation = new Animation( merge( {
          from: operationDescription.bottom,
          to: descriptionBottomWhenLabelVisible
        }, commonAnimationOptions ) );
        descriptionMovementAnimation.start();
      }
      else if ( !labelVisible && operationDescription.bottom !== descriptionBottomWhenLabelNotVisible ) {
        descriptionMovementAnimation && descriptionMovementAnimation.stop();
        descriptionMovementAnimation = new Animation( merge( {
          from: operationDescription.bottom,
          to: descriptionBottomWhenLabelNotVisible
        }, commonAnimationOptions ) );
        descriptionMovementAnimation.start();
      }
      descriptionMovementAnimation && descriptionMovementAnimation.endedEmitter.addListener( () => {
        descriptionMovementAnimation = null;
      } );
    } );

    super( { children: [ arcNode, arrowheadNode, operationLabel, operationDescription ] } );

    // @private - dispose function
    this.disposeOperationArrowNode = () => {
      showLabelProperty.unlinkAttribute( showLabelLinkAttribute, 'visible' );
      showDescriptionProperty.unlinkAttribute( showDescriptionAttribute, 'visible' );
    };
  }

  /**
   * @public
   */
  dispose() {
    this.disposeOperationArrowNode();
    super.dispose();
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