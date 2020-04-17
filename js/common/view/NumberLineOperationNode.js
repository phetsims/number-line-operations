// Copyright 2020, University of Colorado Boulder

import Property from '../../../../axon/js/Property.js';
import Enumeration from '../../../../phet-core/js/Enumeration.js';
import Easing from '../../../../twixt/js/Easing.js';
import Animation from '../../../../twixt/js/Animation.js';
import Matrix3 from '../../../../dot/js/Matrix3.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import Shape from '../../../../kite/js/Shape.js';
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

const CURVED_LINE_OPTIONS = {
  stroke: 'black',
  lineWidth: 2
};
// an unscaled version of the arrowhead shape, pointing straight up, tip at 0,0, height normalized to 1
const NORMALIZED_ARROWHEAD_SHAPE = new Shape()
  .lineTo( -0.4, 1.14 )
  .lineTo( 0, 1 )
  .lineTo( 0.4, 1.14 )
  .lineTo( 0, 0 );

const ARROWHEAD_LENGTH = 15; // in screen coordinates, empirically chosen
const APEX_DISTANCE_FROM_NUMBER_LINE = 25; // in screen coordinates, empirically chosen to look good
const RelativePositions = Enumeration.byKeys( [ 'ABOVE_NUMBER_LINE', 'BELOW_NUMBER_LINE' ] );

/**
 * NumberLineOperationNode is used to depict an operation on a number line as an arrow from the point (0,0) to the
 * relative ending value.  It looks like a curved arrow, and has a label and a description that can be optionally shown.
 * It must be positioned by the client such that the node's (x,y) position is where the starting point is in view space.
 *
 * This node updates itself as the attributes of the underlying operation change.
 */
class NumberLineOperationNode extends Node {

