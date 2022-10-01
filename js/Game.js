
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
    }

    start() {
        var game = this;

        setInterval(function() {
            game.update();
        }, 20);
    }

    update() {
        this.ticks++;

        if (this.ticks % (20 * 1) == 0) {
        }

        this.renderGame();
    }

    renderGame() {
        this.partialTicks++;
        this.render.drawGrid();
        
    }

    adjustDPI() {
        let h = +getComputedStyle(this.canvas).getPropertyValue("height").slice(0, -2);
        let w = +getComputedStyle(this.canvas).getPropertyValue("width").slice(0, -2);
        this.canvas.setAttribute('height', h * this.dpi);
        this.canvas.setAttribute('width', w * this.dpi);
    }
}