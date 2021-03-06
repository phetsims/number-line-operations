// Copyright 2020-2021, University of Colorado Boulder

/**
 * enum of possible operations that can be performed through interaction with an operation-tracking number line
 *
 * @author John Blanco (PhET Interactive Simulations)
 */

import Enumeration from '../../../../phet-core/js/Enumeration.js';
import numberLineOperations from '../../numberLineOperations.js';

const Operation = Enumeration.byKeys( [ 'ADDITION', 'SUBTRACTION' ] );
numberLineOperations.register( 'Operation', Operation );
export default Operation;