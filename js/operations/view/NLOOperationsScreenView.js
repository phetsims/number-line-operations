// Copyright 2020, University of Colorado Boulder

/**
 * @author John Blanco
 */

import ScreenView from '../../../../joist/js/ScreenView.js';
import EraserButton from '../../../../scenery-phet/js/buttons/EraserButton.js';
import ResetAllButton from '../../../../scenery-phet/js/buttons/ResetAllButton.js';
import Image from '../../../../scenery/js/nodes/Image.js';
import Carousel from '../../../../sun/js/Carousel.js';
import PageControl from '../../../../sun/js/PageControl.js';
import NLOConstants from '../../common/NLOConstants.js';
import OperationTrackingNumberLineNode from '../../common/view/OperationTrackingNumberLineNode.js';
import numberLineOperations from '../../numberLineOperations.js';
import mockupImage from '../../../images/operations-screen-mockup_png.js';
import OperationEntryControl from './OperationEntryControl.js';

class NLOOperationsScreenView extends ScreenView {

  /**
   * @param {NLOOperationsModel} model
   */
  constructor( model, tandem ) {

    super( {
      tandem: tandem
    } );

    // mockup - temporary, for design and layout
    this.addChild( new Image( mockupImage, {
      center: NLOConstants.LAYOUT_BOUNDS.center,
      minWidth: NLOConstants.LAYOUT_BOUNDS.width,
      maxWidth: NLOConstants.LAYOUT_BOUNDS.width,
      opacity: 0.2
    } ) );

    // number line node
    const numberLineNode = new OperationTrackingNumberLineNode( model.numberLine, {
      pointNodeOptions: {
        radius: 6
      }
    } );
    this.addChild( numberLineNode );

    // erase button
    const eraserButton = new EraserButton( {
      iconWidth: 36,
      left: numberLineNode.right + 8,
      centerY: model.numberLine.centerPosition.y
    } );
    this.addChild( eraserButton );

    // operation entry controls
    const operationEntryControls = [
      new OperationEntryControl( model.numberLine ),
      new OperationEntryControl( model.numberLine )
    ];

    // carousel in which the operation entry controls reside
    const operationEntryCarousel = new Carousel( operationEntryControls, {
      orientation: 'horizontal',
      itemsPerPage: 1,
      right: this.layoutBounds.maxX - 50,
      top: 15
    } );
    this.addChild( operationEntryCarousel );

    // page indicator
    this.addChild( new PageControl( operationEntryCarousel.numberOfPages, operationEntryCarousel.pageNumberProperty, {
      orientation: 'horizontal',
      centerX: operationEntryCarousel.centerX,
      top: operationEntryCarousel.bottom + 10
    } ) );

    // reset all button
    const resetAllButton = new ResetAllButton( {
      listener: () => {
        this.interruptSubtreeInput(); // cancel interactions that may be in progress
        model.reset();
        this.reset();
      },
      right: this.layoutBounds.maxX - NLOConstants.SCREEN_VIEW_X_MARGIN,
      bottom: this.layoutBounds.maxY - NLOConstants.SCREEN_VIEW_Y_MARGIN,
      tandem: tandem.createTandem( 'resetAllButton' )
    } );
    this.addChild( resetAllButton );
  }

  /**
   * Resets the view.
   * @public
   */
  reset() {
    //TODO
  }

  /**
   * Steps the view.
   * @param {number} dt - time step, in seconds
   * @public
   */
  step( dt ) {
    //TODO
  }
}

numberLineOperations.register( 'NumberLineOperationsScreenView', NLOOperationsScreenView );
export default NLOOperationsScreenView;