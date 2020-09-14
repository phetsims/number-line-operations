/* eslint-disable */
import simLauncher from '../../joist/js/simLauncher.js';

const image = new Image();
const unlock = simLauncher.createLock( image );
image.onload = unlock;
image.src = 'data:image/png;base64,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';
export default image;