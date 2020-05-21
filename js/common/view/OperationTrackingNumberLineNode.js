// Copyright 2020, University of Colorado Boulder

/**
 * OperationTrackingNumberLineNode is a specialization of SpatializedNumberLineNode that adds the ability to depict
 * labeled operations that have occurred between the points on the number line.
 */

import Property from '../../../../axon/js/Property.js';
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

      // this is here as documentation so that clients know how options are passed through to the operation nodes
      numberLineOperationNodeOptions: {}

    }, options );

    super( numberLine, options );

    const mapOfOperationsToOperationNodes = new Map();

    // function closure for updating the positions of the operation nodes
    const updateOperationNodePositions = () => {
      numberLine.operations.forEach( operation => {
        if ( operation.isActiveProperty.value ) {
          const operationNode = mapOfOperationsToOperationNodes.get( operation );
          operationNode.translation = numberLine.valueToModelPosition( numberLine.getOperationStartValue( operation ) );
        }
      } );
    };

    // create an operation node for each operation on the number line
    numberLine.operations.forEach( ( operation, index ) => {

      // nodes for even-indexed operations go above the number line, odd below
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

      // Update operation node positions when operations change.  The operations and nodes are permanent, no need to
      // unlink or dispose.
      Property.multilink(
        [ operation.isActiveProperty, operation.amountProperty, operation.operationTypeProperty ],
        updateOperationNodePositions
      );
    } );

    // monitor the properties of the number line that may affect the operation node positions and reposition when needed
    numberLine.startingValueProperty.link( updateOperationNodePositions );
    numberLine.centerPositionProperty.link( updateOperationNodePositions );
    numberLine.displayedRangeProperty.link( updateOperationNodePositions );
  }
}

numberLineOperations.register( 'OperationTrackingNumberLineNode', OperationTrackingNumberLineNode );
export default OperationTrackingNumberLineNode;