var config = {
    type: Phaser.AUTO,
    width: 361,
    height: 601,
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

const tileSize = 40;
const tileXOffset = 1;
const tileYOffset = 0;
const carImages = ['horse1'];

function preload() {
    this.load.setBaseURL('');
    this.load.image('doggo', 'assets/sprites/doggo.png');
    for (let i = 0; i < carImages.length; ++i) {
        this.load.image(carImages[i], 'assets/sprites/' + carImages[i] + '.png');
    }
}

function create() {
    this.state = States.MAIN_MENU;
    this.screenWidth = config.width;
    this.screenHeight = config.height;
    this.score;
    this.gridG;
    this.tiles = [];
    this.tileXCount = Math.floor(this.screenWidth / tileSize);
    this.tileYCount = Math.floor(this.screenHeight / tileSize);
}

function update() {
    if (this.state == States.MAIN_MENU) {
        this.state = States.IS_PLAYING;
        initGame(this);
    } else if (this.state == States.IS_PLAYING) {
        
    } else if (this.state == States.GAME_OVER) {
        this.state = States.MAIN_MENU;
    } else {
        console.error('ERROR: Unknown game state: ' + this.state);
    }
}

function createTileGraphics(scene) {
    let graphics = scene.add.graphics();
    graphics.fillStyle('0xffffff');
    graphics.lineStyle(1, '0x000000')
    for (let i = 0; i < scene.tileXCount; ++i) {
        for (let j = 0; j < scene.tileYCount; ++j) {
            let tilePos = getTilePosition(i, j);
            tilePos.x -= tileSize / 2;
            tilePos.y -= tileSize / 2;
            console.log(i, j, tilePos);
            graphics.fillRect(tilePos.x, tilePos.y, tileSize, tileSize);
            graphics.strokeRect(tilePos.x, tilePos.y, tileSize, tileSize);
        }
    }
    graphics.depth = -100;
    return graphics;
}

function getTilePosition(tileX, tileY) {
    return {
        x: tileSize * Math.floor(tileX) + tileXOffset + tileSize / 2,
        y: tileSize * Math.floor(tileY) + tileYOffset + tileSize / 2
    };
}

function initGame(scene) {
    if (scene.gridG == null) scene.gridG = createTileGraphics(scene);
    scene.doggo = new Doggo(scene, 0, 0);
    let tilePos = getTilePosition(scene.tileXCount / 2, scene.tileYCount - 1);
    scene.doggo.x = tilePos.x;
    scene.doggo.y = tilePos.y;
    scene.score = 0;
}

var game = new Phaser.Game(config);