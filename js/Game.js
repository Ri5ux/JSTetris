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
        this.levelSpeed = 0.1; /* Range between 0.1 and 0.95 - Do not exceed 0.95 */
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

        if (this.ticks % Math.round(40 * (1.0 - this.levelSpeed)) == 0) {
            this.updateLevel();
        }

        this.renderGame();
    }

    updateLevel() {
        if (this.activeShape == null) {
            this.createNewShape();
            this.scanForCompleteLines();
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
        return Math.floor(this.canvas.height / this.cubeSize);
    }

    addShape(shapeObj) {
        this.activeShape = shapeObj;
        shapeObj.setPos(this.getCanvasCenterH(), -shapeObj.getHeight());
        this.shapes.push(shapeObj);
    }

    createNewShape() {
        let type = SHAPES[randomInteger(SHAPES.length)];
        this.addShape(type.create(this));
    }

    isFloorAt(y) {
        var bounds = this.getLevelBounds();

        if (y > bounds.maxY - 1) {
            return true;
        }

        return false;
    }

    getLevelBounds() {
        return { minX: 0, minY: 0, maxX: this.getCanvasCubeWidth() - 1, maxY: this.getCanvasCubeHeight() };
    }

    isWallAt(x) {
        var bounds = this.getLevelBounds();

        if (x < bounds.minX || x > bounds.maxX) {
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

    shiftAllDownAbove(y) {
        var game = this;

        this.shapes.forEach(function(shape) {
            if (shape != game.activeShape) {
                shape.cubes.forEach(function(cube) {
                    if (cube.getY() < y) {
                        cube.setPos(cube.getOffsetX(), cube.getOffsetY() + 1);
                    }
                }); 
            }
        });
    }

    scanForCompleteLines() {
        var game = this;
        var bounds = this.getLevelBounds();
        var completeLines = [];

        for(var y = bounds.minY; y <= bounds.maxY; y++) {
            var lineComplete = true;

            for(var x = bounds.minX; x <= bounds.maxX; x++) {
                if (!this.isShapeAt(x, y)) {
                    lineComplete = false;
                }
            }

            if (lineComplete) {
                completeLines.push(y);
                console.log("Complete line at " + x + "," + y);
            }
        }

        completeLines.forEach(function(y) {
            for(var x = bounds.minX; x <= bounds.maxX; x++) {
                var shape = game.getShapeAt(x, y);

                if (shape != null) {
                    shape.cubes.forEach(function(cube) {
                        if (cube.getY() == y) {
                            shape.cubes = arrayRemove(shape.cubes, cube);
                        }
                    });
                }
            }
            game.shiftAllDownAbove(y);
        });
    }
}