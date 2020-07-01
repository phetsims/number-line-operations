// Copyright 2020, University of Colorado Boulder

import Property from '../../../../axon/js/Property.js';
import StringUtils from '../../../../phetcommon/js/util/StringUtils.js';
import PhetFont from '../../../../scenery-phet/js/PhetFont.js';
import Text from '../../../../scenery/js/nodes/Text.js';
import Animation from '../../../../twixt/js/Animation.js';
import Easing from '../../../../twixt/js/Easing.js';
import Operations from '../../common/model/Operations.js';
import numberLineOperations from '../../numberLineOperations.js';
import numberLineOperationsStrings from '../../numberLineOperationsStrings.js';

// constants
const FADE_TIME = 0.25; // in seconds
const TRAVEL_TIME = 0.7; // in seconds
const FONT = new PhetFont( 22 );

/**
 * DynamicOperationDescription instances are used to provide a textual description of a number line operation BEFORE it
 * becomes active on the number line.  It updates, fades in and out, and animates as the user prepares and ultimately
 * adds the operation to the number line.  Instances of this class position themselves in view space based on what the
 * user is doing with an operation, so they are not meant to be positioned by the client. This class is very specific to
 * the Number Line Operations simulation.
 */
class DynamicOperationDescription extends Text {

  /**
   * @param {BooleanProperty} operationDescriptionsVisibleProperty - general viz param, the label will never be shown
   * when this is false
   * @param {Vector2} inactivePosition
   * @param {Vector2} activePosition
   * @param {NumberLineOperation} operation
   * @param {number} operationIDNumber - number that is used in conjunction with the selected selectedOperationIDProperty
   * to determine if this is the operation that the user is manipulating
   * @param {NumberProperty} selectedOperationIDProperty - the ID number of the operation that the user is manipulating
   * @param {OperationTrackingNumberLine} numberLine - the number line on which this operation is affiliated
   * @param {BooleanProperty} resetInProgressProperty - used to distinguish changes due to user interaction from those
   * caused by a reset
   */
  constructor(
    operationDescriptionsVisibleProperty,
    inactivePosition,
    activePosition,
    operation,
    operationIDNumber,
    selectedOperationIDProperty,
    numberLine,
    resetInProgressProperty ) {

    // this is intended to be constructed prior to the operation being activate
    assert && assert( !operation.isActiveProperty.value, 'operation must be inactive when this node is constructed' );

    // construct with no initial text and in the inactive position
    super( '', {
      font: FONT,
      center: inactivePosition,
      visible: false,
      opacity: 0
    } );

    // @private - location to which the description will animate when becoming active on the number line
    this.activePosition = activePosition;

    // control overall visibility
    operationDescriptionsVisibleProperty.linkAttribute( this, 'visible' );

    // update the text as the attributes of the operation change
    Property.multilink(
      [ operation.amountProperty, operation.operationTypeProperty ],
      ( amount, operationType ) => {
        if ( amount === 0 ) {
          this.text = StringUtils.fillIn( numberLineOperationsStrings.addRemoveZeroPattern, {
            addOrRemove: operationType === Operations.ADDITION ?
                         numberLineOperationsStrings.add :
                         numberLineOperationsStrings.remove,
            currencyUnits: numberLineOperationsStrings.currencyUnits
          } );
        }
        else {
          this.text = StringUtils.fillIn( numberLineOperationsStrings.addRemoveAssetDebtPattern, {
            addOrRemove: operationType === Operations.ADDITION ?
                         numberLineOperationsStrings.add :
                         numberLineOperationsStrings.remove,
            assetOrDebt: amount > 0 ?
                         numberLineOperationsStrings.asset :
                         numberLineOperationsStrings.debt,
            currencyUnits: numberLineOperationsStrings.currencyUnits,
            value: Math.abs( amount )
          } );
        }

        this.center = inactivePosition;
      }
    );

    // fade in if the user starts interacting with this operation and we're not already visible
    Property.lazyMultilink(
      [ operation.amountProperty, operation.operationTypeProperty ],
      () => {

        // make the update, but only if the changes were not due to a reset
        if ( !resetInProgressProperty.value ) {
          if ( selectedOperationIDProperty.value === operationIDNumber && !operation.isActiveProperty.value && this.opacity === 0 ) {
            this.initiateFadeIn();
          }
        }
      }
    );

    // Handle changes to the selected operation.
    selectedOperationIDProperty.lazyLink( selectedOperationID => {

      if ( !operation.isActiveProperty.value ) {

        // Fade out if visible and a different operation gets selected.
        if ( selectedOperationID !== operationIDNumber && this.opacity > 0 ) {
          this.initiateFadeOut();
        }
        else if ( selectedOperationID === operationIDNumber && this.opacity === 0 ) {

          // Are any other operations active?
          const anotherOperationIsActive = numberLine.operations.reduce( ( activeOperationFound, operationToCheck ) => {
            return activeOperationFound || ( operationToCheck !== operation && operationToCheck.isActiveProperty.value );
          }, false );

          // If another operation is already active, show this one when it becomes selected, but use a delay so that
          // this description doesn't end up overlapping with that of the other operation.
          if ( anotherOperationIsActive ) {
            this.initiateFadeIn( 0.9 ); // fade time empirically determined
          }
        }
      }

    } );

    // Handle changes to the 'isActive' state of the operation, which indicates whether it is shown on the number line.
    operation.isActiveProperty.lazyLink( isActive => {

      if ( isActive ) {

        if ( this.opacity !== 1 ) {

          // if the operation becomes active while invisible or fading in, instantly make it fully visible
          if ( this.fadeAnimation ) {
            this.fadeAnimation.stop();
          }
          this.opacity = 1;
        }

        // head to the "active" position
        this.initiateMovementToActivePosition();
      }
      else if ( !isActive ) {

        // go back to the inactive position (without animation)
        this.center = inactivePosition;

        // If the operation went inactive due to being erased, and that's the operation that is currently selected,
        // then it should be visible.  Otherwise it shouldn't.
        if ( !resetInProgressProperty.value && selectedOperationIDProperty.value === operationIDNumber ) {
          this.opacity = 1;
        }
        else {
          this.opacity = 0;
        }
      }
    } );

    // go invisible on a reset
    resetInProgressProperty.lazyLink( resetInProgress => {
      if ( resetInProgress ) {
        this.opacity = 0;
      }
    } );

    // @private {Animation|null} - animations that are used to fade and move this node, null when inactive
    this.movementAnimation = null;
    this.fadeAnimation = null;
  }

