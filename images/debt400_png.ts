/* eslint-disable */
import asyncLoader from '../../phet-core/js/asyncLoader.js';

const image = new Image();
const unlock = asyncLoader.createLock( image );
image.onload = unlock;
image.src = 'data:image/png;base64,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';
export default image;