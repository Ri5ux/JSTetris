class Sounds {
    constructor(game) {
        this.game = game;
        this.FX_END_LEVEL = new AsyncAudio('audio/fx_end.mp3');
        this.FX_FREEZE = new AsyncAudio('audio/fx_freeze.mp3');
        this.FX_LINE_CLEAR = new AsyncAudio('audio/fx_line_clear.mp3');
        this.FX_MOVE = new AsyncAudio('audio/fx_move.mp3');
        this.FX_NEXT_LEVEL = new AsyncAudio('audio/fx_next_level.mp3');
        this.FX_ROCKET = new AsyncAudio('audio/fx_rocket.mp3');
        this.FX_ROTATE = new AsyncAudio('audio/fx_rotate.mp3');
        this.FX_SELECT = new AsyncAudio('audio/fx_select.mp3');
        this.FX_START = new AsyncAudio('audio/fx_start.mp3');
        this.FX_10 = new AsyncAudio('audio/fx_10.mp3');
        this.FX_15 = new AsyncAudio('audio/fx_15.mp3');
        this.MUSIC_CELEBRATE = new Audio('audio/music_celebrate.mp3');
        this.MUSIC_STATS = new Audio('audio/music_stats.mp3');
        this.MUSIC_WIN = new Audio('audio/music_win.mp3');
        this.MUSIC1 = new Audio('audio/music1.mp3');
        this.MUSIC1_FAST = new Audio('audio/music1_fast.mp3');
        this.MUSIC2 = new Audio('audio/music2.mp3');
        this.MUSIC2_FAST = new Audio('audio/music2_fast.mp3');
        this.MUSIC3 = new Audio('audio/music3.mp3');
        this.MUSIC3_FAST = new Audio('audio/music3_fast.mp3');
    }
}

class AsyncAudio {
    constructor(url) {
        this.url = url;
    }

    play() {
        new Audio(this.url).play();
    }
}