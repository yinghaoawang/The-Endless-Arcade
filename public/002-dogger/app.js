var config = {
    type: Phaser.AUTO,
    width: 541,
    height: 781,
    pixelArt: true,
    physics: {
        default: 'arcade',
        arcade: {
            debug: false,
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

function reset(scene) {
    // remove all units but our doggo
    for (let i = 0; i < scene.units.length; ++i) {
        let unit = scene.units[i];
        scene.units.splice(scene.units.indexOf(unit), 1);
        unit.destroy();
        --i;
    }
    initGame(scene);
}

function create() {
    this.state = States.MAIN_MENU;
    this.screenWidth = config.width;
    this.screenHeight = config.height;
    this.score;
    this.lives;
    this.gridG;
    this.tiles = [];
    this.tileXCount = Math.floor(this.screenWidth / tileSize);
    this.tileYCount = Math.floor(this.screenHeight / tileSize);
    this.cursors = this.input.keyboard.createCursorKeys();
    this.cursors.slow = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
    this.keySchemes = [this.cursors];
    this.units = [];
    this.dogHorseCollide = (dog, horse) => {
        --this.lives;
        placeDogInSpawn(this);
        if (this.lives <= 0) {
            reset(this);
        }
    };
    this.playingMenu = new PlayingMenu(this);
}

function update(time, delta) {
    if (this.state == States.MAIN_MENU) {
        this.state = States.IS_PLAYING;
        initGame(this);
        nextLevel(this);
    } else if (this.state == States.IS_PLAYING) {
        keyboardCheck(this);
        this.playingMenu.update();

        for (let i = 0; i < this.units.length; ++i) {
            let unit = this.units[i];
            unit.update(time, delta);
            if (unit instanceof Horsie) {
                if (typeof unit.finalTargetTile == 'undefined') {
                    unit.destroy();
                }
            }
        }
        if (this.doggo.currTile.y == 0) nextLevel(this);
    } else if (this.state == States.GAME_OVER) {
        this.state = States.MAIN_MENU;
    } else {
        console.error('ERROR: Unknown game state: ' + this.state);
    }
}

function nextLevel(scene) {
    // remove all units but our doggo
    for (let i = 0; i < scene.units.length; ++i) {
        let unit = scene.units[i];
        if (!(unit instanceof Doggo)) {
            scene.units.splice(scene.units.indexOf(unit), 1);
            unit.destroy();
            --i;
        }
    }

    scene.score += 100;

    if (scene.level / 5 >= 1) {
        scene.level = 1;
        ++scene.ng;
        ++scene.lives;
        scene.playingMenu.ngFade();
    } else {
        ++scene.level;
    }
    console.log(scene.level, scene.ng);
    initLevel(scene);
}

function initGame(scene) {
    scene.doggo = new Doggo(scene);
    scene.physics.add.existing(scene.doggo);
    scene.score = 0;
    scene.level = 1;
    scene.lives = 3;
    scene.ng = 0;
    scene.units.push(scene.doggo);
    scene.playingMenu.show();
    initLevel(scene);
}

function placeDogInSpawn(scene) {
    let middleX = scene.tileXCount / 2;
    let lastY = scene.tileYCount - 1;
    scene.doggo.setTilePos(middleX, lastY);
    scene.doggo.setTargetTilePos(middleX, lastY);
    scene.doggo.canMove = true;
}

function initLevel(scene) {
    let level = scene.level;
    let ng = scene.ng;
    let lastY = scene.tileYCount - 1;
    placeDogInSpawn(scene);
    
    let horseIndex = 0;
    let safeRowEvery = 2 + ng;
    scene.gridG = createTileGraphics(scene);
    
    let yRank = lastY - 1;
    for (; yRank > 0; --yRank) {
        if (++horseIndex % (safeRowEvery + 1) == 0) {
            drawGrassOnRow(scene, scene.gridG, yRank);
            continue;
        }

        let startRight = Math.random() < .5 ? true : false;
        let minCD = 400;
        let maxCD = 800;
        let horseMoveCD = Math.random() * (maxCD - minCD) + minCD;

        let minSpawnCD = Math.max(3000 - level * 200 - ng * 350, 1000);
        let maxSpawnCD = minSpawnCD * 1.5;
        let horseSpawner = new HorseSpawner(scene, yRank, horseMoveCD, minSpawnCD, maxSpawnCD, startRight);
        scene.units.push(horseSpawner);
        console.log(minSpawnCD, maxSpawnCD);
        for (let i = -1; i < scene.tileXCount; ++i) {
            let targetTileX = startRight ? scene.tileXCount : -1;
            let startTileX = startRight ? i : scene.tileXCount - 1 - i;
            let hose = new Horsie(scene, startTileX, yRank, targetTileX, yRank, horseMoveCD);
            scene.physics.add.existing(hose);
            scene.physics.add.collider(scene.doggo, hose, scene.dogHorseCollide);
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