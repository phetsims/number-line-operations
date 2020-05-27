// Copyright 2020, University of Colorado Boulder

/**
 * Constants used throughout this simulation.
 *
 * @author John Blanco
 */

import ScreenView from '../../../joist/js/ScreenView.js';
import NLCConstants from '../../../number-line-common/js/common/NLCConstants.js';
import numberLineOperations from '../numberLineOperations.js';

const NLOConstants = {

  // layout bounds used for all screens
  LAYOUT_BOUNDS: ScreenView.DEFAULT_LAYOUT_BOUNDS,

  // shared constants used for consistent layout between screens
  NUMBER_LINE_WIDTH: ScreenView.DEFAULT_LAYOUT_BOUNDS.width - 200,
  SCREEN_VIEW_X_MARGIN: 15,
  SCREEN_VIEW_Y_MARGIN: 15,
  CHECKBOX_SPACING: 12,
  OPERATION_ENTRY_CAROUSEL_LEFT_INSET: 60,
  ERASER_BUTTON_ICON_WIDTH: 32,
  ERASER_BUTTON_INSET: 12,
  ACCORDION_BOX_COMMON_OPTIONS: {
    fill: 'white',
    showTitleWhenExpanded: false,
    cornerRadius: NLCConstants.ACCORDION_BOX_CORNER_RADIUS,
    buttonXMargin: 8,
    buttonYMargin: 6,
    expandCollapseButtonOptions: {
      touchAreaXDilation: 15,
      touchAreaYDilation: 15,
      mouseAreaXDilation: 5,
      mouseAreaYDilation: 5
    }
  }
};

numberLineOperations.register( 'NLOConstants', NLOConstants );
export default NLOConstants;