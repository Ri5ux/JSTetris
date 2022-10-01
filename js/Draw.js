class Draw {
    constructor(application, canvas, render) {
        this.application = application;
        this.canvas = canvas;
        this.render = render;

        this.canvasX = 0;
        this.canvasY = 0;
    }

    drawBorderLine(vertexA, vertexB) {
        this.render.beginPath();
        this.render.moveTo(this.application.draw.canvasX + vertexA.x * this.application.pxInMM, this.application.draw.canvasY + vertexA.y * this.application.pxInMM);
        this.render.lineTo(this.application.draw.canvasX + vertexB.x * this.application.pxInMM, this.application.draw.canvasY + vertexB.y * this.application.pxInMM);
        this.render.lineWidth = ApplicationConstants['border']['width'];
        this.render.strokeStyle = ApplicationConstants['border']['color'];
        this.render.stroke();

        let x = this.application.draw.canvasX + (vertexA.x + vertexB.x) / 2 * this.application.pxInMM;
        let y = this.application.draw.canvasY + (vertexA.y + vertexB.y) / 2 * this.application.pxInMM;
        let cellsSeriese = 24;
        let cellsSeriesf = 16;

        this.render.beginPath();
        this.render.rect(x - cellsSeriese / 2 - 10, y - cellsSeriesf / 2 - 6, cellsSeriese + 20, cellsSeriesf + 8);
        this.render.fillStyle = 'black';
        this.render.fill();

        let width = vertexA.x - vertexB.x;
        let height = vertexA.y - vertexB.y;
        let length = Math['sqrt'](width * width + height * height);
        
        this.render.font = ApplicationConstants['border']['font'];
        this.render.textAlign = 'center';
        this.render.textBaseline = 'middle';
        this.render.fillStyle = ApplicationConstants['border']['fontcolor'];
        this.render.fillText(('' + (Math['round'](length)) + ''), x, y);
    }

    drawGrid() {
        let bounds = this.canvas.getBoundingClientRect();
        this.render.lineWidth = ApplicationConstants['grid']['width'];

        let idx = 0;

        /* X Lines */
        for (let i = 0; i < bounds['width']; i += 10) {
            let color = (idx % 10) == 0 ? ApplicationConstants['grid']['color1'] : ApplicationConstants['grid']['color2'];
            this.render.strokeStyle = color;
            this.render.beginPath();
            this.render.moveTo(this.canvasX + (i + 0.5) * this.application.pxInMM, this.canvasY + (0.5) * this.application.pxInMM);
            this.render.lineTo(this.canvasX + (i + 0.5) * this.application.pxInMM, this.canvasY + (bounds['height'] + 0.5) * this.application.pxInMM);
            this.render.stroke();
            idx++
        };

        idx = 0;

        /* Y Lines */
        for (let i = 0; i < bounds['height']; i += 10) {
            let color = (idx % 10 == 0) ? ApplicationConstants['grid']['color1'] : ApplicationConstants['grid']['color2'];
            this.render.strokeStyle = color;
            this.render.beginPath();
            this.render.moveTo(this.canvasX + (0 + 0.5) * this.application.pxInMM, this.canvasY + (i + 0.5) * this.application.pxInMM);
            this.render.lineTo(this.canvasX + (bounds['width'] + 0.5) * this.application.pxInMM, this.canvasY + (i + 0.5) * this.application.pxInMM);
            this.render.stroke();
            idx++
        }

        this.drawRuler(bounds);
    }
}