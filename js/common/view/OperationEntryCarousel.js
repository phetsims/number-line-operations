// Copyright 2020, University of Colorado Boulder

/**
 * carousel and page control for entering operations onto a number line
 */

import merge from '../../../../phet-core/js/merge.js';
import Node from '../../../../scenery/js/nodes/Node.js';
import Carousel from '../../../../sun/js/Carousel.js';
import PageControl from '../../../../sun/js/PageControl.js';
import numberLineOperations from '../../numberLineOperations.js';
import OperationEntryControl from './OperationEntryControl.js';

class OperationEntryCarousel extends Node {

  constructor( numberLine, options ) {

    options = merge( {
      entryControl1Options: {
        initialValue: 100
      },
      entryControl2Options: {
        initialValue: 100
      }
    }, options );

    // @private {OperationEntryControl[]} - operation entry controls
    const operationEntryControls = [
      new OperationEntryControl(
        numberLine.operations[ 0 ],
        options.entryControl1Options
      ),
      new OperationEntryControl(
        numberLine.operations[ 1 ],
        options.entryControl2Options
      )
    ];

    // carousel in which the operation entry controls reside
    const operationEntryCarousel = new Carousel( operationEntryControls, {
      orientation: 'horizontal',
      itemsPerPage: 1
    } );

    // automatically advance the carousel when the first operation is added
    numberLine.operations[ 0 ].isActiveProperty.link( isActive => {
      if ( isActive ) {
        this.operationEntryCarousel.pageNumberProperty.value = 1;
      }
    } );

    // page indicator
    const pageControl = new PageControl(
      operationEntryCarousel.numberOfPages,
      operationEntryCarousel.pageNumberProperty,
      {
        orientation: 'horizontal',
        interactive: true,
        centerX: operationEntryCarousel.centerX,
        top: operationEntryCarousel.bottom + 10
      }
    );

    super( merge( { children: [ operationEntryCarousel, pageControl ] }, options ) );

    // @public {NumberProperty} (read-only) - make the page number visible to outside observers
    this.selectedPageProperty = operationEntryCarousel.pageNumberProperty;

    // @private - make these into properties so that they can be reset
    this.operationEntryControls = operationEntryControls;
    this.operationEntryCarousel = operationEntryCarousel;
  }

  /**
   * restore initial state
   * @public
   */
  reset() {
    this.operationEntryCarousel.pageNumberProperty.reset();
    this.operationEntryControls.forEach( control => {control.clear(); } );
  }
}

numberLineOperations.register( 'OperationEntryCarousel', OperationEntryCarousel );
export default OperationEntryCarousel;