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
      numberLine.operationProperties.forEach( operationProperty => {
        const operation = operationProperty.value;
        if ( operation ) {
          const operationNode = mapOfOperationsToOperationNodes.get( operation );
          operationNode.translation = numberLine.valueToModelPosition( numberLine.getOperationStartValue( operation ) );
        }
      } );
    };

    // add and remove operation nodes as operations come and go from the number line
    numberLine.operationProperties.forEach( ( operationProperty, index ) => {
      operationProperty.link( ( operation, previousOperation ) => {
        if ( operation ) {

          // The nodes for even-indexed operations go on top of the number line, odd on the bottom.
          const operationNodeOptions = index % 2 === 1 ?
            { relativePosition: NumberLineOperationNode.RelativePositions.BELOW_NUMBER_LINE } :
            {};

          // add the node
          const numberLineOperationNode = new NumberLineOperationNode(
            operation,
            numberLine.showOperationLabelsProperty,
            numberLine.showOperationDescriptionsProperty,
            numberLine,
            merge( operationNodeOptions, options.numberLineOperationNodeOptions )
          );
          this.addChild( numberLineOperationNode );
          mapOfOperationsToOperationNodes.set( operation, numberLineOperationNode );

          // Add a listener to the operation properties that will update operation node positions on changes.
          operation.amountProperty.link( updateOperationNodePositions );
          operation.operationTypeProperty.link( updateOperationNodePositions );
        }

        // The presence of a value for the previous operation indicates that an operation was removed from the number
        // line.
        if ( previousOperation ) {
          this.removeChild( mapOfOperationsToOperationNodes.get( previousOperation ) );
          mapOfOperationsToOperationNodes.delete( previousOperation );
          updateOperationNodePositions();
          previousOperation.amountProperty.unlink( updateOperationNodePositions );
          previousOperation.operationTypeProperty.unlink( updateOperationNodePositions );
        }
      } );
    } );

    // update the operation positions if things change about the number line that might affect them
    numberLine.startingValueProperty.link( updateOperationNodePositions );
    numberLine.centerPositionProperty.link( updateOperationNodePositions );
  }
}

numberLineOperations.register( 'OperationTrackingNumberLineNode', OperationTrackingNumberLineNode );
export default OperationTrackingNumberLineNode;