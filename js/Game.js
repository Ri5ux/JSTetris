
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
        this.cubeSize = 30;
        this.shapes = [];
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

        if (this.ticks % ((20 * 1) / 4) == 0) {
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
        return this.canvas.width / this.cubeSize;
    }

    getCanvasCubeHeight() {
        return this.canvas.width / this.cubeSize;
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
        if (x < 0 || x >= this.getCanvasCubeWidth() - 1) {
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

    rotate(degrees) {
        this.cubes.forEach(function (cube) {
            cube.rotate(degrees);
        });
    }

    draw() {
        var shape = this;

        this.cubes.forEach(function (cube) {
            shape.game.render.drawCube(1 + cube.getX(), cube.getY(), 1, 1, shape.color);
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

    move(moveX, moveY) {
        if (!this.frozen) {
            let shape = this;
            let cancelMovement = false;
            let nX = this.getX() + moveX;
            let nY = this.getY() + moveY;

            this.cubes.forEach(function(cube) {
                let cX = cube.getX() + moveX;
                let cY = cube.getY() + moveY;
                let shapeAt = shape.game.getShapeAt(cX, cY);
                let isShapeAtNext = shapeAt != null && shapeAt != shape;
    
                if (shape.game.isFloorAt(cY) || isShapeAtNext) {
                    if (moveY != 0) {
                        shape.freeze();
                    }
                    cancelMovement = true;
                }
    
                if (moveX < 0) {
                    if (shape.game.isWallAt(cX)) {
                        cancelMovement = true;
                    }
                } else if (moveX > 0) {
                    if (shape.game.isWallAt(cX)) {
                        cancelMovement = true;
                    }
                }
                
            });

            if (cancelMovement) {
                return;
            }
            
            shape.setPos(nX, nY);
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

    rotate(degrees) {
        let point = rotatePoint(0, 0, this.offsetX, this.offsetY, degrees);
        let x = point[0];
        let y = point[1];

        this.setPos(x, y);
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
}
