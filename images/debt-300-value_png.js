/* eslint-disable */
import simLauncher from '../../joist/js/simLauncher.js';
const image = new Image();
const unlock = simLauncher.createLock( image );
image.onload = unlock;
image.src = 'data:image/png;base64,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';
export default image;