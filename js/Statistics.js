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
        this.stats.score = this.stats.score + points;
    }

    addLines(lines) {
        this.lines = this.lines + lines;
    }

    addScoreLineCompletion(count) {
        switch(count) {
            case 1:
                this.addLines(1);
                this.addScore(40 * (this.level + 1));
                this.singles++;
                break;
            case 2:
                this.addLines(2);
                this.addScore(100 * (this.level + 1));
                this.doubles++;
                break;
            case 3:
                this.addLines(3);
                this.addScore(300 * (this.level + 1));
                this.triples++;
                break;
            case 4:
                this.addLines(4);
                this.addScore(1200 * (this.level + 1));
                this.tetris++;
                break;
        }
    }
}