// Copyright 2020, University of Colorado Boulder

/**
 * OperationTrackingNumberLineNode is a specialization of SpatializedNumberLineNode that adds the ability to depict
 * labeled operations that have occurred between the points on the number line.
 */

import SpatializedNumberLineNode from '../../../../number-line-common/js/common/view/SpatializedNumberLineNode.js';
import numberLineOperations from '../../numberLineOperations.js';
import NumberLineOperationNode from './NumberLineOperationNode.js';
import merge from '../../../../phet-core/js/merge.js';
import PointsOffScaleCondition from '../../../../number-line-common/js/common/model/PointsOffScaleCondition.js';

class OperationTrackingNumberLineNode extends SpatializedNumberLineNode {

  /**
   * {OperationTrackingNumberLine} numberLine - model of a number line
   * {Object} [options] - options that control the appearance of the number line
   * @public
   */
  constructor( numberLine, options ) {

    options = merge( {

      // this is here as documentation so that clients know how options are passed through to the operation nodes
      numberLineOperationNodeOptions: {},
      pointsOffScaleCondition: PointsOffScaleCondition.ALL

    }, options );

    super( numberLine, options );

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

      // the operation nodes should be behind the points and the labels
      numberLineOperationNode.moveToBack();
    } );
  }
}

numberLineOperations.register( 'OperationTrackingNumberLineNode', OperationTrackingNumberLineNode );
export default OperationTrackingNumberLineNode;
