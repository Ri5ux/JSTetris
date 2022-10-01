
class Game {
    constructor(canvas, onLoad, onLoadPre, onSave) {
        this.canvas = canvas;
        this.context = canvas.getContext('2d');
        this.canvasHandler = new Canvas(this.canvas, this);
        this.draw = new Draw(this, this.canvas, this.context);
        this.onLoad = onLoad;
        this.onSave = onSave;
        this.onLoadPre = onLoadPre;
        this.ticks = 1;
    }

    start() {
        var game = this;

        setInterval(function() {
            game.update(game);
        }, 20);
    }

    update(game) {
        game.ticks++;

        if (game.ticks % (20 * 5) == 0) {
            console.log("Game loop test");
        }
    }
}