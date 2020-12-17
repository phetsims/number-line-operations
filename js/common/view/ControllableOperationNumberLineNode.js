// Copyright 2020, University of Colorado Boulder

/**
 * ControllableOperationNumberLineNode creates an OperationTrackingNumberLineNode and adds point controllers so that the
 * user can control point values and thus manipulate the operations.
 *
 * @author John Blanco (PhET Interactive Simulations)
 */

import PointControllerNode from '../../../../number-line-common/js/common/view/PointControllerNode.js';
import merge from '../../../../phet-core/js/merge.js';
import Node from '../../../../scenery/js/nodes/Node.js';
import numberLineOperations from '../../numberLineOperations.js';
import OperationTrackingNumberLineNode from './OperationTrackingNumberLineNode.js';

class ControllableOperationNumberLineNode extends Node {

  /**
   * @param {OperationTrackingNumberLine} numberLine
   * @param {PointController} initialValuePointController
   * @param {ObservableArrayDef<PointController>} pointControllerObservableArray
   * @param {Bounds2} layoutBounds - the bounds into which this must be laid out
   * @param {Object} [options]
   */
  constructor( numberLine, initialValuePointController, pointControllerObservableArray, layoutBounds, options ) {

    options = merge( {
      numberLineNodeOptions: {
        pointNodeOptions: {
          radius: 6
        }
      }
    }, options );

    super();

    // layer where the point controllers go so that they stay behind the points
    const pointControllerLayer = new Node();
    this.addChild( pointControllerLayer );

    // node that represents the number line itself
    const numberLineNode = new OperationTrackingNumberLineNode( numberLine, options.numberLineNodeOptions );
    this.addChild( numberLineNode );

    // point controller for the starting point on the number line, which is always present
    pointControllerLayer.addChild( new PointControllerNode( initialValuePointController ) );

    // Add and remove nodes for the point controllers that come and go from the number line.
    pointControllerObservableArray.addItemAddedListener( addedPointController => {
      const pointControllerNode = new PointControllerNode( addedPointController );
      pointControllerLayer.addChild( pointControllerNode );
      const removalListener = removedPointController => {
        if ( removedPointController === addedPointController ) {
          pointControllerLayer.removeChild( pointControllerNode );
          pointControllerNode.dispose();
          pointControllerObservableArray.removeItemRemovedListener( removalListener );
        }
      };
      pointControllerObservableArray.addItemRemovedListener( removalListener );
    } );
  }

  /**
   * @public
   */
  reset() {
    this.operationEntryCarousel.reset();
  }
}

numberLineOperations.register( 'ControllableOperationNumberLineNode', ControllableOperationNumberLineNode );
export default ControllableOperationNumberLineNode;
