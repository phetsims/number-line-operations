/* eslint-disable */
import simLauncher from '../../joist/js/simLauncher.js';
const image = new Image();
const unlock = simLauncher.createLock( image );
image.onload = unlock;
image.src = 'data:image/png;base64,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';
export default image;