import { Doggo, Horsie } from 'units';

var config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    pixelArt: true,
    physics: {
        default: 'arcade',
        arcade: {
            debug: true,
        }
    },
    scene: {
        preload: preload,
        create: create,
        update: update
    }
};

const States = {
    MAIN_MENU: 1,
    IS_PLAYING: 2,
    GAME_OVER: 3
}

const carImages = ['horse1'];

function preload() {
    this.load.setBaseURL('');
    this.load.image('doggo', 'assets/sprites/doggo.png');
    for (let i = 0; i < carImages.length; ++i) {
        this.load.image(carImages[i], 'assets/sprites/' + carImages[i] + '.png');
    }
}

function create() {
    state = States.MAIN_MENU;
    this.score;
    this.state;
}

function update() {
    if (state == States.MAIN_MENU) {
        this.state = States.IS_PLAYING;
        initGame(this);
    } else if (state == States.IS_PLAYING) {
        console.log('hello');
    } else if (state == States.GAME_OVER) {
        state = States.MAIN_MENU;
    } else {
        console.error('ERROR: Unknown game state: ' + state);
    }

}

function initGame(scene) {
    this.doggo = new Doggo(10, 10);
    this.score = 0;
}

var game = new Phaser.Game(config);