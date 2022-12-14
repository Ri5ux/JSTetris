/**
 * Convert angle in degrees to radians.
 */
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

    return { x: Math.round(nx), y: Math.round(ny) };
}

function randomHexColor() {
    let chars = '0123456789ABCDEF';
    let color = '#';

    for (var i = 0; i < 6; i++) {
        color += chars[Math.floor(Math.random() * 16)];
    }

    return color;
}

function randomInteger(max) {
    return Math.floor(Math.random() * max);
}

function sleep(milliseconds) {
    var start = new Date().getTime();

    for (var i = 0; i < 1e7; i++) {
        if ((new Date().getTime() - start) > milliseconds) {
            break;
        }
    }
}

function arrayRemove(array, object) {
    return array.filter(function (obj) {
        return obj != object;
    });
}