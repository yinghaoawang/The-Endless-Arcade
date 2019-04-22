var config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    pixelArt: true,
    physics: {
        default: 'matter',
        matter: {
            debug: false,
            gravity: { x:0, y: 0 },
            friction: 0
        }
    },
    scene: {
        preload: preload,
        create: create,
        update: update
    }
};

var devMode = false;


// ajax request to get high scores
var fetchHighScores = function () {
    let apiURL = 'http://localhost:5000/hs';
    if (devMode == false) {
        apiURL = 'https://stately-app.herokuapp.com/hs'
    }
    let numberCheck = $.ajax({
        url: apiURL,
        type: 'GET',
        data: {
            gameName: 'asteroid-souls',
            count: 10
        },
        dataType: 'json'
    }).done(function(data) {
        fetchedHighScores = data;
        highScores = fetchedHighScores;
    });
};
// update with new high scores every 10 seconds
fetchHighScores();
setInterval(function() {
    fetchHighScores()
}, 10000);

// ajax request to post high score
var postHighScore = function (name, score) {
    let apiURL = 'http://localhost:5000/hs';
    if (devMode == false) {
        apiURL = 'https://stately-app.herokuapp.com/hs'
    }
    let numberCheck = $.ajax({
        url: apiURL,
        type: 'POST',
        data: {
            gameName: 'asteroid-souls',
            scoreName: name,
            scoreNumber: score
        },
    }).done(function(data) {
        fetchHighScores();
    });
};

var nameKeyArray = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'
];
var nameKeyCSV = 'A,B,C,D,E,F,G,H,I,J,K,L,M,N,O,P,Q,R,S,T,U,V,W,X,Y,Z';
var nameKeyScheme;

var game = new Phaser.Game(config);
var score;
var isMainMenu;
var isGameOver;
var isPlaying;
var highScores = [];
var fetchedHighScores = [];

var cursors;
var wasd;
var nameKey = [];

var controls;
var ship;
var shipAcc = .1;
var shipMaxSpeed = 5;
var shipRotationSpeed = .11;
var shipFriction = .020;

var fireBulletCooldown = 200;
var fireBulletTimer;

var bulletSpeed = 15;
var bulletMaxLifespan = 400;

var bulletList = [];

var asteroidMinSpeed = 1;
var asteroidMaxSpeed = 3;
var asteroidDivisor = 1.6;
var asteroidMaxDivisions = 5;
var asteroidList = [];
var asteroidImageNames = ['asteroid4'];

var allyCategory;
var enemyCategory;

var titleText;
var startText;
var gameOverText;
var scoreText;
var highScoresText;
var scoreNameText;
var highScoreNameText;
var userScoreNameText;
var userScoreText;

var name;
var maxNameLength = 6;

function preload() {
    this.load.setBaseURL('');
    this.load.image('ship', 'assets/sprites/ship.png');
    this.load.image('bullet', 'assets/sprites/bullet.png');
    for (let i = 0; i < asteroidImageNames.length; ++i) {
        this.load.image(asteroidImageNames[i], 'assets/sprites/' + asteroidImageNames[i] + '.png');
    }
}

function create() {
    isPlaying = false;
    // controls setup
    cursors = this.input.keyboard.createCursorKeys();
    cursors.fire = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
    cursors.start = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
    wasd = {
        up: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W),
        down: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S),
        left: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A),
        right: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D),
        fire: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.PERIOD),
        start: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE)
    }

    nameKey = this.input.keyboard.addKeys(nameKeyCSV);
    nameKey['backspace'] = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.BACKSPACE);
    nameKey['enter'] = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ENTER);

    controls = [cursors, wasd];

    // collision setup
    allyGroup = -1;
    enemyGroup = -2;

    // add collision listener
    let self = this;
    this.matter.world.on('collisionstart', function (event) {
        let gameObjectA = event.pairs[0].bodyA.gameObject;
        let gameObjectB = event.pairs[0].bodyB.gameObject;

        let allyObject;
        let enemyObject;
        if (gameObjectA.body.collisionFilter.group == allyGroup) {
            allyObject = gameObjectA;
            enemyObject = gameObjectB;
        } else {
            allyObject = gameObjectB;
            enemyObject = gameObjectA;
        }
        
        if (allyObject.unitType == 'bullet') {
            let arrIndex = bulletList.indexOf(allyObject);
            bulletList.splice(arrIndex, 1);
            allyObject.destroy();

            if (enemyObject.unitType == 'asteroid') {
                destroyAsteroid(self, enemyObject, enemyObject.rotation);
            }
        } else if (allyObject.unitType == 'ship') {
            destroyAsteroid(self, enemyObject, enemyObject.rotation);
            ship.destroy();
            showGameOverMenu(self);
            name = '';
        } else {
            console.error('Unknown unit type: ' + allyObject.unitType);
        }
    });

    showMainMenu(this);
}

