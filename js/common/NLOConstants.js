// Copyright 2020, University of Colorado Boulder

/**
 * Constants used throughout this simulation.
 *
 * @author John Blanco
 */

import ScreenView from '../../../joist/js/ScreenView.js';
import numberLineOperations from '../numberLineOperations.js';

const NLOConstants = {

  // layout bounds used for all screens
  LAYOUT_BOUNDS: ScreenView.DEFAULT_LAYOUT_BOUNDS,

  // shared constants used for consistent layout between screens
  NUMBER_LINE_WIDTH: ScreenView.DEFAULT_LAYOUT_BOUNDS.width - 200,
  SCREEN_VIEW_X_MARGIN: 15,
  SCREEN_VIEW_Y_MARGIN: 15,
  CHECKBOX_SPACING: 12,
  OPERATION_ENTRY_CAROUSEL_LEFT_INSET: 70,
  ERASER_BUTTON_ICON_WIDTH: 32,
  ERASER_BUTTON_INSET: 12,

  // length of time between activating and then deactivating it when the timed deactivation feature is in use
  OPERATION_AUTO_DEACTIVATE_TIME: 4000, // in milliseconds

  // fade out time for operations that are being deactivated
  OPERATION_FADE_OUT_TIME: 1500 // in milliseconds
};

numberLineOperations.register( 'NLOConstants', NLOConstants );
export default NLOConstants;
