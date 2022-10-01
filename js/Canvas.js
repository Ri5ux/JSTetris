class Canvas {
    constructor(canvas, game) {
        this.canvas = canvas;
        this.game = game;
        this.dragging = false;
        this.dragStartX = 0;
        this.dragStartY = 0;
        
        canvas.addEventListener('mousedown', this.onMouseDown.bind(this), false);
        canvas.addEventListener('touchstart', this.onMouseDown.bind(this), false);
        canvas.addEventListener('mousemove', this.onMouseMove.bind(this), false);
        canvas.addEventListener('touchmove', this.onMouseMove.bind(this), false);
        canvas.addEventListener('mouseup', this.onMouseUp.bind(this), false);
        canvas.addEventListener('touchend', this.onMouseUp.bind(this), false)
    }
    onMouseMove(event) {
        let coords = this.getMouseCoords(event);

        if (this.dragging && this.isMouseInCanvas(event)) {
            let dX = (this.dragStartX - (coords.x)) * this.game.pxInMM;
            let dY = (this.dragStartY - (coords.y)) * this.game.pxInMM;
            let nX = this.game.draw.canvasX - dX;
            let nY = this.game.draw.canvasY - dY;
            this.dragStartX = coords.x;
            this.dragStartY = coords.y;
            this.game.draw.canvasX = nX;
            this.game.draw.canvasY = nY;
        }
    }
    onMouseDown(event) {
        let coords = this.getMouseCoords(event);
        this.dragging = true;
        this.dragStartX = coords.x;
        this.dragStartY = coords.y;
        console.log("mouse down");
    }
    onMouseUp(event) {
        let coords = this.getMouseCoords(event);
        this.dragging = false;
        this.dragStartX = 0;
        this.dragStartY = 0;
        console.log("mouse up");
    }
    isMouseInCanvas(mouseEvent) {
        return this.getTopElement(mouseEvent) == this.canvas;
    }
    getTopElement(mouseEvent) {
        return document.elementFromPoint(mouseEvent.clientX, mouseEvent.clientY);
    }
    getMouseCoords(event) {
        let canvasSize = this.canvas.getBoundingClientRect();
        let mouseX = event.clientX - canvasSize.left;
        let mouseY = event.clientY - canvasSize.top;

        mouseX = mouseX / this.game.pxInMM;
        mouseY = mouseY / this.game.pxInMM;

        return {
            x: mouseX,
            y: mouseY
        };
    }
};