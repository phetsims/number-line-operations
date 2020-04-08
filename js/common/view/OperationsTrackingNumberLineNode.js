// Copyright 2020, University of Colorado Boulder

/**
 * OperationsTrackingNumberLineNode is a specialization of SpatializedNumberLineNode that adds the ability to depict
 * labeled operations that have occurred between the points on the number line.
 */

import SpatializedNumberLineNode from '../../../../number-line-common/js/common/view/SpatializedNumberLineNode.js';
import numberLineOperations from '../../numberLineOperations.js';

class OperationsTrackingNumberLineNode extends SpatializedNumberLineNode {

  /**
   * {NumberLine} numberLine - model of a number line
   * {Object} [options] - options that control the appearance of the number line
   * @public
   */
  constructor( numberLine, options ) {

    super( numberLine, options );

  }
}

numberLineOperations.register( 'OperationsTrackingNumberLineNode', OperationsTrackingNumberLineNode );
export default OperationsTrackingNumberLineNode;