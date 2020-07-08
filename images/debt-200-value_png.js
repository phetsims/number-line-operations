/* eslint-disable */
import simLauncher from '../../joist/js/simLauncher.js';
const image = new Image();
const unlock = simLauncher.createLock( image );
image.onload = unlock;
image.src = 'data:image/png;base64,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';
export default image;