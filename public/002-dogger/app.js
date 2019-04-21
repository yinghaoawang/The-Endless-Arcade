var config = {
    type: Phaser.AUTO,
    width: 541,
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
    if (this.state == States.MAIN_MENU) {
        this.state = States.IS_PLAYING;
        initGame(this, delta);
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

function initGame(scene, delta) {
    if (scene.gridG == null) scene.gridG = createTileGraphics(scene);
    scene.doggo = new Doggo(scene);
    scene.score = 0;
    scene.level = 4;
    scene.ng = 1;
    scene.units.push(scene.doggo);
    initLevel(scene);
}

function initLevel(scene, delta) {
    let level = scene.level;
    let ng = scene.ng;
    let middleX = scene.tileXCount / 2;
    let lastY = scene.tileYCount - 1;
    scene.doggo.setTilePos(middleX, lastY);
    
    let horseIndex = 0;
    let safeRowEvery = 2 + ng;
    
    let yRank = lastY - 1;
    for (; yRank > 0; --yRank) {
        if (++horseIndex % (safeRowEvery + 1) == 0) {
            continue;
        }

        let startRight = Math.random() < .5 ? true : false;
        let minCD = 400;
        let maxCD = 1200;
        let horseMoveCD = Math.random() * (maxCD - minCD) + minCD;

        let minSpawnCD = Math.max(4000 - level * 300 - ng * 300, 2000);
        let maxSpawnCD = minSpawnCD * 1.5;
        let horseSpawner = new HorseSpawner(scene, yRank, horseMoveCD, minSpawnCD, maxSpawnCD, startRight);
        scene.units.push(horseSpawner);

        let horseTime = 0;
        for (let nextHorseX = (startRight) ? -1 : scene.tileXCount; nextHorseX < scene.screenWidth;) {

            nextHorseX += tileSize
            let targetTileX = startRight ? scene.tileXCount : -1;
            let startTileX = coordsToTilePos(nextHorseX, yRank).x;
            let hose = new Horsie(scene, startTileX, yRank, targetTileX, yRank, 
                (1000 * Math.abs(targetTileX - startTileX)) / 6
            );
            scene.units.push(hose);
            if (!startRight) hose.flipX = true;
        }
        
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
        }
    }

    if (slowPressed) {
        if (scene.doggo.canMove) {
            scene.doggo.moveCoolDown = 400;
        }
    } else {
        if (scene.doggo.canMove) {
            scene.doggo.moveCoolDown = 200;
        }
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