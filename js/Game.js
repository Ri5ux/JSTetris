
class Game {
    constructor(canvas, onLoad, onLoadPre, onSave, onRegenerate) {
        this.canvas = canvas;
        this.context = canvas.getContext('2d');
        this.canvasHandler = new CanvasHandler(this.canvas, this);
        this.draw = new Draw(this, this.canvas, this.context);
        this.onLoad = onLoad;
        this.onSave = onSave;
        this.onLoadPre = onLoadPre;
    }
}