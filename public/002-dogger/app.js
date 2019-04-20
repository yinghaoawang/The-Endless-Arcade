var config = {
    type: Phaser.AUTO,
    width: 601,
    height: 781,
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

const tileSize = 60;
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
    this.cursors = this.input.keyboard.createCursorKeys();
    this.cursors.slow = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
    this.keySchemes = [this.cursors];
    this.units = [];
}

function update(time, delta) {
    console.log(this.units);
    if (this.state == States.MAIN_MENU) {
        this.state = States.IS_PLAYING;
        initGame(this);
    } else if (this.state == States.IS_PLAYING) {
        keyboardCheck(this);

        for (let i = 0; i < this.units.length; ++i) {
            let unit = this.units[i];
            unit.update(time, delta);
            if (unit instanceof Horsie) {
                if (typeof unit.targetTile == 'undefined') {
                    this.units.splice(this.units.indexOf(unit), 1);
                    unit.destroy();
                }
            }
        }

    } else if (this.state == States.GAME_OVER) {
        this.state = States.MAIN_MENU;
    } else {
        console.error('ERROR: Unknown game state: ' + this.state);
    }
}

function initGame(scene) {
    if (scene.gridG == null) scene.gridG = createTileGraphics(scene);
    scene.doggo = new Doggo(scene);
    scene.score = 0;
    scene.level = 4;
    scene.ng = 5;
    scene.units.push(scene.doggo);
    initLevel(scene);
}

function initLevel(scene) {
    let level = scene.level;
    let ng = scene.ng;
    let middleX = scene.tileXCount / 2;
    let lastY = scene.tileYCount - 1;
    scene.doggo.setTilePos(middleX, lastY);
    
    let horseIndex = 0;
    let safeRowEvery = 3 + ng;
    
    let yRank = lastY - 1;
    for (; yRank > 0; --yRank) {
        if (++horseIndex % (safeRowEvery + 1) == 0) {
            continue;
        }

        let startRight = Math.random() < .5 ? true : false;
        let minCD = Math.max(200, 1200 - (ng * 200) - (level - 100));
        let maxCD = Math.max(400, 1200 - (ng * 50) - (level * 50));
        let horseMoveCD = Math.random() * (maxCD - minCD) + minCD;

        let minSpawnCD = Math.max(3000 - level * 300 - ng * 250, 1500);
        let maxSpawnCD = Math.max(6000 - level * 600 - ng * 500, 2500);
        let horseSpawner = new HorseSpawner(scene, yRank, horseMoveCD, minSpawnCD, maxSpawnCD, startRight);

        scene.units.push(horseSpawner);
        
    }
    
}



function keyboardCheck(scene) {
    let upPressed = false;
    let downPressed = false;
    let leftPressed = false;
    let rightPressed = false;
    let slowPressed = false;
    for (let i = 0; i < scene.keySchemes.length; ++i) {
        let scheme = scene.keySchemes[i];
        if (Phaser.Input.Keyboard.JustDown(scheme.up)) {
            upPressed = true;
        }
        if (Phaser.Input.Keyboard.JustDown(scheme.down)) {
            downPressed = true;
        }
        if (Phaser.Input.Keyboard.JustDown(scheme.left)) {
            leftPressed = true;
        }
        if (Phaser.Input.Keyboard.JustDown(scheme.right)) {
            rightPressed = true;
        }
        if (scheme.slow.isDown) {
            slowPressed = true;
            console.log('slow');
        }
    }

    if (slowPressed ) {
        scene.doggo.moveCoolDown = 300;
    } else {
        scene.doggo.moveCoolDown = 150;
    }

    if (upPressed && !downPressed) {
        scene.doggo.moveUp();
    } else if (downPressed && !upPressed) {
        scene.doggo.moveDown();
    } else if (leftPressed && !rightPressed) {
        scene.doggo.moveLeft();
    } else if (rightPressed && !leftPressed) {
        scene.doggo.moveRight();
    }
}

var game = new Phaser.Game(config);