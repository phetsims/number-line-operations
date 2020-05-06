// Copyright 2020, University of Colorado Boulder

/**
 * @author John Blanco
 */

import BooleanProperty from '../../../../axon/js/BooleanProperty.js';
import NumberProperty from '../../../../axon/js/NumberProperty.js';
import ObservableArray from '../../../../axon/js/ObservableArray.js';
import Range from '../../../../dot/js/Range.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import LockToNumberLine from '../../../../number-line-integers/js/common/model/LockToNumberLine.js';
import PointController from '../../../../number-line-integers/js/common/model/PointController.js';
import Color from '../../../../scenery/js/util/Color.js';
import Animation from '../../../../twixt/js/Animation.js';
import Easing from '../../../../twixt/js/Easing.js';
import OperationTrackingNumberLine from '../../common/model/OperationTrackingNumberLIne.js';
import NLOConstants from '../../common/NLOConstants.js';
import numberLineOperations from '../../numberLineOperations.js';

// constants
const NUMBER_LINE_RANGES = [
  new Range( -10, 10 ),
  new Range( -100, 100 ),
  new Range( -1000, 1000 )
];
const MODEL_BOUNDS = NLOConstants.LAYOUT_BOUNDS;
const NUMBER_LINE_CENTER_X = MODEL_BOUNDS.centerX - 18; // matches design doc layout
const PRIMARY_NUMBER_LINE_LOWER_POSITION = new Vector2( NUMBER_LINE_CENTER_X, MODEL_BOUNDS.centerY );
const PRIMARY_NUMBER_LINE_UPPER_POSITION = PRIMARY_NUMBER_LINE_LOWER_POSITION.minusXY( 0, MODEL_BOUNDS.height * 0.15 );
const PRIMARY_NUMBER_LINE_POINTS_COLOR = Color.BLUE;
const SECONDARY_NUMBER_LINE_POINTS_COLOR = Color.MAGENTA;
const NUMBER_LINE_WIDTH = MODEL_BOUNDS.width * 0.81; // empirically determined to match spec

/**
 * primary model for the "Generic" screen
 */
class NLOGenericModel {