  /**
   * @private
   */
  initiateFadeIn( preFadeInDelay = 0 ) {

    // cancel any in-progress fade animations
    if ( this.fadeAnimation ) {
      this.fadeAnimation.stop();
    }

    // create and start the fade-in animation
    this.fadeAnimation = new Animation( {
      duration: FADE_TIME,
      delay: preFadeInDelay,
      targets: [
        {
          object: this,
          attribute: 'opacity',
          from: this.opacity,
          to: 1,
          easing: Easing.LINEAR
        }
      ]
    } );
    this.fadeAnimation.finishEmitter.addListener( () => {
      this.fadeAnimation = null;
    } );
    this.fadeAnimation.start();
  }

  /**
   * @private
   */
  initiateFadeOut() {

    // cancel any in-progress fade animations
    if ( this.fadeAnimation ) {
      this.fadeAnimation.stop();
    }

    // create and start the fade-out animation
    this.fadeAnimation = new Animation( {
      duration: FADE_TIME,
      targets: [
        {
          object: this,
          attribute: 'opacity',
          from: this.opacity,
          to: 0,
          easing: Easing.LINEAR
        }
      ]
    } );
    this.fadeAnimation.finishEmitter.addListener( () => {
      this.fadeAnimation = null;
    } );
    this.fadeAnimation.start();
  }

  /**
   * @private
   */
  initiateMovementToActivePosition() {

    // if the node is already on its way, there is no need to re-initiate
    if ( !this.movementAnimation ) {

      // create and start the fade-out animation
      this.movementAnimation = new Animation( {
        duration: TRAVEL_TIME,
        targets: [
          {
            object: this,
            attribute: 'centerY',
            from: this.centerY,
            to: this.activePosition.y,
            easing: Easing.QUINTIC_IN
          }
        ]
      } );
      this.movementAnimation.finishEmitter.addListener( () => {
        this.movementAnimation = null;
        this.initiateFadeOut();
      } );
      this.movementAnimation.start();
    }
  }
}

numberLineOperations.register( 'DynamicOperationDescription', DynamicOperationDescription );
export default DynamicOperationDescription;