function reset() {
    for (let i = 0; i < asteroidList.length; ++i) {
        let asteroid = asteroidList[i];
        asteroid.destroy();
        asteroidList.splice(i, 1);
        --i;
    }
    for (let i = 0; i < bulletList; ++i) {
        let bullet = bulletList[i];
        bullet.destroy();
        bulletList.splice(i, 1);
        --i;
    }
    if (ship != null) ship.destroy();

    // reset values
    isPlaying = false;
    isGameOver = false;
    //TODO
    score = 0;
}

function init(self) {
    hideMainMenu();
    score = 0;
    showScoreText(self);
    updateScoreText();
    // create ship
    fireBulletTimer = 0;
    isPlaying = true;
    isMainMenu = false;
    ship = self.matter.add.image(400, 100, 'ship').setCollisionGroup(allyGroup);
    ship.setFriction(0, 0);
    ship.setFixedRotation(true);
    ship.unitType = 'ship';
}

function update() {
    // these are terrible function names but i'm not just very creative
    if (isMainMenu) {
        startCheck(this);
    } else if (isPlaying) {
        // Keyboard listener
        movementCheck();
        fireBulletCheck(this);

        // Bounds wrap
        boundsWrap(this);
        
        // asteroids stuff
        if (asteroidList.length == 0) {
            createAsteroids(this);
        }

        // deletes bullet if they expire, and wraps them
        manageBullets(this);
        manageAsteroids(this);
        
    } else if (isGameOver) {
        enterNameCheck(this);
        updateNameText();
    }
}

// on main menu, checks if user presses start
function startCheck(self) {
    let startPressed = false;
    for (let i = 0; i < controls.length; ++i) {
        let scheme = controls[i];
        if (scheme.hasOwnProperty('start') && Phaser.Input.Keyboard.JustDown(scheme.start)) startPressed = true;
    }
    if (startPressed) {
        init(self);
        isMainMenu = false;
    }
}

// only checks if backspace or enter is pressed, key press handled elsewhere
function enterNameCheck(self) {
    let enterPressed = false;
    let backspacePressed = false;
    let keyPressed;
    for (let i = 0; i < nameKeyArray.length; ++i) {
        let key = nameKeyArray[i];
        if (Phaser.Input.Keyboard.JustDown(nameKey[key])) {
            keyPressed = key;
        }
    }
    if (Phaser.Input.Keyboard.JustDown(nameKey['enter'])) {
        enterPressed = true;
        tryPostScore();
    }
    if (Phaser.Input.Keyboard.JustDown(nameKey['backspace'])) {
        backspacePressed = true;
    }
    if (enterPressed) { reset(self);
        isMainMenu = true;
        showMainMenu(self);
        hideScoreText();
    } else if (backspacePressed) {
        if (name.length > 0) {
            name = name.substring(0, name.length - 1);
        }
    } else if (typeof keyPressed != 'undefined') {
        if (name.length < maxNameLength) {
            name += keyPressed;
        }
    }
}

function hideScoreText() {
    if (typeof scoreText != 'undefined') {
        scoreText.setVisible(false);
    }
}

function showScoreText(self) {
    if (typeof scoreText == 'undefined') {
        scoreText = self.add.text(10, 10, '', {
            fontSize: '14px',
            fontFamily: 'Cutive Mono'
        });
        scoreText.depth = 200;
    }
    scoreText.setVisible(true);
}

