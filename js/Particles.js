class Particle {
    constructor(game, x, y, radius, dx, dy) {
        this.game = game;
        this.ctx = this.game.render.ctx;
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.dx = dx;
        this.dy = dy;
        this.alpha = 1;
        this.color = "#00FFFF";
    }

    draw() {
        this.ctx.save();
        this.ctx.globalAlpha = this.alpha;
        this.ctx.fillStyle = this.color;
        this.ctx.beginPath();
        this.ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
        this.ctx.fill();
        this.ctx.restore();
    }

    update() {
        this.draw();
        this.alpha -= 0.01;
        this.x += this.dx;
        this.y += this.dy;
    }
}