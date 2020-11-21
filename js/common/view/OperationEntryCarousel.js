// Copyright 2020, University of Colorado Boulder

/**
 * carousel and page control for entering operations onto a number line
 */

import Enumeration from '../../../../phet-core/js/Enumeration.js';
import merge from '../../../../phet-core/js/merge.js';
import Node from '../../../../scenery/js/nodes/Node.js';
import Color from '../../../../scenery/js/util/Color.js';
import Carousel from '../../../../sun/js/Carousel.js';
import PageControl from '../../../../sun/js/PageControl.js';
import numberLineOperations from '../../numberLineOperations.js';
import OperationEntryControl from './OperationEntryControl.js';

// constants
const DEFAULT_THEME_COLOR = new Color( 153, 206, 255 );
const PageControlPosition = Enumeration.byKeys( [ 'ABOVE', 'BELOW' ] );

class OperationEntryCarousel extends Node {

  /**
   * @param {OperationTrackingNumberLine} numberLine
   * @param {Object} [options]
   */
  constructor( numberLine, options ) {

    // Get the theme color defined before working on the other options, since there are some dependencies here.
    options = merge( { themeColor: DEFAULT_THEME_COLOR }, options );

    // Define the rest of the options.
    options = merge( {
      entryControl1Options: {
        buttonBaseColor: options.themeColor
      },
      entryControl2Options: {
        buttonBaseColor: options.themeColor
      },
      pageControlPosition: PageControlPosition.BELOW
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
    const carousel = new Carousel( operationEntryControls, {
      orientation: 'horizontal',
      itemsPerPage: 1,
      fill: new Color( 255, 255, 255, 0.5 ),
      stroke: options.themeColor,
      buttonColor: options.themeColor,
      buttonDisabledColor: new Color( 255, 255, 255, 0.1 )
    } );

    // page indicator
    const pageControl = new PageControl(
      carousel.numberOfPages,
      carousel.pageNumberProperty,
      {
        orientation: 'horizontal',
        interactive: true,
        centerX: carousel.centerX
      }
    );
    if ( options.pageControlPosition === PageControlPosition.BELOW ) {
      pageControl.top = carousel.bottom + 10;
    }
    else {
      pageControl.bottom = carousel.top - 10;
    }

    super(
      merge(
        {
          children: [ carousel, pageControl ],
          stroke: options.themeColor,
          buttonColor: options.themeColor
        },
        options )
    );

    // @public {NumberProperty} (read-only) - make the page number visible to outside observers
    this.selectedPageProperty = carousel.pageNumberProperty;

    // @private - make these into properties so that they can be reset
    this.operationEntryControls = operationEntryControls;
    this.carousel = carousel;

    // @private - make this available so that it can be used in a method
    this.numberLine = numberLine;
  }

  /**
   * Make sure that the operation with the provided endpoint is the one that is being shown in the carousel.
   * @param {NumberLinePoint} endpoint
   * @public
   */
  showOperationWithEndpoint( endpoint ) {
    const endpointIndex = this.numberLine.endpoints.indexOf( endpoint );
    if ( endpointIndex >= 0 ) {
      this.selectedPageProperty.set( endpointIndex );
    }
  }

  /**
   * restore initial state
   * @public
   */
  reset() {
    this.carousel.pageNumberProperty.reset();
    this.operationEntryControls.forEach( control => {control.reset(); } );
  }
}

// statics
OperationEntryCarousel.PageControlPosition = PageControlPosition;

numberLineOperations.register( 'OperationEntryCarousel', OperationEntryCarousel );
export default OperationEntryCarousel;