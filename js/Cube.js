
class Cube {
    constructor(shape, offsetX, offsetY) {
        this.shape = shape;
        this.offsetX = offsetX;
        this.offsetY = offsetY;
    }

    getPointAfterRotation(degrees) {
        return rotatePoint(0, 0, this.offsetX, this.offsetY, degrees);
    }

    rotate(degrees) {
        let point = this.getPointAfterRotation(degrees);
        this.setPos(point.x, point.y);
    }

    getOffsetX() {
        return this.offsetX;
    }

    getOffsetY() {
        return this.offsetY;
    }

    getX() {
        return this.shape.getX() + this.getOffsetX();
    }

    getY() {
        return this.shape.getY() + this.getOffsetY();
    }

    setPos(x, y) {
        this.offsetX = x;
        this.offsetY = y;
    }

    checkCollisionAt(x, y) {
        let cX = x + this.getOffsetX();
        let cY = y + this.getOffsetY();
        let shapeAt = this.shape.game.getShapeAt(cX, cY);

        if (shapeAt != null && shapeAt != this.shape) {
            if (this.shape.game.debugCollisions) {
                console.log("collision.shape");
                this.shape.game.render.drawCollisionDebug(cX, cY);
            }
            return true;
        }

        if (this.shape.game.isFloorAt(cY)) {
            if (this.shape.game.debugCollisions) {
                console.log("collision.floor");
                this.shape.game.render.drawCollisionDebug(cX, cY);
            }
            return true;
        }

        if (this.shape.game.isWallAt(cX)) {
            if (this.shape.game.debugCollisions) {
                console.log("collision.wall");
                this.shape.game.render.drawCollisionDebug(cX, cY);
            }
            return true;
        }

        return false;
    }
}