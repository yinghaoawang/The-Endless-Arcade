import $ from 'jquery';
import Phaser from 'phaser3';

import { keyboardCheck, startGameCheck, setKeySchemes, userNameInputCheck } from './keyboard';
import { PlayingMenu, MainMenu, HighScoreMenu } from './Menus';
import { tileSize, tileXOffset, tileYOffset, createTileGraphics, drawGrassOnRow, tilePosToCoords, coordsToTilePos } from './Tile';
import { GridUnit, ControlledGridUnit, Doggo, Horsie, HorseSpawner } from './Units';
import { States } from './States';


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

var devMode = false;

const carImages = ['horse1'];

function preload() {
    this.load.setBaseURL('');
    this.load.image('doggo', 'assets/sprites/doggo.png');
    for (let i = 0; i < carImages.length; ++i) {
        this.load.image(carImages[i], 'assets/sprites/' + carImages[i] + '.png');
    }
}

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
    this.bonus;
    this.bonusTimer;
    this.lives;
    this.gridG;
    this.tileXCount = Math.floor(this.screenWidth / tileSize);
    this.tileYCount = Math.floor(this.screenHeight / tileSize);
    
    setKeySchemes(this);
    
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
    this.mainMenu = new MainMenu(this);

    toMainMenu(this);
}

function update(time, delta) {
    if (this.state == States.MAIN_MENU) {
        if (startGameCheck(this)) {
            toPlayGame(this);
        }
    } else if (this.state == States.IS_PLAYING) {
        keyboardCheck(this);

        this.playingMenu.update();

        updateBonusTimer(this, time)
        updateUnits(this, time, delta);

        checkWin(this);
    } else if (this.state == States.GAME_OVER) {
        this.playingMenu.update();
        this.highScoreMenu.update();

        if (userNameInputCheck(this)) {
            toMainMenu(this);
        }
        updateUnits(this, time, delta);
    } else {
        console.error('ERROR: Unknown game state: ' + this.state);
    }
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

function updateBonusTimer(scene, time) {
    if (scene.bonus > 0) {
        if (scene.bonusTimer - time <= 0) {
            scene.bonusTimer = time + 1000;
            --scene.bonus;
        }
    }
}

function toMainMenu(scene) {
    reset(scene);
    scene.state = States.MAIN_MENU;
    scene.gridG = createTileGraphics(scene);
    scene.playingMenu.hide();
    scene.highScoreMenu.hide();
    scene.mainMenu.show();
}

function toPlayGame(scene) {
    scene.mainMenu.hide()
    scene.playingMenu.show();
    scene.state = States.IS_PLAYING;
    initGame(scene);
}

function initGame(scene) {
    scene.doggo = new Doggo(scene);
    scene.physics.add.existing(scene.doggo);
    scene.score = 0;
    scene.bonusTimer = 0;
    scene.level = 1;
    scene.lives = 3;
    scene.ng = 0;
    scene.units.push(scene.doggo);
    initLevel(scene);
}

function initLevel(scene) {
    let level = scene.level;
    let ng = scene.ng;
    scene.bonus = 100 * (scene.ng + 1) + 1;
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

function checkWin(scene) {
    if (scene.doggo.currTile.y == 0) {
        scene.score += 100 * (scene.ng + 1) + scene.bonus;
        nextLevel(scene);
    }
}

function placeDogInSpawn(scene) {
    let middleX = scene.tileXCount / 2;
    let lastY = scene.tileYCount - 1;
    scene.doggo.setTilePos(middleX, lastY);
    scene.doggo.setTargetTilePos(middleX, lastY);
    scene.doggo.canMove = true;
}

var game = new Phaser.Game(config);