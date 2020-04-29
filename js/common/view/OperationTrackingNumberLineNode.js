// Copyright 2020, University of Colorado Boulder

/**
 * OperationTrackingNumberLineNode is a specialization of SpatializedNumberLineNode that adds the ability to depict
 * labeled operations that have occurred between the points on the number line.
 */

import SpatializedNumberLineNode from '../../../../number-line-common/js/common/view/SpatializedNumberLineNode.js';
import numberLineOperations from '../../numberLineOperations.js';
import NumberLineOperationNode from './NumberLineOperationNode.js';
import merge from '../../../../phet-core/js/merge.js';

class OperationTrackingNumberLineNode extends SpatializedNumberLineNode {

  /**
   * {OperationTrackingNumberLine} numberLine - model of a number line
   * {Object} [options] - options that control the appearance of the number line
   * @public
   */
  constructor( numberLine, options ) {

    options = merge( {

      // this is here essentially as documentation, so that clients know options are passed through
      numberLineOperationNodeOptions: {}
    }, options );

    super( numberLine, options );

    const mapOfOperationsToOperationNodes = new Map();

    // function closure for updating the positions of the operation nodes
    const updateOperationNodePositions = () => {
      numberLine.operationsList.forEach( operation => {
        const operationNode = mapOfOperationsToOperationNodes.get( operation );
        operationNode.translation = numberLine.valueToModelPosition( numberLine.getOperationStartValue( operation ) );
      } );
    };

    // add operation nodes as operations are added to the number line
    numberLine.operationsList.addItemAddedListener( addedOperation => {

      const operationNodeOptions =
        addedOperation.depictionRelativePosition ?
          { relativePosition: addedOperation.depictionRelativePosition } :
          {};

      const numberLineOperationNode = new NumberLineOperationNode(
        addedOperation,
        numberLine.showOperationLabelsProperty,
        numberLine.showOperationDescriptionsProperty,
        numberLine,
        merge( operationNodeOptions, options.numberLineOperationNodeOptions )
      );
      this.addChild( numberLineOperationNode );
      mapOfOperationsToOperationNodes.set( addedOperation, numberLineOperationNode );

      // put the arrow node at the back of the z-order so that it is behind the points
      numberLineOperationNode.moveToBack();

      updateOperationNodePositions();
    } );

    // remove operation nodes when operations are removed from the number line
    numberLine.operationsList.addItemRemovedListener( removedOperation => {

      // remove the node that corresponds to the removed operation
      const operationNode = mapOfOperationsToOperationNodes.get( removedOperation );
      assert && assert( operationNode, 'no operation node found for removed operation' );
      this.removeChild( operationNode );
      operationNode.dispose();
      updateOperationNodePositions();
    } );

    // update the operation positions if things change about the number line that might affect them
    numberLine.startingValueProperty.link( updateOperationNodePositions );
    numberLine.centerPositionProperty.link( updateOperationNodePositions );
  }
}

numberLineOperations.register( 'OperationTrackingNumberLineNode', OperationTrackingNumberLineNode );
export default OperationTrackingNumberLineNode;