  /**
   * @param {NumberLineOperation} operation
   * @param {BooleanProperty} showLabelProperty
   * @param {BooleanProperty} showDescriptionProperty
   * @param {OperationTrackingNumberLine} numberLine
   * @param {Object} [options]
   */
  constructor( operation, showLabelProperty, showDescriptionProperty, numberLine, options ) {

    // Make sure the number line is in the horizontal orientation.  While it wouldn't be too difficult to generalize
    // this class to handle the vertical orientation, to date it hasn't been needed, so it hasn't been done.
    assert && assert( numberLine.isHorizontal, 'this class is not generalized to handle vertical number lines ' );

    options = merge( {

      relativePosition: RelativePositions.ABOVE_NUMBER_LINE
    }, options );

    super( options );

    // convenience var
    const aboveNumberLine = options.relativePosition === RelativePositions.ABOVE_NUMBER_LINE;

    // create the operation label
    // TODO can the text be nothing to start with?
    const operationLabelTextNode = new Text( 'initially stubbed TODO - can this be nothing?', {
      font: new PhetFont( 18 )
    } );
    const operationLabel = new BackgroundNode( operationLabelTextNode );
    const showLabelLinkAttribute = showLabelProperty.linkAttribute( operationLabel, 'visible' );
    this.addChild( operationLabel );

    // operation description
    const operationDescriptionTextNode = new Text( 'TODO stubbed', {
      font: new PhetFont( 18 )
    } );
    const operationDescription = new BackgroundNode( operationDescriptionTextNode );
    const showDescriptionAttribute = showDescriptionProperty.linkAttribute( operationDescription, 'visible' );
    this.addChild( operationDescription );

    // variables used to position the operation description, since it needs to move based on whether the label is visible
    let descriptionCenterYWhenLabelVisible = aboveNumberLine ?
                                             operationLabel.top - operationDescription.height / 2 :
                                             operationLabel.bottom + operationDescription.height / 2;
    let descriptionCenterYWhenLabelNotVisible = operationLabel.centerY;

    // the node that looks like a curved arrow that spans from the start point to the endpoint of the operation
    let arrowNode;

    // update the arrow, labels, and label positions with the attributes of the operation change
    const updateMultilink = Property.multilink(
      [ operation.operationTypeProperty, operation.amountProperty ],
      () => {

        // update the arrow node
        if ( arrowNode ) {
          this.removeChild( arrowNode );
        }
        arrowNode = this.createArrowNode( operation, numberLine, aboveNumberLine );
        this.addChild( arrowNode );

        // update the operation label
        const operationChar = operation.operationTypeProperty.value === Operations.ADDITION ? '+' : '-';
        const unarySignChar = operation.amountProperty.value < 0 ? MathSymbols.UNARY_MINUS : MathSymbols.UNARY_PLUS;
        operationLabelTextNode.text = operationChar +
                                      ' ' +
                                      unarySignChar +
                                      Math.abs( operation.amountProperty.value ).toString( 10 );
        operationLabel.centerX = arrowNode.centerX;
        if ( aboveNumberLine ) {
          operationLabel.bottom = arrowNode.top - 3;
        }
        else {
          operationLabel.top = arrowNode.bottom + 3;
        }

        // update the operation description
        operationDescriptionTextNode.text = StringUtils.fillIn( numberLineOperationsStrings.addRemoveAssetDebtPattern, {
          addOrRemove: operation.operationTypeProperty.value === Operations.ADDITION ?
                       numberLineOperationsStrings.add :
                       numberLineOperationsStrings.remove,
          assetOrDebt: operation.amountProperty.value > 0 ?
                       numberLineOperationsStrings.asset :
                       numberLineOperationsStrings.debt,
          currencyUnits: numberLineOperationsStrings.currencyUnits,
          value: Math.abs( operation.amountProperty.value )
        } );
        descriptionCenterYWhenLabelVisible = aboveNumberLine ?
                                             operationLabel.top - operationDescription.height / 2 :
                                             operationLabel.bottom + operationDescription.height / 2;
        descriptionCenterYWhenLabelNotVisible = operationLabel.centerY;
        operationDescription.centerX = arrowNode.centerX;
        operationDescription.centerY = showLabelProperty.value ?
                                       descriptionCenterYWhenLabelVisible :
                                       descriptionCenterYWhenLabelNotVisible;
      }
    );

    // Update the position of the operation description based on the visibility of the operation label.  An animation is
    // used to make this look cool.
    let descriptionMovementAnimation = null;
    const commonAnimationOptions = {
      duration: 0.25,
      easing: Easing.CUBIC_IN_OUT,
      setValue: value => { operationDescription.centerY = value; }
    };
    showLabelProperty.lazyLink( labelVisible => {

      // stop any in-progress animations
      descriptionMovementAnimation && descriptionMovementAnimation.stop();

      if ( labelVisible && operationDescription.centerY !== descriptionCenterYWhenLabelVisible ) {

        descriptionMovementAnimation = new Animation( merge( {
          from: operationDescription.centerY,
          to: descriptionCenterYWhenLabelVisible
        }, commonAnimationOptions ) );
        descriptionMovementAnimation.start();
      }
      else if ( !labelVisible && operationDescription.centerY !== descriptionCenterYWhenLabelNotVisible ) {
        descriptionMovementAnimation = new Animation( merge( {
          from: operationDescription.centerY,
          to: descriptionCenterYWhenLabelNotVisible
        }, commonAnimationOptions ) );
        descriptionMovementAnimation.start();
      }
      descriptionMovementAnimation && descriptionMovementAnimation.endedEmitter.addListener( () => {
        descriptionMovementAnimation = null;
      } );
    } );

    // @private - dispose function
    this.disposeOperationArrowNode = () => {
      updateMultilink.dispose();
      showLabelProperty.unlinkAttribute( showLabelLinkAttribute, 'visible' );
      showDescriptionProperty.unlinkAttribute( showDescriptionAttribute, 'visible' );
    };
  }

