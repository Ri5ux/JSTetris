
class Game {
    constructor(name) {
        this.name = name;
        this.canvas = document.getElementById(this.name);
        this.context = this.canvas.getContext('2d');
        this.input = new InputHandler(this.canvas, this);
        this.render = new Draw(this, this.canvas, this.context);
        this.ticks = 1;
        this.partialTicks = 1;
        this.pxInMM = 1;
        this.cubeSize = 40;
        this.shapes = [];
        this.debugCollisions = false;
        this.collisions = [];
        this.activeShape = null;
        this.dpi = window.devicePixelRatio;
        this.adjustDPI();
        this.init();
    }

    init() {
        this.canvas.style.background = GameConstants.game.background;
    }

    start() {
        var game = this;

        setInterval(function () {
            game.update();
        }, 20);
    }

    update() {
        this.ticks++;

        if (this.ticks % ((20 * 1)) == 0) {
            this.updateLevel();
        }

        if (this.ticks % (20 * 20) == 0) {

        }

        this.renderGame();
    }

    updateLevel() {
        if (this.activeShape == null) {
            this.createNewShape();
        }

        if (this.activeShape != null) {
            this.activeShape.moveDown();
        }
    }

    renderGame() {
        this.partialTicks++;
        this.clearCanvas();

        this.shapes.forEach(function (shape) {
            shape.draw();
        });
        this.render.drawGrid();
    }

    clearCanvas() {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }

    adjustDPI() {
        let h = +getComputedStyle(this.canvas).getPropertyValue("height").slice(0, -2);
        let w = +getComputedStyle(this.canvas).getPropertyValue("width").slice(0, -2);
        this.canvas.setAttribute('height', h * this.dpi);
        this.canvas.setAttribute('width', w * this.dpi);
    }

    getCanvasCenterH() {
        return Math.floor(this.getCanvasCubeWidth() / 2);
    }

    getCanvasCubeWidth() {
        return Math.floor(this.canvas.width / this.cubeSize);
    }

    getCanvasCubeHeight() {
        return Math.floor(this.canvas.width / this.cubeSize);
    }

    addShape(shapeObj) {
        this.activeShape = shapeObj;
        shapeObj.setPos(this.getCanvasCenterH(), 2);
        this.shapes.push(shapeObj);
    }

    createNewShape() {
        let type = SHAPES[randomInteger(SHAPES.length - 1)];
        this.addShape(type.create(this));
    }

    isFloorAt(y) {
        if (y > this.getCanvasCubeHeight() - 1) {
            return true;
        }

        return false;
    }

    isWallAt(x) {
        if (x < 0 || x >= this.getCanvasCubeWidth() - 2) {
            return true
        }

        return false;
    }

    isShapeAt(x, y) {
        return this.getShapeAt(x, y) != null;
    }

    getShapeAt(x, y) {
        let result = null;

        this.shapes.forEach(function(shape) {
            shape.cubes.forEach(function(cube) {
                if (cube.getX() == x && cube.getY() == y) {
                    result = shape;
                }
            });
        });

        return result;
    }
}

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

    /** Doesnt prevent you from fully rotating shapes into other shapes */
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

        shape.game.collisions.forEach(function(collision) {
            shape.game.render.drawCube(1 + collision[0] - 0.2, 1 + collision[1] - 0.2, 1 + 0.2, 1 + 0.2, "rgba(255, 0, 0, 0.4)");
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
