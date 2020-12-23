// Copyright 2020, University of Colorado Boulder

/**
 * SingleDualNumberLineSelector defines a Scenery node with two radio buttons that are used to choose between "single
 * number line" and "dual number line" modes.
 *
 * @author John Blanco (PhET Interactive Simulations)
 */

import merge from '../../../../phet-core/js/merge.js';
import ArrowNode from '../../../../scenery-phet/js/ArrowNode.js';
import VBox from '../../../../scenery/js/nodes/VBox.js';
import RectangularRadioButtonGroup from '../../../../sun/js/buttons/RectangularRadioButtonGroup.js';
import numberLineOperations from '../../numberLineOperations.js';

// constants
const ARROW_ICON_LENGTH = 40;
const ARROW_ICON_OPTIONS = {
  doubleHead: true,
  tailWidth: 1
};

class SingleDualNumberLineSelector extends RectangularRadioButtonGroup {

  /**
   * @param {BooleanProperty} secondNumberLineVisibleProperty
   * @param {Object} [options]
   */
  constructor( secondNumberLineVisibleProperty, options ) {

    options = merge( {
      buttonContentXMargin: 5,
      buttonContentYMargin: 10,
      baseColor: 'white',
      selectedLineWidth: 2,
      deselectedLineWidth: 0.5,
      deselectedButtonOpacity: 0.5,
      orientation: 'horizontal',
      spacing: 12,
      touchAreaXDilation: 2,
      touchAreaYDilation: 2
    }, options );

    // create the single/dual number line selection icons
    const singleNumberLineIcon = new ArrowNode( -ARROW_ICON_LENGTH / 2, 0, ARROW_ICON_LENGTH / 2, 0, ARROW_ICON_OPTIONS );
    const dualNumberLineIcon = new VBox( {
      children: [
        new ArrowNode( -ARROW_ICON_LENGTH / 2, 0, ARROW_ICON_LENGTH / 2, 0, ARROW_ICON_OPTIONS ),
        new ArrowNode( -ARROW_ICON_LENGTH / 2, 0, ARROW_ICON_LENGTH / 2, 0, ARROW_ICON_OPTIONS )
      ],
      spacing: 10
    } );

    // radio button descriptor items
    const items = [
      {
        value: false,
        node: singleNumberLineIcon
      },
      {
        value: true,
        node: dualNumberLineIcon
      }
    ];

    super( secondNumberLineVisibleProperty, items, options );
  }
}

numberLineOperations.register( 'SingleDualNumberLineSelector', SingleDualNumberLineSelector );
export default SingleDualNumberLineSelector;