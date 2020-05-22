// Copyright 2020, University of Colorado Boulder

import Property from '../../../../axon/js/Property.js';
import Matrix3 from '../../../../dot/js/Matrix3.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import Shape from '../../../../kite/js/Shape.js';
import Enumeration from '../../../../phet-core/js/Enumeration.js';
import merge from '../../../../phet-core/js/merge.js';
import StringUtils from '../../../../phetcommon/js/util/StringUtils.js';
import BackgroundNode from '../../../../scenery-phet/js/BackgroundNode.js';
import MathSymbols from '../../../../scenery-phet/js/MathSymbols.js';
import PhetFont from '../../../../scenery-phet/js/PhetFont.js';
import Node from '../../../../scenery/js/nodes/Node.js';
import Path from '../../../../scenery/js/nodes/Path.js';
import Text from '../../../../scenery/js/nodes/Text.js';
import Animation from '../../../../twixt/js/Animation.js';
import Easing from '../../../../twixt/js/Easing.js';
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
const DISTANCE_BETWEEN_LABELS = 3; // in screen coordinates
const RENDERING_SCOPE = Enumeration.byKeys( [ 'ALL', 'PARTIAL', 'NONE' ] );

/**
 * NumberLineOperationNode is used to depict an operation on a number line.  It looks like a curved arrow, and has a
 * label and a description that can be optionally shown. It must be positioned by the client such that the node's (x,y) position is where the starting point is in view space.
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
      relativePosition: RelativePositions.ABOVE_NUMBER_LINE,
      operationLabelFont: new PhetFont( 18 ),
      operationDescriptionFont: new PhetFont( 18 ),
      labelDistanceFromApex: 3,

      // {boolean} - animate the drawing of the arrow when it transitions from inactive to active
      animateOnActive: true
    }, options );

    super( options );

    // hook up the visibility attribute
    const visibilityLinkage = operation.isActiveProperty.linkAttribute( this, 'visible' );

    // identify the point from which this operation node will originate
    const operationNumber = numberLine.operations.indexOf( operation );
    const originPoint = operationNumber === 0 ? numberLine.startingPoint : numberLine.endpoints[ operationNumber - 1 ];

    // convenience var
    const aboveNumberLine = options.relativePosition === RelativePositions.ABOVE_NUMBER_LINE;

    // create the operation label
    const operationLabelTextNode = new Text( '', {
      font: options.operationLabelFont
    } );
    const operationLabel = new BackgroundNode( operationLabelTextNode );
    const showLabelLinkAttribute = showLabelProperty.linkAttribute( operationLabel, 'visible' );
    this.addChild( operationLabel );

    // operation description
    const operationDescriptionTextNode = new Text( '', {
      font: options.operationDescriptionFont
    } );
    const operationDescription = new BackgroundNode( operationDescriptionTextNode );
    const showDescriptionAttribute = showDescriptionProperty.linkAttribute( operationDescription, 'visible' );
    this.addChild( operationDescription );

    // variables used to position the operation description, since it needs to move based on whether the label is visible
    let descriptionCenterYWhenLabelVisible = 0;
    let descriptionCenterYWhenLabelNotVisible = 0;

    // Indicates whether this is armed for animation, meaning that the next inactive-to-active change should be animated
    // rather than drawn immediately.
    let armedForAnimation = false;

    operation.isActiveProperty.lazyLink( isActive => {
      if ( isActive && options.animateOnActive ) {
        armedForAnimation = true;
      }
    } );

    // animation that is in progress, null when none (i.e. most of the time)
    let inProgressAnimation = null;

    // @private {Path} - the Node that makes up the curved line portion of the arrow, updated when the operation changes
    this.curvedLineNode = new Path( null, CURVED_LINE_OPTIONS );
    this.addChild( this.curvedLineNode );

    // @private {ArrowHeadNode} - head of the arrow
    this.arrowheadNode = new ArrowheadNode( ARROWHEAD_LENGTH, 0 );
    this.addChild( this.arrowheadNode );

    // update the arrow, labels, and label positions as the attributes of the operation and number line change
    const updateMultilink = Property.multilink(
      [
        operation.isActiveProperty,
        operation.operationTypeProperty,
        operation.amountProperty,
        numberLine.displayedRangeProperty,
        numberLine.centerPositionProperty,
        originPoint.valueProperty
      ],
      isActive => {

        // Figure out whether this operation is entirely within the displayed range of the number line, partially in range,
        // or entirely out of range.  This will be important for how the rendering proceeds.
        let rendingScope;
        const displayedRange = numberLine.displayedRangeProperty.value;
        const operationStartValue = originPoint.valueProperty.value;
        const operationEndValue = numberLine.getOperationResult( operation );
        if ( displayedRange.contains( operationStartValue ) && displayedRange.contains( operationEndValue ) ) {
          rendingScope = RENDERING_SCOPE.ALL;
        }
        else if ( !displayedRange.contains( operationStartValue ) && !displayedRange.contains( operationEndValue ) ) {
          rendingScope = RENDERING_SCOPE.NONE;
        }
        else {
          rendingScope = RENDERING_SCOPE.PARTIAL;
        }
        console.log( 'rendingScope = ' + rendingScope );

        const startPosition = numberLine.valueToModelPosition( operationStartValue );
        const endPosition = numberLine.valueToModelPosition( operationEndValue );

        // stop any animation that was in progress
        if ( inProgressAnimation ) {
          inProgressAnimation.stop();
          inProgressAnimation = null;
        }

        if ( isActive ) {

          if ( armedForAnimation && startPosition.distance( endPosition ) > 0 ) {

            // create an animation to make the change
            inProgressAnimation = new Animation( {
              duration: 0.75, // in seconds, empirically determined
              from: 0,
              to: 1,
              easing: Easing.CUBIC_OUT,
              setValue: proportionToDraw => {
                this.updateArrow( operation, numberLine, aboveNumberLine, proportionToDraw );
              }
            } );
            inProgressAnimation.start();
            inProgressAnimation.finishEmitter.addListener( () => { inProgressAnimation = null; } );

            // clear the flag until another transition occurs
            armedForAnimation = false;
          }
          else {

            // make the change instantaneously
            this.updateArrow( operation, numberLine, aboveNumberLine, 1 );
          }

          // update the operation label
          const operationCenterX = ( startPosition.x + endPosition.x ) / 2;
          const operationChar = operation.operationTypeProperty.value === Operations.ADDITION ? '+' : '-';
          const unarySignChar = operation.amountProperty.value < 0 ? MathSymbols.UNARY_MINUS : MathSymbols.UNARY_PLUS;
          operationLabelTextNode.text = operationChar +
                                        ' ' +
                                        unarySignChar +
                                        Math.abs( operation.amountProperty.value ).toString( 10 );
          operationLabel.centerX = operationCenterX;
          if ( aboveNumberLine ) {
            operationLabel.bottom = startPosition.y - APEX_DISTANCE_FROM_NUMBER_LINE - options.labelDistanceFromApex;
          }
          else {
            operationLabel.top = startPosition.y + APEX_DISTANCE_FROM_NUMBER_LINE + options.labelDistanceFromApex;
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
                                               operationLabel.top - operationDescription.height / 2 - DISTANCE_BETWEEN_LABELS :
                                               operationLabel.bottom + operationDescription.height / 2 + DISTANCE_BETWEEN_LABELS;
          descriptionCenterYWhenLabelNotVisible = operationLabel.centerY;
          operationDescription.centerX = operationCenterX;
          operationDescription.centerY = showLabelProperty.value ?
                                         descriptionCenterYWhenLabelVisible :
                                         descriptionCenterYWhenLabelNotVisible;
        }
      }
    );

    // Update the position of the operation description based on the visibility of the operation label.  An animation is
    // used to make this look cool.
    let descriptionMovementAnimation = null;
    const commonAnimationOptions = {
      duration: 0.25,
      easing: Easing.LINEAR,
      setValue: value => { operationDescription.centerY = value; }
    };
    showLabelProperty.lazyLink( labelVisible => {

      // stop any in-progress animation of the label position
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
      operation.isActiveProperty.unlinkAttribute( visibilityLinkage );
      updateMultilink.dispose();
      showLabelProperty.unlinkAttribute( showLabelLinkAttribute, 'visible' );
      showDescriptionProperty.unlinkAttribute( showDescriptionAttribute, 'visible' );
    };
  }

  /**
   * @param {NumberLineOperation} operation
   * @param {OperationTrackingNumberLine} numberLine
   * @param {boolean} aboveNumberLine
   * @param {number} proportion - proportion to draw, from 0 to 1, used for animation and partial drawing
   * @private
   */
  updateArrow( operation, numberLine, aboveNumberLine, proportion ) {

    let lineShape;
    let arrowheadAngle;

    // calculate the start and end points of the curved line
    const sign = operation.operationTypeProperty.value === Operations.SUBTRACTION ? -1 : 1;
    const deltaX = ( numberLine.valueToModelPosition( operation.amountProperty.value ).x -
                     numberLine.valueToModelPosition( 0 ).x ) * sign;

    const startPoint = numberLine.valueToModelPosition( numberLine.getOperationStartValue( operation ) );
    const endPoint = numberLine.valueToModelPosition( numberLine.getOperationResult( operation ) );

    if ( Math.abs( deltaX / 2 ) >= APEX_DISTANCE_FROM_NUMBER_LINE ) {

      // For this case, a circle is used for the underlying shape.  Calculate the radius and center position of the
      // circle such that the apex will be at the needed height and the circle will intersect the number line at the
      // start and end points.  I (jbphet) derived this myself because I couldn't easily find a description online, and
      // it seems to work.
      const radiusOfCircle = Math.pow( startPoint.distance( endPoint ), 2 ) /
                             ( 8 * APEX_DISTANCE_FROM_NUMBER_LINE ) +
                             APEX_DISTANCE_FROM_NUMBER_LINE / 2;

      // Calculate the center Y position of the circle.  For the angle calculations to work, the center of the circle
      // must always be a little above the number line when the line is above and below when below, hence the min and
      // max operations.
      const circleYPosition = aboveNumberLine ?
                              startPoint.y - APEX_DISTANCE_FROM_NUMBER_LINE + radiusOfCircle :
                              startPoint.y + APEX_DISTANCE_FROM_NUMBER_LINE - radiusOfCircle;
      const centerOfCircle = new Vector2( ( startPoint.x + endPoint.x ) / 2, circleYPosition );

      const startAngle = startPoint.minus( centerOfCircle ).getAngle();
      const completeArcEndAngle = endPoint.minus( centerOfCircle ).getAngle();
      const endAngle = startAngle + ( completeArcEndAngle - startAngle ) * proportion;

      let drawArcAnticlockwise;
      if ( aboveNumberLine ) {
        drawArcAnticlockwise = startPoint.x > endPoint.x;
      }
      else {
        drawArcAnticlockwise = endPoint.x > startPoint.x;
      }

      // create the arc
      lineShape = Shape.arc(
        centerOfCircle.x,
        centerOfCircle.y,
        radiusOfCircle,
        startAngle,
        endAngle,
        drawArcAnticlockwise
      );

      // Calculate the angle of the arrowhead.  This is calculated by using the angle at the starting point and then
      // moving back a bit along the circle to the head of the arrow.
      const compensationAngle = ARROWHEAD_LENGTH / ( 2 * radiusOfCircle );
      if ( aboveNumberLine ) {
        if ( deltaX < 0 ) {
          arrowheadAngle = Math.PI - startAngle + compensationAngle;
        }
        else {
          arrowheadAngle = Math.PI + completeArcEndAngle - compensationAngle;
        }
      }
      else {
        if ( deltaX < 0 ) {
          arrowheadAngle = -startAngle - compensationAngle;
        }
        else {
          arrowheadAngle = completeArcEndAngle + compensationAngle;
        }
      }
    }
    else if ( Math.abs( deltaX ) > 0 ) {

      // In this case, the distance between the start and end points is less than the intended apex of the curve, so an
      // elliptical arc is used rather than a circular one.

      // parameters of the elliptical arc
      const radiusX = Math.abs( deltaX / 2 );
      const radiusY = APEX_DISTANCE_FROM_NUMBER_LINE;
      let startAngle;
      let endAngle;
      let anticlockwise;

      // adjustment angle for the arrowhead - This formula was empirically determined, though a true derivation may be
      // possible.  I (jbphet) tried for about 1/2, then tried this and it worked, so it was left at this.
      const arrowheadAngleFromPerpendicular = radiusX / radiusY * Math.PI * 0.1;
      if ( aboveNumberLine ) {
        if ( deltaX > 0 ) {
          startAngle = -Math.PI;
          endAngle = startAngle + ( proportion * Math.PI );
          anticlockwise = false;
          arrowheadAngle = Math.PI - arrowheadAngleFromPerpendicular;
        }
        else {
          startAngle = 0;
          endAngle = -proportion * Math.PI;
          anticlockwise = true;
          arrowheadAngle = Math.PI + arrowheadAngleFromPerpendicular;
        }
      }
      else {
        if ( deltaX > 0 ) {
          startAngle = Math.PI;
          endAngle = startAngle - ( proportion * Math.PI );
          anticlockwise = true;
          arrowheadAngle = arrowheadAngleFromPerpendicular;
        }
        else {
          startAngle = 0;
          endAngle = proportion * Math.PI;
          anticlockwise = false;
          arrowheadAngle = -arrowheadAngleFromPerpendicular;
        }
      }

      lineShape = new Shape().ellipticalArc(
        startPoint.x + deltaX / 2,
        startPoint.y,
        radiusX,
        radiusY,
        0,
        startAngle,
        endAngle,
        anticlockwise
      );
    }
    else {

      // The amount of the operation is zero, so the curved line will be a loop that starts and ends at a point.
      // However, odd shapes were produced when trying to loop to and from the exact same point, so there are some
      // small offsets used in the X direction.
      // TODO: follow up with JO as to whether the need for adjustment is actually a bug
      const loopStartAndEndPoint = startPoint;
      const adjustmentAmount = 1; // in screen coordinates
      const adjustedStartPoint = loopStartAndEndPoint.plusXY( -adjustmentAmount / 2, 0 );
      const adjustedEndPoint = loopStartAndEndPoint.plusXY( adjustmentAmount / 2, 0 );
      const yAddFactor = APEX_DISTANCE_FROM_NUMBER_LINE * ( aboveNumberLine ? -1.5 : 1.5 ); // empirical for desired height
      const controlPointHeightMultiplier = 0.6; // empirically determined to get the desired loop width
      const controlPoint1 = new Vector2(
        loopStartAndEndPoint.x - controlPointHeightMultiplier * APEX_DISTANCE_FROM_NUMBER_LINE,
        loopStartAndEndPoint.y + yAddFactor
      );
      const controlPoint2 = new Vector2(
        loopStartAndEndPoint.x + controlPointHeightMultiplier * APEX_DISTANCE_FROM_NUMBER_LINE,
        loopStartAndEndPoint.y + yAddFactor
      );
      lineShape = new Shape()
        .moveToPoint( adjustedStartPoint )
        .cubicCurveToPoint( controlPoint1, controlPoint2, adjustedEndPoint );

      // The formula for the arrowhead angle was determined through trial and error, which isn't a great way to do it
      // because it may not work if significant changes are made to the shape of the loop, but evaluating the Bezier
      // curve for this short distance proved difficult.  This may require adjustment if the size or orientations of the
      // loop changes.
      const multiplier = 0.025;
      const loopWidth = lineShape.bounds.width;
      if ( operation.operationTypeProperty.value === Operations.ADDITION ) {
        if ( aboveNumberLine ) {
          arrowheadAngle = Math.PI + loopWidth * multiplier;
        }
        else {
          arrowheadAngle = -loopWidth * multiplier;
        }
      }
      else {
        if ( aboveNumberLine ) {
          arrowheadAngle = Math.PI - loopWidth * multiplier;
        }
        else {
          arrowheadAngle = loopWidth * multiplier;
        }
      }
    }

    this.curvedLineNode.shape = lineShape;
    this.arrowheadNode.setRotation( arrowheadAngle );
    this.arrowheadNode.translation = endPoint;

    // only show the arrowhead for full or nearly full depictions of the operation
    this.arrowheadNode.visible = proportion > 0.9;
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
