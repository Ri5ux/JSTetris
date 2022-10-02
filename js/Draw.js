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
            let x = this.canvasX + (i + 0.5) * this.game.pxInMM;
            let y = this.canvasY * this.game.pxInMM;
            let x1 = this.canvasX + (i + 0.5) * this.game.pxInMM;
            let y1 = this.canvasY + (bounds['height'] + 0.5) * this.game.pxInMM;

            this.context.strokeStyle = color;
            this.context.beginPath();
            this.context.moveTo(x, y);
            this.context.lineTo(x1, y1);
            this.context.stroke();

            if (i != 0) {
                this.context.fillStyle = "#00CCFF";
                this.context.font = '12px digital';
                this.context.fillText(i / this.game.cubeSize, x + (this.game.cubeSize / 4), y + (this.game.cubeSize / 2) + 3);
            }

            idx++
        };

        idx = 0;

        /* Y Lines */
        for (let i = 0; i < bounds['height']; i += this.game.cubeSize) {
            let color = GameConstants['grid']['color2'];
            let x = this.canvasX + 0.5 * this.game.pxInMM;
            let y = this.canvasY + (i + 0.5) * this.game.pxInMM;
            let x1 = this.canvasX + (bounds['width'] + 0.5) * this.game.pxInMM;
            let y1 = this.canvasY + (i + 0.5) * this.game.pxInMM;

            this.context.strokeStyle = color;
            this.context.beginPath();
            this.context.moveTo(x, y);
            this.context.lineTo(x1, y1);
            this.context.stroke();
            
            this.context.fillStyle = "#00CCFF";
            this.context.font = '12px digital';
            this.context.fillText(i / this.game.cubeSize, x + (this.game.cubeSize / 4), y + (this.game.cubeSize / 2) + 3);

            idx++
        }
    }

    drawCube(x, y, w, h, color) {
        let x1 = x * this.game.cubeSize;
        let y1 = y * this.game.cubeSize;
        let x2 = w * this.game.cubeSize;
        let y2 = h * this.game.cubeSize;
        let padding = 1;
        
        this.context.beginPath();
        this.context.fillStyle = color;
        this.context.rect(x1, y1, x2, y2);
        this.context.fill();
    }
}