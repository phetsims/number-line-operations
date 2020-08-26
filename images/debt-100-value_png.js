/* eslint-disable */
import simLauncher from '../../joist/js/simLauncher.js';
const image = new Image();
const unlock = simLauncher.createLock( image );
image.onload = unlock;
image.src = 'data:image/png;base64,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';
export default image;