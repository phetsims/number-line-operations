// Copyright 2020, University of Colorado Boulder

/**
 * OperationTrackingNumberLineNode is a specialization of SpatializedNumberLineNode that adds the ability to depict
 * labeled operations that have occurred between the points on the number line.
 */

import SpatializedNumberLineNode from '../../../../number-line-common/js/common/view/SpatializedNumberLineNode.js';
import numberLineOperations from '../../numberLineOperations.js';
import NumberLineOperationNode from './NumberLineOperationNode.js';

class OperationTrackingNumberLineNode extends SpatializedNumberLineNode {

  /**
   * {OperationTrackingNumberLine} numberLine - model of a number line
   * {Object} [options] - options that control the appearance of the number line
   * @public
   */
  constructor( numberLine, options ) {

    super( numberLine, options );

    const mapOfOperationsToOperationNodes = new Map();

    // function closure for updating the position of the remaining operation nodes
    const updateOperationNodePositions = () => {
      numberLine.operationsList.forEach( operation => {
        const operationNode = mapOfOperationsToOperationNodes.get( operation );
        operationNode.translation = numberLine.valueToModelPosition( numberLine.getOperationStartValue( operation ) );
      } );
    };

    numberLine.operationsList.addItemAddedListener( addedOperation => {

      const arrowNodeOptions =
        addedOperation.depictionRelativePosition ?
          { relativePosition: addedOperation.depictionRelativePosition } :
          {};

      const operationArrowNode = new NumberLineOperationNode(
        addedOperation,
        numberLine.showOperationLabelsProperty,
        numberLine.showOperationDescriptionsProperty,
        numberLine,
        arrowNodeOptions
      );
      this.addChild( operationArrowNode );
      mapOfOperationsToOperationNodes.set( addedOperation, operationArrowNode );

      // put the arrow node at the back of the z-order so that it is behind the points
      operationArrowNode.moveToBack();

      updateOperationNodePositions();
    } );
    numberLine.operationsList.addItemRemovedListener( removedOperation => {

      // remove the node that corresponds to the removed operation
      const operationNode = mapOfOperationsToOperationNodes.get( removedOperation );
      assert && assert( operationNode, 'no operation node found for removed operation' );
      this.removeChild( operationNode );
      operationNode.dispose();
      updateOperationNodePositions();
    } );
    numberLine.startingValueProperty.link( updateOperationNodePositions );
  }
}

numberLineOperations.register( 'OperationTrackingNumberLineNode', OperationTrackingNumberLineNode );
export default OperationTrackingNumberLineNode;