  /**
   * @param {NumberLineOperation} operation
   * @param {OperationTrackingNumberLine} numberLine
   * @param {boolean} aboveNumberLine
   * @returns {Node}
   * @private
   */
  createArrowNode( operation, numberLine, aboveNumberLine ) {
    let curvedLineNode;
    let arrowheadNode;

    if ( operation.amountProperty.value !== 0 ) {

      const sign = operation.operationTypeProperty.value === Operations.SUBTRACTION ? -1 : 1;
      const xDistanceBetweenPoints = numberLine.valueToModelPosition( sign * operation.amountProperty.value ).x -
                                     numberLine.valueToModelPosition( 0 ).x;
      const arrowStartPoint = Vector2.ZERO;
      const arrowEndPoint = new Vector2( xDistanceBetweenPoints, 0 );

      // Calculate the radius of the circle that will be used to define this arrow's path using the distance between the
      // points and the distance of the top of the arc from the number line.  I (jbphet) derived this myself because I
      // couldn't easily find a description online, and it appears to work.
      const radiusOfCircle = Math.pow( arrowStartPoint.distance( arrowEndPoint ), 2 ) /
                             ( 8 * APEX_DISTANCE_FROM_NUMBER_LINE ) +
                             APEX_DISTANCE_FROM_NUMBER_LINE / 2;

      const circleYPosition = aboveNumberLine ?
                              arrowStartPoint.y - APEX_DISTANCE_FROM_NUMBER_LINE + radiusOfCircle :
                              arrowStartPoint.y + APEX_DISTANCE_FROM_NUMBER_LINE - radiusOfCircle;
      const centerOfCircle = new Vector2( ( arrowStartPoint.x + arrowEndPoint.x ) / 2, circleYPosition );

      const startAngle = arrowStartPoint.minus( centerOfCircle ).getAngle();
      const endAngle = arrowEndPoint.minus( centerOfCircle ).getAngle();

      let drawArcAnticlockwise;
      if ( aboveNumberLine ) {
        drawArcAnticlockwise = arrowStartPoint.x > arrowEndPoint.x;
      }
      else {
        drawArcAnticlockwise = arrowEndPoint.x > arrowStartPoint.x;
      }

      // create the arc
      const arcShape = Shape.arc(
        centerOfCircle.x,
        centerOfCircle.y,
        radiusOfCircle,
        startAngle,
        endAngle,
        drawArcAnticlockwise
      );
      curvedLineNode = new Path( arcShape, CURVED_LINE_OPTIONS );

      // Create the arrowhead.  The angle is calculated by using the angle at the starting point and then moving back a
      // bit along the circle to the head of the arrow.
      let arrowheadAngle;
      const compensationAngle = ARROWHEAD_LENGTH / ( 2 * radiusOfCircle );
      // TODO: This can be simpler.  Set to point down number line, then add or subtract rotation amount.
      if ( aboveNumberLine ) {
        if ( arrowStartPoint.x > arrowEndPoint.x ) {
          arrowheadAngle = Math.PI - startAngle + compensationAngle;
        }
        else {
          arrowheadAngle = Math.PI + endAngle - compensationAngle;
        }
      }
      else {
        if ( arrowStartPoint.x > arrowEndPoint.x ) {
          arrowheadAngle = -startAngle - compensationAngle;
        }
        else {
          arrowheadAngle = endAngle + compensationAngle;
        }
      }
      arrowheadNode = new ArrowheadNode( ARROWHEAD_LENGTH, arrowheadAngle, { translation: arrowEndPoint } );
    }
    else {

      // The amount of the operation is zero, so the curved line will be a loop that starts and ends at a point.
      // However, add shapes were produced when trying to loop to and from the exact same point, so there are some
      // small offsets used in the X direction.
      // TODO: follow up with JO as to whether the need for adjustment is actually a bug
      const loopStartAndEndPoint = Vector2.ZERO;
      const adjustmentAmount = 1; // in screen coordinates
      const adjustedStartPoint = loopStartAndEndPoint.plusXY( -adjustmentAmount / 2, 0 );
      const adjustedEndPoint = loopStartAndEndPoint.plusXY( adjustmentAmount / 2, 0 );
      const yAddFactor = APEX_DISTANCE_FROM_NUMBER_LINE * ( aboveNumberLine ? -2 : 2 );
      const controlPoint1 = new Vector2(
        loopStartAndEndPoint.x - 0.6 * APEX_DISTANCE_FROM_NUMBER_LINE,
        loopStartAndEndPoint.y + yAddFactor
      );
      const controlPoint2 = new Vector2(
        loopStartAndEndPoint.x + 0.6 * APEX_DISTANCE_FROM_NUMBER_LINE,
        loopStartAndEndPoint.y + yAddFactor
      );
      const loopShape = new Shape()
        .moveToPoint( adjustedStartPoint )
        .cubicCurveToPoint( controlPoint1, controlPoint2, adjustedEndPoint );

      curvedLineNode = new Path( loopShape, CURVED_LINE_OPTIONS );

      // The formula for the arrowhead angle was determined through trial and error, which isn't a great way to do it
      // because it may not work if significant changes are made to the shape of the loop, but evaluating the Bezier
      // curve for this short distance proved difficult.  This may require adjustment if the size or orientations of the
      // loop changes.
      let arrowheadAngle;
      const multiplier = 0.02;
      if ( operation.operationTypeProperty.value === Operations.ADDITION ) {
        if ( aboveNumberLine ) {
          arrowheadAngle = Math.PI + curvedLineNode.width * multiplier;
        }
        else {
          arrowheadAngle = -curvedLineNode.width * multiplier;
        }
      }
      else {
        if ( aboveNumberLine ) {
          arrowheadAngle = Math.PI - curvedLineNode.width * multiplier;
        }
        else {
          arrowheadAngle = curvedLineNode.width * multiplier;
        }
      }

      arrowheadNode = new ArrowheadNode( ARROWHEAD_LENGTH, arrowheadAngle, { translation: loopStartAndEndPoint } );
    }

    return new Node( { children: [ curvedLineNode, arrowheadNode ] } );
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

// statics
NumberLineOperationNode.RelativePositions = RelativePositions;

numberLineOperations.register( 'NumberLineOperationNode', NumberLineOperationNode );
export default NumberLineOperationNode;
