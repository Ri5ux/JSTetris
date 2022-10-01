class Draw {
    constructor(game, canvas, render) {
        this.game = game;
        this.canvas = canvas;
        this.context = render;

        this.canvasX = 0;
        this.canvasY = 0;
    }

    drawBorderLine(vertexA, vertexB) {
        this.context.beginPath();
        this.context.moveTo(this.game.render.canvasX + vertexA.x * this.game.pxInMM, this.game.render.canvasY + vertexA.y * this.game.pxInMM);
        this.context.lineTo(this.game.render.canvasX + vertexB.x * this.game.pxInMM, this.game.render.canvasY + vertexB.y * this.game.pxInMM);
        this.context.lineWidth = GameConstants['border']['width'];
        this.context.strokeStyle = GameConstants['border']['color'];
        this.context.stroke();

        let x = this.game.render.canvasX + (vertexA.x + vertexB.x) / 2 * this.game.pxInMM;
        let y = this.game.render.canvasY + (vertexA.y + vertexB.y) / 2 * this.game.pxInMM;
        let cellsSeriese = 24;
        let cellsSeriesf = 16;

        this.context.beginPath();
        this.context.rect(x - cellsSeriese / 2 - 10, y - cellsSeriesf / 2 - 6, cellsSeriese + 20, cellsSeriesf + 8);
        this.context.fillStyle = 'black';
        this.context.fill();

        let width = vertexA.x - vertexB.x;
        let height = vertexA.y - vertexB.y;
        let length = Math['sqrt'](width * width + height * height);
        
        this.context.font = GameConstants['border']['font'];
        this.context.textAlign = 'center';
        this.context.textBaseline = 'middle';
        this.context.fillStyle = GameConstants['border']['fontcolor'];
        this.context.fillText(('' + (Math['round'](length)) + ''), x, y);
    }

    drawGrid() {
        let bounds = this.canvas.getBoundingClientRect();
        this.context.lineWidth = 1;

        let idx = 0;

        /* X Lines */
        for (let i = 0; i < bounds['width']; i += this.game.cubeSize) {
            let color = GameConstants['grid']['color2'];
            this.context.strokeStyle = color;
            this.context.beginPath();
            this.context.moveTo(this.canvasX + (i + 0.5) * this.game.pxInMM, this.canvasY * this.game.pxInMM);
            this.context.lineTo(this.canvasX + (i + 0.5) * this.game.pxInMM, this.canvasY + (bounds['height'] + 0.5) * this.game.pxInMM);
            this.context.stroke();
            idx++
        };

        idx = 0;

        /* Y Lines */
        for (let i = 0; i < bounds['height']; i += this.game.cubeSize) {
            let color = GameConstants['grid']['color2'];
            this.context.strokeStyle = color;
            this.context.beginPath();
            this.context.moveTo(this.canvasX + 0.5 * this.game.pxInMM, this.canvasY + (i + 0.5) * this.game.pxInMM);
            this.context.lineTo(this.canvasX + (bounds['width'] + 0.5) * this.game.pxInMM, this.canvasY + (i + 0.5) * this.game.pxInMM);
            this.context.stroke();
            idx++
        }
    }
}