// Copyright 2020, University of Colorado Boulder

/**
 * @author John Blanco
 */

import ScreenView from '../../../../joist/js/ScreenView.js';
import ResetAllButton from '../../../../scenery-phet/js/buttons/ResetAllButton.js';
import Image from '../../../../scenery/js/nodes/Image.js';
import NLOConstants from '../../common/NLOConstants.js';
import OperationsTrackingNumberLineNode from '../../common/view/OperationsTrackingNumberLineNode.js';
import numberLineOperations from '../../numberLineOperations.js';
import mockupImage from '../../../images/operations-screen-mockup_png.js';

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
    this.addChild( new OperationsTrackingNumberLineNode( model.numberLine, {
      pointNodeOptions: {
        radius: 6
      }
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