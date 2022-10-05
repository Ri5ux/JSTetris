
class Shape {
    constructor(game, definition) {
        this.game = game;
        this.x = 0;
        this.y = 0;
        this.cubes = [];
        this.frozen = false;
        this.color =  randomHexColor();
        this.initialize(definition);
    }

    initialize(definition) {
        let shape = this;

        definition.cubeOffsets.forEach(function (cube) {
            shape.cubes.push(new Cube(shape, cube[0], cube[1]));
        });
    }

    setPos(x, y) {
        this.x = x;
        this.y = y;
    }

    getX() {
        return this.x;
    }

    getY() {
        return this.y;
    }

    tryRotate(degrees) {
        let result = true;

        this.cubes.forEach(function (cube) {
            let point = cube.getPointAfterRotation(degrees);
            let collision = cube.checkCollisionAt(cube.shape.getX() + point.x, cube.shape.getY() + point.y);

            if (collision) {
                result = false;
            }
        });

        return result;
    }

    rotate(degrees) {
        if (this.tryRotate(degrees)) {
            this.cubes.forEach(function (cube) {
                cube.rotate(degrees);
            });
        }
    }

    draw() {
        var shape = this;

        this.cubes.forEach(function (cube) {
            shape.game.render.drawCube(1 + cube.getX(), cube.getY(), 1, 1, shape.game.debugCollisions ? "rgba(0, 0, 0, 0)" : shape.color);
        });
    }

    getMin() {
        let minX = 0;
        let minY = 0;

        this.cubes.forEach(function (cube) {
            if (cube.getOffsetX() < minX) minX = cube.getOffsetX();
            if (cube.getOffsetY() < minY) minY = cube.getOffsetY();
        });

        return { x: minX, y: minY };
    }

    getMax() {
        let maxX = 0;
        let maxY = 0;

        this.cubes.forEach(function (cube) {
            if (cube.getOffsetX() > maxX) maxX = cube.getOffsetX();
            if (cube.getOffsetY() > maxY) maxY = cube.getOffsetY();
        });

        return { x: maxX, y: maxY };
    }

    getWidth() {
        return this.getMin().x - this.getMax().x;
    }

    getHeight() {
        return this.getMin().y - this.getMax().y;
    }

    checkCollisionAt(x, y) {
        let collision = false;
        let shape = this;

        this.cubes.forEach(function(cube) {
            let cX = x + cube.getOffsetX();
            let cY = y + cube.getOffsetY();

            if (shape.game.debugCollisions) {
                console.log(cX + ", " + cY);
                shape.game.render.drawCollisionDebugPreCheck(cX, cY);
            }

            if (cube.checkCollisionAt(x, y)) {
                collision = true;
            }
        });

        return collision;
    }

    move(moveX, moveY) {
        if (!this.frozen) {
            let shape = this;
            let nX = this.getX() + moveX;
            let nY = this.getY() + moveY;
            let isVerticalMovement = moveY != 0;
            let collision = this.checkCollisionAt(nX, nY);

            if (isVerticalMovement && collision) {
                shape.freeze();
            }

            if (!collision) {
                shape.setPos(nX, nY);
            }
            
        }
    }

    moveLeft() {
        this.move(-1, 0);
    }

    moveRight() {
        this.move(1, 0);
    }

    moveDown() {
        this.move(0, 1);
    }

    freeze() {
        this.frozen = true;
        this.game.activeShape = null;
    }
}