// moves the ship based on input keys
function movementCheck() {
    let upPressed = false;
    let downPressed = false;
    let leftPressed = false;
    let rightPressed = false;
    for (let i = 0 ; i < controls.length; ++i) {
        let scheme = controls[i];
        if (scheme.up.isDown) upPressed = true;
        if (scheme.down.isDown) downPressed = true;
        if (scheme.left.isDown) leftPressed = true;
        if (scheme.right.isDown) rightPressed = true;
    }
    if (leftPressed && !rightPressed) {
        ship.rotation -= shipRotationSpeed;
        
    } else if (rightPressed && !leftPressed) {
        ship.rotation += shipRotationSpeed;
    }
    if (upPressed) {
        let newVx = ship.body.velocity.x + shipAcc * Math.cos(ship.rotation);
        let newVy = ship.body.velocity.y + shipAcc * Math.sin(ship.rotation);
        ship.setVelocity(newVx, newVy);
    }

    applyFriction();

    // prevents ship from going faster than its max speed
    let currShipSpeedSquared = ship.body.velocity.y * ship.body.velocity.y + ship.body.velocity.x * ship.body.velocity.x;
    if (currShipSpeedSquared > shipMaxSpeed * shipMaxSpeed) {
        let currShipSpeed = Math.sqrt(currShipSpeedSquared);
        let newVx = (ship.body.velocity.x / currShipSpeed) * shipMaxSpeed;
        let newVy = (ship.body.velocity.y / currShipSpeed) * shipMaxSpeed;
        ship.setVelocity(newVx, newVy);
    }
}

// checks if user presses key to fire bullet
function fireBulletCheck(self) {
    let spacePressed = false;
    for (let i = 0; i < controls.length; ++i) {
        let scheme = controls[i];
        if (Phaser.Input.Keyboard.JustDown(scheme.fire)) spacePressed = true;
    }

    if (spacePressed) {
        let canFireBullet = (fireBulletTimer - self.time.now <= 0) ? true : false;
        if (canFireBullet) {
            fireBullet(self, ship.x, ship.y, ship.rotation);
            fireBulletTimer = self.time.now + fireBulletCooldown;
        }
    }
}

function hideGameOverMenu() {
    if (typeof gameOverText != 'undefined')
        gameOverText.setVisible(false);

    if (typeof highScoreText != 'undefined') {
        highScoreText.setVisible(false);
    }
    if (typeof highScoreNameText != 'undefined')
        highScoreNameText.setVisible(false);
    if (typeof userScoreNameText != 'undefined')
        userScoreText.setVisible(false);
    if (typeof userScoreNameText != 'undefined')
        userScoreNameText.setVisible(false);
}

function hideMainMenu() {
    titleText.setVisible(false);
    startText.setVisible(false);
}

function showGameOverMenu(self) {
    isGameOver = true;
    isPlaying = false;
    
    if (typeof gameOverText == 'undefined') {
        gameOverText = self.add.text(config.width * .5, config.height * .1, 'You Died');
        gameOverText.setOrigin(.5, 0);
        gameOverText.setStyle({
            fontSize: '30px',
            fontFamily: 'Cutive Mono'
        });
        gameOverText.depth = -1;
    }
    let highScoreStyle = {
        fontSize: '20px',
        fontFamily: 'Cutive Mono'
    };
    if (typeof highScoreText == 'undefined') {
        highScoreText = self.add.text(config.width * .65, config.height * .2, '');
        highScoreText.setStyle(highScoreStyle);
        highScoreText.setAlign('right');
        highScoreText.setOrigin(.5, 0);
        highScoreText.setLineSpacing(5);
    }
    if (typeof highScoreNameText == 'undefined') {
        highScoreNameText = self.add.text(config.width *.35, config.height * .2, '');
        highScoreNameText.setStyle(highScoreStyle);
        highScoreNameText.setAlign('left');
        highScoreNameText.setOrigin(.5, 0);
        highScoreNameText.setLineSpacing(5);
    }
    if (typeof userScoreText == 'undefined') {
        userScoreText = self.add.text(config.width * .65, config.height * .9, '');
        userScoreText.setStyle(highScoreStyle);
        userScoreText.setAlign('right');
        userScoreText.setOrigin(.5, 0);
    }
    if (typeof userScoreNameText == 'undefined') {
        userScoreNameText = self.add.text(config.width *.35, config.height * .9, '');
        userScoreNameText.setStyle(highScoreStyle);
        userScoreNameText.setAlign('left');
        userScoreNameText.setOrigin(.5, 0);
    }

    updateHighScoreText();
    userScoreText.setText(score);

    gameOverText.setVisible(true);
    highScoreText.setVisible(true);
    highScoreNameText.setVisible(true);
    userScoreText.setVisible(true);
    userScoreNameText.setVisible(true);
}

