class InputHandler {
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
        canvas.addEventListener('touchend', this.onMouseUp.bind(this), false);

        document.addEventListener('keyup', (event) => {
            var name = event.key;
            var code = event.code;

            if (!this.game.pause) {
                switch (code) {
                    case 'ArrowDown':
                        event.preventDefault();
                        this.game.softDrop = 0;
                        break;
                }
            }
        }, false);

        document.addEventListener('keydown', (event) => {
            var name = event.key;
            var code = event.code;

            if (code == "Space") {
                event.preventDefault();
                this.game.pauseGame();
                console.log(this.game.pause ? "Game paused" : "Game resumed");
            }

            if (!this.game.pause) {
                switch (code) {
                    case 'ArrowLeft':
                        event.preventDefault();
                        if (this.game.activeShape != null) {
                            this.game.activeShape.moveLeft();
                            this.game.sounds.FX_MOVE.play();
                        }
                        break;
                    case 'ArrowRight':
                        event.preventDefault();
                        if (this.game.activeShape != null) {
                            this.game.activeShape.moveRight();
                            this.game.sounds.FX_MOVE.play();
                        }
                        break;
                    case 'ArrowUp':
                        event.preventDefault();
                        if (this.game.activeShape != null) {
                            this.game.activeShape.rotate(90);
                            this.game.sounds.FX_ROTATE.play();
                        }
                        break;
                    case 'ArrowDown':
                        event.preventDefault();
                        if (this.game.activeShape != null) {
                            this.game.activeShape.moveDown();
                            this.game.softDrop++;
                        }
                        if (this.game.activeShape == null || this.game.activeShape != null && this.game.activeShape.frozen) {
                            console.log("Soft Drop Points: " + this.game.softDrop);
                            this.game.stats.addScore(this.game.softDrop);
                            this.game.softDrop = 0;
                        }
                        break;
                }
            }
        }, false);
    }
    onMouseMove(event) {
        let coords = this.getMouseCoords(event);

        if (this.dragging && this.isMouseInCanvas(event)) {
            let dX = (this.dragStartX - (coords.x));
            let dY = (this.dragStartY - (coords.y));
            let nX = this.game.render.canvasX - dX;
            let nY = this.game.render.canvasY - dY;
            this.dragStartX = coords.x;
            this.dragStartY = coords.y;
            this.game.render.canvasX = nX;
            this.game.render.canvasY = nY;
        }
    }
    onMouseDown(event) {
        let coords = this.getMouseCoords(event);
        //this.dragging = true;
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

        mouseX = mouseX;
        mouseY = mouseY;

        return {
            x: mouseX,
            y: mouseY
        };
    }
};