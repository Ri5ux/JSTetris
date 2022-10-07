class Draw {
    constructor(game, canvas, ctx) {
        this.game = game;
        this.canvas = canvas;
        this.ctx = ctx;
        this.canvasX = 0;
        this.canvasY = 0;
    }

    drawBorderLine(vertexA, vertexB) {
        this.ctx.beginPath();
        this.ctx.moveTo(this.game.render.canvasX + vertexA.x * this.game.pxInMM, this.game.render.canvasY + vertexA.y * this.game.pxInMM);
        this.ctx.lineTo(this.game.render.canvasX + vertexB.x * this.game.pxInMM, this.game.render.canvasY + vertexB.y * this.game.pxInMM);
        this.ctx.lineWidth = GameConstants.border.width;
        this.ctx.strokeStyle = GameConstants.border.color;
        this.ctx.stroke();

        let x = this.game.render.canvasX + (vertexA.x + vertexB.x) / 2 * this.game.pxInMM;
        let y = this.game.render.canvasY + (vertexA.y + vertexB.y) / 2 * this.game.pxInMM;
        let cellsSeriese = 24;
        let cellsSeriesf = 16;

        this.ctx.beginPath();
        this.ctx.rect(x - cellsSeriese / 2 - 10, y - cellsSeriesf / 2 - 6, cellsSeriese + 20, cellsSeriesf + 8);
        this.ctx.fillStyle = 'black';
        this.ctx.fill();

        let width = vertexA.x - vertexB.x;
        let height = vertexA.y - vertexB.y;
        let length = Math['sqrt'](width * width + height * height);

        this.ctx.font = GameConstants.border.font;
        this.ctx.textAlign = 'center';
        this.ctx.textBaseline = 'middle';
        this.ctx.fillStyle = GameConstants.border.fontcolor;
        this.ctx.fillText(('' + (Math['round'](length)) + ''), x, y);
    }

    drawStringCentered(font, color, x, y, str) {
        this.ctx.font = font;
        let bounds = this.ctx.measureText(str);
        this.drawString(font, color, x - (bounds.width / 2), y, str);
    }

    drawString(font, color, x, y, str) {
        this.ctx.fillStyle = color;
        this.ctx.font = font;
        this.ctx.fillText(str, x, y);
    }

    drawGrid() {
        let bounds = this.canvas.getBoundingClientRect();
        this.ctx.lineWidth = 1;

        let idx = 0;

        /* X Lines */
        for (let i = 0; i < bounds['width']; i += this.game.cubeSize) {
            let color = GameConstants.game.gridLines;
            let x = this.canvasX + (i + 0.5) * this.game.pxInMM;
            let y = this.canvasY * this.game.pxInMM;
            let x1 = this.canvasX + (i + 0.5) * this.game.pxInMM;
            let y1 = this.canvasY + (bounds['height'] + 0.5) * this.game.pxInMM;

            this.ctx.strokeStyle = color;
            this.ctx.beginPath();
            this.ctx.moveTo(x, y);
            this.ctx.lineTo(x1, y1);
            this.ctx.stroke();

            let xf = x + (this.game.cubeSize / 4);
            let yf = y + (this.game.cubeSize / 2) + 3;
            this.drawString(GameConstants.game.font, GameConstants.game.fontcolor, xf, yf, i / this.game.cubeSize);

            idx++
        };

        idx = 0;

        /* Y Lines */
        for (let i = 0; i < bounds['height']; i += this.game.cubeSize) {
            let color = GameConstants.game.gridLines;
            let x = this.canvasX + 0.5;
            let y = this.canvasY + (i + 0.5);
            let x1 = this.canvasX + (bounds['width'] + 0.5);
            let y1 = this.canvasY + (i + 0.5);

            this.ctx.strokeStyle = color;
            this.ctx.beginPath();
            this.ctx.moveTo(x, y);
            this.ctx.lineTo(x1, y1);
            this.ctx.stroke();

            let xf = x + (this.game.cubeSize / 4);
            let yf = y + (this.game.cubeSize / 2);
                
            if (i != 0) {
                this.drawString(GameConstants.game.font, GameConstants.game.fontcolor, xf, yf + 3, i / this.game.cubeSize);
            }


            idx++
        }
    }

    drawCube(x, y, w, h, color) {
        let padding = 1;
        let radius = 0;
        let fxSize = this.game.cubeSize / 2;
        let x1 = x * this.game.cubeSize + 1;
        let y1 = y * this.game.cubeSize + 1;
        let w1 = w * this.game.cubeSize - 1;
        let h1 = h * this.game.cubeSize - 1;
        let x2 = x1 + (padding / 2);
        let y2 = y1 + (padding / 2);
        let w2 = w1 - padding;
        let h2 = h1 - padding;
        let x3 = x1 + 1;
        let y3 = y1 + 1;
        let x4 = x3 + fxSize;
        let y4 = y3 + fxSize;
        
        this.ctx.fillStyle = color;
        this.ctx.strokeStyle = "rgba(255, 255, 255, 0.1)";
        this.ctx.lineWidth = padding;
        this.drawRoundedRect(x1, y1, w1, h1, radius * 2, true, false);
        this.ctx.fillStyle = "rgba(255, 255, 255, 0.2)";
        this.drawRoundedRect(x3, y3, fxSize, fxSize, 0, true, false);
        this.ctx.fillStyle = "rgba(0, 0, 0, 0.3)";
        this.drawRoundedRect(x4, y4, fxSize, fxSize, 0, true, false);
    }

    drawPauseScreen() {
        let bounds = this.canvas.getBoundingClientRect();
        this.ctx.fillStyle = GameConstants.pause.background;
        this.drawRoundedRect(0, 0, bounds.width, bounds.height, 0, true, false);
        this.drawStringCentered(GameConstants.pause.font, GameConstants.pause.fontcolor, bounds.width / 2, bounds.height / 2, "Game Paused");
    }

    drawCollisionDebug(x, y) {
        if (this.game.debugCollisions) {
            this.drawCube(1 + x, y, 1, 1, "rgba(255, 0, 0, 0.4)");
        }
    }

    drawCollisionDebugPreCheck(x, y) {
        if (this.game.debugCollisions) {
            this.drawCube(1 + x, y, 1, 1, "rgba(0, 0, 255, 0.4)");
        }
    }

    drawRoundedRect(x, y, w, h, radius = 5, fill = false, stroke = true) {
        if (typeof radius === 'number') {
            radius = { tl: radius, tr: radius, br: radius, bl: radius };
        } else {
            radius = { ...{ tl: 0, tr: 0, br: 0, bl: 0 }, ...radius };
        }

        this.ctx.beginPath();
        this.ctx.moveTo(x + radius.tl, y);
        this.ctx.lineTo(x + w - radius.tr, y);
        this.ctx.quadraticCurveTo(x + w, y, x + w, y + radius.tr);
        this.ctx.lineTo(x + w, y + h - radius.br);
        this.ctx.quadraticCurveTo(x + w, y + h, x + w - radius.br, y + h);
        this.ctx.lineTo(x + radius.bl, y + h);
        this.ctx.quadraticCurveTo(x, y + h, x, y + h - radius.bl);
        this.ctx.lineTo(x, y + radius.tl);
        this.ctx.quadraticCurveTo(x, y, x + radius.tl, y);
        this.ctx.closePath();

        if (fill) {
            this.ctx.fill();
        }

        if (stroke) {
            this.ctx.stroke();
        }
    }
}