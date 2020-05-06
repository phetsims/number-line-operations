// Copyright 2020, University of Colorado Boulder

/**
 * Constants used throughout this simulation.
 *
 * @author John Blanco
 */

import ScreenView from '../../../joist/js/ScreenView.js';
import PhetFont from '../../../scenery-phet/js/PhetFont.js';
import numberLineOperations from '../numberLineOperations.js';

// constants
const CHECKBOX_BOX_WIDTH = 22;

const NLOConstants = {

  // layout bounds used for all screens
  LAYOUT_BOUNDS: ScreenView.DEFAULT_LAYOUT_BOUNDS,

  // checkbox options
  CHECKBOX_OPTIONS: { boxWidth: CHECKBOX_BOX_WIDTH },
  CHECKBOX_TEXT_OPTIONS: {
    font: new PhetFont( 18 ),
    maxWidth: 200
  },
  CHECKBOX_BOX_WIDTH: CHECKBOX_BOX_WIDTH,
  CHECKBOX_DILATION: 6,

  // random shared constants
  SCREEN_VIEW_X_MARGIN: 15,
  SCREEN_VIEW_Y_MARGIN: 15
};

numberLineOperations.register( 'NLOConstants', NLOConstants );
export default NLOConstants;