function showMainMenu(self) {
    hideGameOverMenu();
    isMainMenu = true;
    if (typeof titleText == 'undefined') {
        titleText = self.add.text(config.width * .5, config.height * .35, 'Asteroid Souls');
        titleText.setOrigin(.5);
        titleText.setStyle({
            fontSize: '30px',
            fontFamily: 'Cutive Mono'
        });
    }
    if (typeof startText == 'undefined') {
        startText = self.add.text(config.width * .5, config.height * .35 + 30, 'Press Space to play');
        startText.setOrigin(.5);
        startText.setStyle({
            fontSize: '14px',
            fontFamily: 'Cutive Mono'
        });
    }
    titleText.setVisible(true);
    startText.setVisible(true);
}


// destroy asteroid and clean up references, asteroid splits if big or med
function destroyAsteroid(self, asteroid, rotation) {
    if (typeof rotation == 'undefined') {
        rotation = 2 * Math.PI * Math.random();
    }
    score += 50;
    updateScoreText();
    let arrayIndex = asteroidList.indexOf(asteroid);
    asteroidList.splice(arrayIndex, 1);
    // splits the asteroid
    if (asteroid.asteroidState < asteroidMaxDivisions) {
        let splitAsteroid1 = createAsteroid(self, asteroid.x, asteroid.y, rotation - Math.PI / 6, asteroid.asteroidState + 1, asteroid.displayWidth / asteroidDivisor, asteroid.displayHeight / asteroidDivisor);
        let speed = Math.random() * (asteroidMaxSpeed - asteroidMinSpeed) + asteroidMinSpeed;
        splitAsteroid1.setVelocityX(speed * Math.cos(splitAsteroid1.rotation));
        splitAsteroid1.setVelocityY(speed * Math.sin(splitAsteroid1.rotation));
        asteroidList.push(splitAsteroid1);

        let splitAsteroid2 = createAsteroid(self, asteroid.x, asteroid.y, rotation + Math.PI / 6, asteroid.asteroidState + 1, asteroid.displayWidth / asteroidDivisor, asteroid.displayHeight / asteroidDivisor);
        speed = Math.random() * (asteroidMaxSpeed - asteroidMinSpeed) + asteroidMinSpeed;

        splitAsteroid2.setVelocityX(speed * Math.cos(splitAsteroid2.rotation));
        splitAsteroid2.setVelocityY(speed * Math.sin(splitAsteroid2.rotation));

        asteroidList.push(splitAsteroid2);
    }
    asteroid.destroy();
}

// creates a single asteroid
function createAsteroid(self, x, y, rotation, asteroidState, displayWidth, displayHeight) {
    let randIndex = Math.floor(asteroidImageNames.length * Math.random());
    let randAsteroidImageName = asteroidImageNames[randIndex];
    let asteroid = self.matter.add.image(x, y, randAsteroidImageName).setCollisionGroup(enemyGroup);
    if (typeof displayWidth != 'undefined' && typeof displayHeight != 'undefined') {
        asteroid.setDisplaySize(displayWidth, displayHeight);
    }
    asteroid.setFriction(0, 0);
    asteroid.setRotation(rotation);
    asteroid.setFixedRotation(true);
    let speed = Math.random() * (asteroidMaxSpeed - asteroidMinSpeed) + asteroidMinSpeed;
    asteroid.asteroidState = asteroidState;
    asteroid.unitType = 'asteroid';
    asteroid.setVelocityX(speed * Math.cos(asteroid.rotation));
    asteroid.setVelocityY(speed * Math.sin(asteroid.rotation));
    return asteroid;
}

// create many asteroids when none exist (or are all destroyed)
function createAsteroids(self) {
    let asteroidLimit = 5;
    let width = config.width;
    let height = config.height;

    for (let i = 0; i < asteroidLimit; ++i) {
        let x, y;
        // makes sure the asteroids spawn sufficiently far away from the ship
        do {
            x = Math.random() * width;
            y = Math.random() * height;
        } while (Math.abs(ship.x - x) < 64 + (32 + (ship.width / 2)) &&
            Math.abs(ship.y - y) < 64 + (32 + (ship.height / 2)))

        let asteroid = createAsteroid(self, x, y, Math.random() * 2 * Math.PI, 1);
        asteroidList.push(asteroid);
    }
}


