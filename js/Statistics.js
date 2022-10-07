class Statistics {
    constructor(game) {
        this.game = game;
        this.score = 0;
        this.lines = 0;
        this.singles = 0;
        this.doubles = 0;
        this.triples = 0;
        this.tetris = 0;
    }

    addScore(points) {
        this.score = this.score + points;
    }

    addLines(lines) {
        this.lines = this.lines + lines;
    }

    addScoreLineCompletion(count) {
        let level = this.game.level;
        
        switch(count) {
            case 1:
                this.addLines(1);
                this.addScore(40 * (level + 1));
                this.game.sounds.FX_LINE_CLEAR.play();
                this.singles++;
                break;
            case 2:
                this.addLines(2);
                this.addScore(100 * (level + 1));
                this.game.sounds.FX_LINE_CLEAR.play();
                this.doubles++;
                break;
            case 3:
                this.addLines(3);
                this.addScore(300 * (level + 1));
                this.game.sounds.FX_LINE_CLEAR.play();
                this.triples++;
                break;
            case 4:
                this.addLines(4);
                this.addScore(1200 * (level + 1));
                this.game.sounds.FX_10.play();
                this.tetris++;
                break;
        }
    }
}