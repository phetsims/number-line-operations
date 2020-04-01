/* eslint-disable */
const img = new Image();
window.phetImages.push( img );
img.src = 'data:image/png;base64,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';
export default img;
