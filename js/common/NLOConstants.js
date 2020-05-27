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

  // shared constants used for consistent layout
  SCREEN_VIEW_X_MARGIN: 15,
  SCREEN_VIEW_Y_MARGIN: 15,
  CHECKBOX_SPACING: 12,
  OPERATION_ENTRY_CAROUSEL_LEFT_INSET: 60
};

numberLineOperations.register( 'NLOConstants', NLOConstants );
export default NLOConstants;