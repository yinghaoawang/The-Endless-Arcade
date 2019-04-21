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

var devMode = true;

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

var userNameCharArray = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'
];
var userNameCharCSV = 'A,B,C,D,E,F,G,H,I,J,K,L,M,N,O,P,Q,R,S,T,U,V,W,X,Y,Z';

function gameOver(scene) {
    for (let i = 0; i < scene.units.length; ++i) {
        let unit = scene.units[i];
        if (unit instanceof HorseSpawner) {
            scene.units.splice(scene.units.indexOf(unit), 1);
            --i;
            unit.destroy();
        }
    }
    scene.doggo.destroy();
    scene.state = States.GAME_OVER;
    scene.userName = '';
    scene.highScoreMenu.show();
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
    // ajax request to get high scores
    this.gameName = 'dog-souls';
    this.highScores = [];
    let scene = this;
    this.fetchHighScores = function () {
        let apiURL = 'http://localhost:5000/hs';
        if (devMode == false) {
            apiURL = 'https://stately-app.herokuapp.com/hs'
        }
        $.ajax({
            url: apiURL,
            type: 'GET',
            data: {
                gameName: scene.gameName,
                count: 20
            },
            dataType: 'json'
        }).done(function(data) {
            scene.highScores = data;
        });
    };
    this.fetchHighScores();
    setInterval(function() {
        scene.fetchHighScores()
    }, 10000);

    this.postHighScore = function (name, score) {
        let apiURL = 'http://localhost:5000/hs';
        if (devMode == false) {
            apiURL = 'https://stately-app.herokuapp.com/hs'
        }
        $.ajax({
            url: apiURL,
            type: 'POST',
            data: {
                gameName: scene.gameName,
                scoreName: name,
                scoreNumber: score
            },
        }).done(function(data) {
            scene.fetchHighScores();
        });
    };
    
    this.state = States.MAIN_MENU;
    this.screenWidth = config.width;
    this.screenHeight = config.height;
    this.score;
    this.lives;
    this.gridG;
    this.tileXCount = Math.floor(this.screenWidth / tileSize);
    this.tileYCount = Math.floor(this.screenHeight / tileSize);
    
    this.wasd = {
        up: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W),
        down: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S),
        left: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A),
        right: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D),
        slow: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SHIFT),
    }
    this.cursors = this.input.keyboard.createCursorKeys();
    this.cursors.slow = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
    this.keySchemes = [this.cursors, this.wasd];

    this.userNameScheme = this.input.keyboard.addKeys(userNameCharCSV);
    this.userNameScheme.backspace = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.BACKSPACE);
    this.userNameScheme.enter = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ENTER);
    
    this.userName;
    this.maxNameLength = 6;

    this.units = [];
    this.dogHorseCollide = () => {
        --this.lives;
        placeDogInSpawn(this);
        if (this.lives <= 0) {
            gameOver(this);
        }
    };
    this.playingMenu = new PlayingMenu(this);
    this.highScoreMenu = new HighScoreMenu(this);
}

function updateUnits(scene, time, delta) {
    for (let i = 0; i < scene.units.length; ++i) {
        let unit = scene.units[i];
        unit.update(time, delta);
        if (unit instanceof Horsie) {
            if (typeof unit.finalTargetTile == 'undefined') {
                unit.destroy();
            }
        }
    }
}

function update(time, delta) {
    if (this.state == States.MAIN_MENU) {
        this.state = States.IS_PLAYING;
        initGame(this);
        nextLevel(this);
    } else if (this.state == States.IS_PLAYING) {
        keyboardCheck(this);
        this.playingMenu.update();
        
        updateUnits(this, time, delta);
        
        checkWin(this);
    } else if (this.state == States.GAME_OVER) {
        this.highScoreMenu.update();
        userNameInputCheck(this);
        updateUnits(this, time, delta);
    } else {
        console.error('ERROR: Unknown game state: ' + this.state);
    }
}

function checkWin(scene) {
    if (scene.doggo.currTile.y == 0) nextLevel(scene);
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

function toMainMenu(scene) {
    reset(scene);
    scene.state = States.MAIN_MENU;
    scene.playingMenu.hide();
    scene.highScoreMenu.hide();
}

function userNameInputCheck(scene) {
    let enterPressed = false;
    let backspacePressed = false;
    let keyPressed;
    for (let i = 0; i < userNameCharArray.length; ++i) {
        let key = userNameCharArray[i];
        if (Phaser.Input.Keyboard.JustDown(scene.userNameScheme[key])) {
            keyPressed = key;
        }
    }
    if (Phaser.Input.Keyboard.JustDown(scene.userNameScheme.enter)) enterPressed = true;
    if (Phaser.Input.Keyboard.JustDown(scene.userNameScheme.backspace)) backspacePressed = true;

    if (enterPressed) {
        tryPostScore(scene);
        toMainMenu(scene);
    } else if (backspacePressed) {
        if (scene.userName.length > 0) {
            scene.userName = scene.userName.substring(0, scene.userName.length - 1);
        }
    } else if (typeof keyPressed != 'undefined') {
        if (scene.userName.length < scene.maxNameLength) {
            scene.userName += keyPressed;
        }
    }
}

// posts score if reaches requirements
function tryPostScore(scene) {
    if (scene.userName.length > 0 && scene.score >= 50) {
        scene.postHighScore(scene.userName, scene.score);
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