  /**
   * @param {Tandem} tandem
   */
  constructor( tandem ) {

    // @public (read-write) - whether or not the 2nd number line is visible to the user
    this.secondNumberLineVisibleProperty = new BooleanProperty( false );

    // the starting value for the primary number line
    const primaryStartingValue = new NumberProperty( 1 );

    // @public - the primary operation-tracking number line, which is always visible
    this.primaryNumberLine = new OperationTrackingNumberLine(
      PRIMARY_NUMBER_LINE_LOWER_POSITION,
      {
        numberOfOperationsTracked: 2,
        startingValueProperty: primaryStartingValue,
        initialDisplayedRange: NUMBER_LINE_RANGES[ 0 ],
        tickMarksInitiallyVisible: true,
        preventOverlap: false,
        labelsInitiallyVisible: true,
        widthInModelSpace: NUMBER_LINE_WIDTH
      }
    );

    // @public (read-only) - Associate a point controller with the point that represents the initial value on the
    // operation tracking number line.  This point controller will always be present on the number line, whereas there
    // are others that can come and go.
    assert && assert( this.primaryNumberLine.residentPoints.length === 1, 'expected only one point on the number line' );
    this.primaryLineInitialValuePointController = new PointController( {
      color: PRIMARY_NUMBER_LINE_POINTS_COLOR,
      numberLines: [ this.primaryNumberLine ],
      numberLinePoints: [ this.primaryNumberLine.startingPoint ],
      lockToNumberLine: LockToNumberLine.ALWAYS
    } );

    // @public (read-only) {ObservableArray.<PointController>} - A list of the point controllers for the primary number
    // line. These come and go as points come and go.
    this.primaryNumberLinePointControllers = new ObservableArray();
    this.primaryNumberLine.residentPoints.addItemAddedListener( addedPoint => {

      // add a point controller for the newly added point
      const pointController = new PointController( {
        color: PRIMARY_NUMBER_LINE_POINTS_COLOR,
        numberLines: [ this.primaryNumberLine ],
        numberLinePoints: [ addedPoint ],
        lockToNumberLine: LockToNumberLine.ALWAYS
      } );
      this.primaryNumberLinePointControllers.push( pointController );

      // remove the point controller when the associated point goes away
      const removalListener = removedPoint => {
        if ( removedPoint === addedPoint ) {
          this.primaryNumberLinePointControllers.remove( pointController );
          pointController.dispose();
          this.primaryNumberLine.residentPoints.removeItemRemovedListener( removalListener );
        }
      };
      this.primaryNumberLine.residentPoints.addItemRemovedListener( removalListener );
    } );

    // @public - the secondary operation-tracking number line, which is only visible when enabled by the user
    this.secondaryNumberLine = new OperationTrackingNumberLine(
      this.primaryNumberLine.centerPositionProperty.value.plusXY( 0, 62 ),
      {
        numberOfOperationsTracked: 2,
        initialDisplayedRange: NUMBER_LINE_RANGES[ 0 ],
        tickMarksInitiallyVisible: true,
        preventOverlap: false,
        labelsInitiallyVisible: true,
        startingPointColor: SECONDARY_NUMBER_LINE_POINTS_COLOR,
        endpointColor: SECONDARY_NUMBER_LINE_POINTS_COLOR,
        widthInModelSpace: NUMBER_LINE_WIDTH
      }
    );

    // @public (read-only) - Associate a point controller with the point that represents the initial value on the
    // operation tracking number line.  This point controller will always be present on the number line, whereas there
    // are others that can come and go.
    assert && assert( this.secondaryNumberLine.residentPoints.length === 1, 'expected only one point on the number line' );
    this.secondaryLineInitialValuePointController = new PointController( {
      color: SECONDARY_NUMBER_LINE_POINTS_COLOR,
      numberLines: [ this.secondaryNumberLine ],
      numberLinePoints: [ this.secondaryNumberLine.startingPoint ],
      lockToNumberLine: LockToNumberLine.ALWAYS
    } );

    // @public (read-only) {ObservableArray.<PointController>} - A list of the point controllers for the secondary number
    // line. These come and go as points come and go.
    this.secondaryNumberLinePointControllers = new ObservableArray();
    this.secondaryNumberLine.residentPoints.addItemAddedListener( addedPoint => {

      // add a point controller for the newly added point
      const pointController = new PointController( {
        color: SECONDARY_NUMBER_LINE_POINTS_COLOR,
        numberLines: [ this.secondaryNumberLine ],
        numberLinePoints: [ addedPoint ],
        lockToNumberLine: LockToNumberLine.ALWAYS
      } );
      this.secondaryNumberLinePointControllers.push( pointController );

      // remove the point controller when the associated point goes away
      const removalListener = removedPoint => {
        if ( removedPoint === addedPoint ) {
          this.secondaryNumberLinePointControllers.remove( pointController );
          pointController.dispose();
          this.secondaryNumberLine.residentPoints.removeItemRemovedListener( removalListener );
        }
      };
      this.secondaryNumberLine.residentPoints.addItemRemovedListener( removalListener );
    } );

    // animation to move the primary number line around based on with the secondary is being shown
    this.primaryNumberLineAnimation = null;

    // position the primary number line based on whether the secondary number line is visible
    this.secondNumberLineVisibleProperty.link( secondNumberLineVisible => {
      const destination = secondNumberLineVisible ?
                          PRIMARY_NUMBER_LINE_UPPER_POSITION :
                          PRIMARY_NUMBER_LINE_LOWER_POSITION;
      if ( !this.primaryNumberLine.centerPositionProperty.value.equals( destination ) ) {

        // stop any previous animation
        if ( this.primaryNumberLineAnimation ) {
          this.primaryNumberLineAnimation.stop();
        }

        // start an animation to move the number line to the desired position
        this.primaryNumberLineAnimation = new Animation( {
          duration: 0.5,
          targets: [
            {
              property: this.primaryNumberLine.centerPositionProperty,
              easing: Easing.CUBIC_IN_OUT,
              to: destination
            } ]
        } );
        this.primaryNumberLineAnimation.start();
        this.primaryNumberLineAnimation.endedEmitter.addListener( () => {
          this.primaryNumberLineAnimation = null;
        } );
      }
    } );
  }

  /**
   * resets the model
   * @public
   */
  reset() {
    this.primaryNumberLine.reset();
    this.secondaryNumberLine.reset();
    this.secondNumberLineVisibleProperty.reset();
  }
}

// statics
NLOGenericModel.NUMBER_LINE_RANGES = NUMBER_LINE_RANGES;

numberLineOperations.register( 'NLOGenericModel', NLOGenericModel );
export default NLOGenericModel;