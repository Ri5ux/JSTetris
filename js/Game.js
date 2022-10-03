
class Game {
    constructor(canvas, onLoad, onLoadPre, onSave) {
        this.canvas = canvas;
        this.context = canvas.getContext('2d');
        this.canvasHandler = new Canvas(this.canvas, this);
        this.render = new Draw(this, this.canvas, this.context);
        this.onLoad = onLoad;
        this.onSave = onSave;
        this.onLoadPre = onLoadPre;
        this.ticks = 1;
        this.partialTicks = 1;
        this.pxInMM = 1;
        this.cubeSize = 30;
        this.dpi = window.devicePixelRatio;
        this.adjustDPI();

        this.shapes = [];
        this.activeShape = null;
    }

    start() {
        var game = this;

        setInterval(function() {
            game.update();
        }, 20);
        this.generateNewShape();
    }

    update() {
        this.ticks++;

        if (this.ticks % (20 * 1 / 2) == 0) {
            this.progressActiveShapeAtLevelSpeed();

            if (this.activeShape == null) {
                this.generateNewShape();
            }
        }

        if (this.ticks % (20 * 20) == 0) {
            
        }
        
        this.renderGame();
    }

    generateNewShape() {
        this.addShape(this.generateRandomShape().createObj(this));
    }

    progressActiveShapeAtLevelSpeed() {
        this.moveActiveShapeDown();
    }

    rotateActiveShapeCW() {
        if (this.activeShape != null) {
            this.activeShape.rotateCW();
        }
    }

    rotateActiveShapeCCW() {
        if (this.activeShape != null) {
            this.activeShape.rotateCCW();
        }
    }

    moveActiveShapeLeft() {
        if (this.activeShape != null) {
            this.activeShape.moveLeft();
        }
    }

    moveActiveShapeRight() {
        if (this.activeShape != null) {
            this.activeShape.moveRight();
        }
    }

    moveActiveShapeDown() {
        if (this.activeShape != null) {
            this.activeShape.moveDown();
        }
    }

    renderGame() {
        this.partialTicks++;
        this.clearCanvas();

        this.shapes.forEach(function(shape) {
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

    generateRandomShape() {
        return SHAPES[this.getRandomInt(SHAPES.length - 1)];
    }

    getRandomInt(max) {
        return Math.floor(Math.random() * max);
    }
}

class ObjectHandler {
    constructor(game) {
        this.game = game;
    }
}

class ShapeDefinition {
    constructor(cubeDef) {
        this.cubeDef = cubeDef;
    }

    createObj(game) {
        let cubes = [];
        this.cubeDef.forEach(function(cube) {
            cubes.push(new Cube(cube.x, cube.y));
        });
        return new ShapeObj(game, cubes);
    }
}

class ShapeObj {
    constructor(game, cubes) {
        this.game = game;
        this.cubes = cubes;
        this.x = 0;
        this.y = 0;
        this.frozen = false;
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

    rotateCW() {
        let oX = this.x;
        let oY = this.y;

        this.cubes.forEach(function(cube) {
            cube.rotateCW(oX, oY);
        });
    }

    rotateCCW() {
        let oX = this.x;
        let oY = this.y;
        
        this.cubes.forEach(function(cube) {
            cube.rotateCCW(oX, oY);
        });
    }

    draw() {
        var obj = this;

        this.cubes.forEach(function(cube, index) {
            cube.drawAt(obj.x, obj.y, obj.game);
        });
    }

    move(x, y) {
        if (!this.frozen) {
            let nextX = this.getX() + x;
            let nextY = this.getY() + y;

            if (!this.checkCollision(nextX, nextY)) {
                this.setPos(nextX, nextY);
            } else {
                this.freeze();
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

    checkCollision(nX, nY) {
        var obj = this;
        var collision = false;

        this.cubes.forEach(function(cube, index) {
            if (cube.checkFloorCollision(obj.game, obj)) {
                collision = true;
            }
        });

        return collision;
    }
}

class Cube {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.color = "#00AAFF";
    }

    drawAt(gridX, gridY, game) {
        game.render.drawCube(1 + gridX + this.getX(), gridY + this.getY(), 1, 1, this.color);
    }

    move(x, y) {
        this.x = this.x + x;
        this.y = this.y + y;
    }

    rotateCW(oX, oY) {
        let point = rotatePoint(0, 0, this.x, this.y, 90);
        let x = point[0];
        let y = point[1];

        this.setPos(x, y);
    }

    rotateCCW(oX, oY) {
        let point = rotatePoint(0, 0, this.x, this.y, -90);
        let x = point[0];
        let y = point[1];

        this.setPos(x, y);
    }

    getX() {
        return this.x;
    }

    getY() {
        return this.y;
    }

    setPos(x, y) {
        this.x = x;
        this.y = y;
    }

    checkFloorCollision(game, shape) {
        let floorHeight = game.getCanvasCubeHeight();
        let cubeY = shape.y + this.y;

        if (cubeY + 1 > floorHeight - 1) {
            return true;
        }

        return false;
    }
}
