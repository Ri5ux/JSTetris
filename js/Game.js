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