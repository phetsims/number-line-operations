// Copyright 2020, University of Colorado Boulder

/**
 * Constants used throughout this simulation.
 *
 * @author John Blanco
 */

import PhetFont from '../../../scenery-phet/js/PhetFont.js';
import numberLineOperations from '../numberLineOperations.js';

// constants
const CHECKBOX_BOX_WIDTH = 17;

const NLOConstants = {

  SCREEN_VIEW_X_MARGIN: 15,
  SCREEN_VIEW_Y_MARGIN: 15,

  // checkbox
  CHECKBOX_OPTIONS: { boxWidth: CHECKBOX_BOX_WIDTH },
  CHECKBOX_TEXT_OPTIONS: {
    font: new PhetFont( 16 ),
    maxWidth: 160
  },
  CHECKBOX_BOX_WIDTH: CHECKBOX_BOX_WIDTH,
  CHECKBOX_DILATION: 6
};

numberLineOperations.register( 'NLOConstants', NLOConstants );
export default NLOConstants;