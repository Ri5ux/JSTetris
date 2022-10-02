
function toRadians(degrees) {
    return (Math.PI / 180) * degrees;
}

/**
 * Function to rotate a point around a point of
 * origin by angle in degrees. Positive for CW.
 * 
 * cx - Origin X
 * cy - Origin Y
 * x - Point X
 * y - Point Y
 * angle - Rotation angle in degrees
 */
function rotatePoint(cx, cy, x, y, angle) {
    var radians = this.toRadians(angle);
    var cos = Math.cos(radians);
    var sin = Math.sin(radians);
    var nx = (cos * (x - cx)) + (sin * (y - cy)) + cx;
    var ny = (cos * (y - cy)) - (sin * (x - cx)) + cy;
    
    return [nx, ny];
}