// Copyright 2020, University of Colorado Boulder

/**
 * OperationTrackingNumberLineNode is a specialization of SpatializedNumberLineNode that adds the ability to depict
 * labeled operations that have occurred between the points on the number line.
 */

import SpatializedNumberLineNode from '../../../../number-line-common/js/common/view/SpatializedNumberLineNode.js';
import numberLineOperations from '../../numberLineOperations.js';
import OperationArrowNode from './OperationArrowNode.js';

class OperationTrackingNumberLineNode extends SpatializedNumberLineNode {

  /**
   * {OperationTrackingNumberLine} numberLine - model of a number line
   * {Object} [options] - options that control the appearance of the number line
   * @public
   */
  constructor( numberLine, options ) {

    super( numberLine, options );

    const mapOfOperationsToOperationNodes = new Map();

    numberLine.operationsList.addItemAddedListener( addedOperation => {

      const arrowNodeOptions =
        addedOperation.depictionRelativePosition ?
          { relativePosition: addedOperation.depictionRelativePosition } :
          {};

      const operationArrowNode = new OperationArrowNode(
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
    } );
    numberLine.operationsList.addItemRemovedListener( removedOperation => {
      const operationNode = mapOfOperationsToOperationNodes.get( removedOperation );
      assert && assert( operationNode, 'no operation node found for removed operation' );
      this.removeChild( operationNode );
      operationNode.dispose();
    } );
  }
}

numberLineOperations.register( 'OperationTrackingNumberLineNode', OperationTrackingNumberLineNode );
export default OperationTrackingNumberLineNode;