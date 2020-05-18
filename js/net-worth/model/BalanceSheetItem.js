// Copyright 2020, University of Colorado Boulder

/**
 * BalanceSheetItem is a general model element that can represent assets and debts as they are portrayed in the
 * "Number Line: Operations" sim.  This means that each instance has typical things for assets and debts, such as a
 * positive or negative monetary value, but also things like a position, since these things can be moved around by the
 * user.
 */

import BooleanProperty from '../../../../axon/js/BooleanProperty.js';
import Property from '../../../../axon/js/Property.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import Vector2Property from '../../../../dot/js/Vector2Property.js';
import Animation from '../../../../twixt/js/Animation.js';
import Easing from '../../../../twixt/js/Easing.js';
import numberLineOperations from '../../numberLineOperations.js';

// constants
const AVERAGE_ANIMATION_SPEED = 1000; // screen coordinates per second
const MIN_ANIMATION_TIME = 0.3; // in seconds

class BalanceSheetItem {

  constructor( value ) {

    // @public (read-only)
    this.value = value;

    // @public (read-only) - position in model space, don't set directly - use methods on this class
    this.positionProperty = new Vector2Property( Vector2.ZERO );

    // @public (read-write)
    this.isDraggingProperty = new BooleanProperty( false );

    // @public (read-only) {Animation|null} - animation that is currently in progress, null if there isn't one
    this.inProgressAnimationProperty = new Property( null );

    // @public (read-write) - flag that indicates whether this item is in a balance sheet item bag
    this.inBagProperty = new BooleanProperty( false );
  }

  /**
   * animate (as opposed to moving instantaneously) to the provided position
   * @param {Vector2} destination
   */
  animateTo( destination ) {

    // if there is an active animation, stop it
    this.stopAnimation();

    // create the animation for moving to the provided destination
    const animation = new Animation( {
      duration: Math.max(
        MIN_ANIMATION_TIME,
        this.positionProperty.value.distance( destination ) / AVERAGE_ANIMATION_SPEED
      ),
      targets: [

        // position
        {
          property: this.positionProperty,
          easing: Easing.CUBIC_IN_OUT,
          to: destination
        } ]
    } );
    this.inProgressAnimationProperty.value = animation;
    animation.start();

    // when the animation is finished, clear the property that is keeping track of it
    animation.finishEmitter.addListener( () => {
      this.inProgressAnimationProperty.value = null;
    } );
    animation.stopEmitter.addListener( () => {
      this.inProgressAnimationProperty.value = null;
    } );
  }

  /**
   * go immediately to the specified position (and cancel any animations that were in progress)
   * @param {Vector2} position
   */
  teleportTo( position ) {

    // just in case, is a no-op if no animation is happening
    this.stopAnimation();

    // go to the position
    this.positionProperty.set( position );

  }

  /**
   * stop the current animation if one is happening, do nothing if not
   * @private
   */
  stopAnimation() {
    if ( this.inProgressAnimationProperty.value ) {
      this.inProgressAnimationProperty.value.stop();
      this.inProgressAnimationProperty.value = null;
    }
  }

}

numberLineOperations.register( 'BalanceSheetItem', BalanceSheetItem );
export default BalanceSheetItem;