// handles asteroids per frame, stuff like wrapping around bounds
function manageAsteroids(self) {
    let width = config.width;
    let height = config.height;
    for (let i = 0; i < asteroidList.length; ++i) {
        let asteroid = asteroidList[i];
        if (asteroid.body.velocity.x > 0 && asteroid.x - asteroid.displayWidth / 2 > width) {
            asteroid.x -= width + asteroid.displayWidth;
        } else if (asteroid.body.velocity.x < 0 && asteroid.x + asteroid.displayWidth / 2 < 0) {
            asteroid.x += width + asteroid.displayWidth;
        }

        if (asteroid.body.velocity.y > 0 && asteroid.y - asteroid.displayHeight / 2 > height) {
            asteroid.y -= height + asteroid.displayHeight;
        } else if (asteroid.body.velocity.y < 0 && asteroid.y + asteroid.displayHeight / 2 < 0) {
            asteroid.y += height + asteroid.displayHeight;
        }
    }
}

// handles bullets per frame, stuff like bullet expiration and bounds wrap
function manageBullets(self) {
    let width = config.width;
    let height = config.height;
    for (let i = 0; i < bulletList.length; ++i) {
        let bullet = bulletList[i];

        // destroy bullet if it exists for a certain time
        if (self.time.now - bullet.createdAt > bulletMaxLifespan) {
            bullet.destroy();
            bulletList.splice(i, 1);
            --i;
            continue;
        }

        // wrap bullet around bounds
        if (bullet.x > width) {
            bullet.x -= width;
        } else if (bullet.x < 0) {
            bullet.x += width;
        }

        if (bullet.y > height) {
            bullet.y -= height;
        } else if (bullet.y < 0) {
            bullet.y += height;
        }
    }
}

// ship fire bullet
function fireBullet(self) {
    let bullet = self.matter.add.image(ship.x, ship.y, 'bullet').setCollisionGroup(allyGroup);
    bullet.unitType = 'bullet';
    bullet.setFriction(0, 0);
    bullet.setRotation(ship.rotation)
    bullet.setFixedRotation(true);
    bullet.x += Math.cos(bullet.rotation) * ship.width / 2;
    bullet.y += Math.sin(bullet.rotation) * ship.height / 2;
    bullet.setVelocityX(bulletSpeed * Math.cos(bullet.rotation));
    bullet.setVelocityY(bulletSpeed * Math.sin(bullet.rotation));
    bullet.createdAt = self.time.now;
    bulletList.push(bullet);
}

// applies friction to the ship
function applyFriction() {
    let vxSign = (ship.body.velocity.x < 0) ? -1 : 1;
    let vySign = (ship.body.velocity.y < 0) ? -1 : 1;

    let newVx = ship.body.velocity.x - (vxSign * shipFriction);
    let newVy = ship.body.velocity.y - (vySign * shipFriction);
    
    let newVxSign = (newVx < 0) ? -1 : 1;
    let newVySign = (newVy < 0) ? -1 : 1;
    if (vxSign != newVxSign) newVx = 0;
    if (vySign != newVySign) newVy = 0;
    ship.setVelocity(newVx, newVy);
}

// check if ship is out of bounds, and moves it to other side
function boundsWrap(self) {
    // inaccurate
    let width = config.width;
    let height = config.height;
    if (ship.x > width) {
        ship.x -= width;
    } else if (ship.x < 0) {
        ship.x += width;
    }
    if (ship.y > height) {
        ship.y -= height;
    } else if (ship.y < 0) {
        ship.y += height;
    }
}

function updateHighScoreText() {
    let highScoreNameStr = '';
    let highScoreStr = '';
    highScoreNameStr += 'Name\n';
    highScoreStr += 'Score\n';
    for (let i = 0; i < highScores.length; ++i) {
        let highScoreName = highScores[i].score_name;
        let highScore = highScores[i].score_number;
        highScoreStr += highScore + '\n';
        highScoreNameStr += highScoreName + '\n';
    }
    highScoreText.setText(highScoreStr);
    highScoreNameText.setText(highScoreNameStr);
}

function updateScoreText() {
    if (typeof scoreText != 'undefined') {
        scoreText.setText('Score: ' + score)
    }
}

function updateNameText() {
    let inputStr = name;
    if (name.length < maxNameLength) {
        inputStr += '_';
    }
    userScoreNameText.setText(inputStr);
}

// posts score if reaches requirements
function tryPostScore() {
    if (name.length > 0 && score >= 1000) {
        postHighScore(name, score);
    }
}