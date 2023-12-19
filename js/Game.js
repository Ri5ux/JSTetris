class Game {
    constructor(name) {
        this.name = name;
        this.canvas = document.getElementById(this.name);
        this.context = this.canvas.getContext('2d');
        this.input = new InputHandler(this.canvas, this);
        this.render = new Draw(this, this.canvas, this.context);
        this.sounds = new Sounds(this);
    }

    init() {
        this.canvas.style.background = GameConstants.game.background;
        this.stats = new Statistics(this);
        this.ticks = 1;
        this.partialTicks = 1;
        this.pxInMM = 1;
        this.cubeSize = 40;
        this.levelMultiplier = 0.1;
        this.levelSpeed = 0.05; /* Range between 0.1 and 0.95 - Do not exceed 0.95 */
        this.level = 0;
        this.softDrop = 0;
        this.pause = false;
        this.gameOver = false;
        this.lineToClear = 0;
        this.shapes = [];
        this.particles = [];
        this.debugCollisions = false;
        this.activeShape = null;
        this.dpi = window.devicePixelRatio;
        this.adjustDPI();
        this.setMusic(this.sounds.MUSIC1);
    }

    start() {
        this.init();
        this.sounds.FX_START.play();

        if (this.eventGameStart != null) {
            this.eventGameStart();
        }
        var game = this;

        setInterval(function () {
            if (!game.pause) {
                game.update();
            }
            game.renderGame();
        }, 20);
    }

    update() {
        this.ticks++;

        if (!this.gameOver) {
            this.music.play();
        }

        if (this.ticks % Math.round(40 * (1.0 - this.levelSpeed)) == 0) {
            this.updateLevel();
        }

        if (this.gameOver) {
            this.gameClear();
        }
    }

    updateLevel() {
        if (!this.gameOver) {
            if (this.checkIncreaseLevel()) {
                this.nextLevel();
            }

            if (this.activeShape == null) {
                if (!this.isShapeAt(this.getCanvasCenterH(), 0)) {
                    this.createNewShape();
                    this.scanForCompleteLines();
                } else {
                    this.gameEnd();
                }
            }

            if (this.activeShape != null) {
                this.activeShape.moveDown();
            }
        }
    }

    checkIncreaseLevel() {
        if (this.stats.linesThisLevel > 0) {
            if (this.stats.linesThisLevel % 10 == 0 || this.stats.lines > this.level * 10) {
                return true;
            }
        }

        return false;
    }

    setMusic(audio) {
        audio.loop = true;
        audio.volume = 0.3;
        this.music = audio;
    }

    pauseGame() {
        this.pause = !this.pause;

        if (this.pause) {
            this.music.pause();
        } else {
            this.music.play();
        }
    }

    nextLevel() {
        this.level++;
        this.stats.linesThisLevel = this.stats.linesThisLevel % 10;
        this.sounds.FX_NEXT_LEVEL.play();
        this.levelSpeed = this.levelMultiplier * this.level;
    }

    renderGame() {
        this.partialTicks++;
        this.clearCanvas();

        this.shapes.forEach(function (shape) {
            shape.draw();
        });
        this.render.drawGrid();

        if (this.pause) {
            this.render.drawPauseScreen();
        }
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
        let x = this.getCanvasCenterH();
        let y = -shapeObj.getHeight();

        if (!this.isShapeAt(x, y)) {
            shapeObj.setPos(x, y);
            this.shapes.push(shapeObj);
        }
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
                        //game.render.createFXExplosion(cube.getX(), cube.getY());
                    });
                }
            }
            game.shiftAllDownAbove(y);
        });

        this.stats.addScoreLineCompletion(completeLines.length);
    }

    gameEnd() {
        this.gameOver = true;
        this.music.currentTime = 0;
        this.music.pause();
        this.sounds.FX_END_LEVEL.play();
        this.lineToClear = 0;

        if (this.eventGameEnd != null) {
            this.eventGameEnd();
        }
    }

    getCubesAtLevel(level) {
        var game = this;
        var bounds = this.getLevelBounds();
        var cubes = [];

        for(var y = bounds.minY; y <= bounds.maxY; y++) {
            for(var x = bounds.minX; x <= bounds.maxX; x++) {
                var shape = game.getShapeAt(x, y);
        
                if (shape != null) {
                    shape.cubes.forEach(function(cube) {
                        if (cube.getY() == y && cube.getY() == level) {
                            cubes.push(cube);
                        }
                    });
                }
            }
        }

        return cubes;
    }

    gameClear() {
        if (this.ticks % 2 == 0 && this.lineToClear <= this.getCanvasCubeHeight()) {
            var cubes = this.getCubesAtLevel(this.lineToClear)

            cubes.forEach(function(cube) {
                var shape = cube.shape;
                shape.cubes = arrayRemove(shape.cubes, cube);
            });
            this.lineToClear++;
        }
    }

    setGameStartEvent(func) {
        this.eventGameStart = func;
    }

    setGameEndEvent(func) {
        this.eventGameEnd = func;
    }
}