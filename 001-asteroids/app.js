var config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    physics: {
        default: 'matter',
        matter: {
            debug: true,
            gravity: { x:0, y: 0 },
            friction: 0,
            airFriction: 0
        }
    },
    scene: {
        preload: preload,
        create: create,
        update: update
    }
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
var highScores;

var cursors;
var wasd;

var controls;
var ship;
var shipAcc = .1;
var shipMaxSpeed = 5;
var shipRotationSpeed = .065;
var shipFriction = .025;

var fireBulletCooldown = 200;
var fireBulletTimer = 0;

var bulletSpeed = 8;
var bulletMaxLifespan = 600;

var bulletList = [];

var asteroidMinSpeed = 1;
var asteroidMaxSpeed = 4;
var asteroidList = [];

var allyCategory;
var enemyCategory;

var asteroidImageNames = ['asteroid1', 'asteroid2', 'asteroid3'];

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
    cursors.space = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
    wasd = {
        up: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W),
        down: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S),
        left: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A),
        right: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D),
        space: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.PERIOD),
        reset: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ENTER),
        start: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ENTER)
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
        
        if (allyObject.unitType == "bullet") {
            let arrIndex = bulletList.indexOf(allyObject);
            bulletList.splice(arrIndex, 1);
            allyObject.destroy();

            if (enemyObject.unitType == "asteroid") {
                destroyAsteroid(self, enemyObject);
            }
        } else if (allyObject.unitType == "ship") {
            destroyAsteroid(self, enemyObject);
            ship.destroy();
            isGameOver = true;
            createGameOverMenu(self);
        } else {
            console.error("Unknown unit type: " + allyObject.unitType);
        }
    });

    createMainMenu(this);
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
    score = 0;
}

function init(self) {
    // create ship
    isPlaying = true;
    isMainMenu = false;
    ship = self.matter.add.image(400, 100, 'ship').setCollisionGroup(allyGroup);
    ship.setFriction(0, 0);
    ship.setFixedRotation(true);
    ship.unitType = "ship";
}

function createGameOverMenu(self) {

}

function createMainMenu(self) {
    isMainMenu = true;
}

function resetGameCheck(self) {
    let resetPressed = false;
    for (let i = 0; i < nameKeyArray.length; ++i) {
        let key = nameKeyArray[i];
        if (nameKey[key].isDown) {
            console.log(key);
        }
    }
    if (resetPressed) {
        reset(self);
        isMainMenu = true;
        createMainMenu(self);
    }
}

// destroy asteroid and clean up references, asteroid splits if big or med
function destroyAsteroid(self, asteroid) {
    score += 50;
    let arrayIndex = asteroidList.indexOf(asteroid);
    asteroidList.splice(arrayIndex, 1);
    // splits the asteroid
    if (asteroid.asteroidState < 4) {
        let splitAsteroid1 = createAsteroid(self, asteroid.x, asteroid.y, asteroid.rotation - .2, asteroid.asteroidState + 1);
        let speed = Math.random() * (asteroidMaxSpeed - asteroidMinSpeed) + asteroidMinSpeed;
        splitAsteroid1.setVelocityX(speed * Math.cos(splitAsteroid1.rotation));
        splitAsteroid1.setVelocityY(speed * Math.sin(splitAsteroid1.rotation));
        asteroidList.push(splitAsteroid1);

        let splitAsteroid2 = createAsteroid(self, asteroid.x, asteroid.y, asteroid.rotation + .2, asteroid.asteroidState + 1);
        speed = Math.random() * (asteroidMaxSpeed - asteroidMinSpeed) + asteroidMinSpeed;
        splitAsteroid2.setVelocityX(speed * Math.cos(splitAsteroid2.rotation));
        splitAsteroid2.setVelocityY(speed * Math.sin(splitAsteroid2.rotation));

        asteroidList.push(splitAsteroid2);
    }
    asteroid.destroy();
}

function startCheck(self) {
    let startPressed = false;
    for (let i = 0; i < controls.length; ++i) {
        let scheme = controls[i];
        if (scheme.hasOwnProperty('start') && scheme.start.isDown) startPressed = true;
    }
    if (startPressed) {
        init(self);
        isMainMenu = false;
    }
}

function update() {
    // these are terrible function names but i'm not just very creative
    if (isMainMenu) {
        startCheck(this);
    } else if (isPlaying) {
        if (isGameOver) {
            resetGameCheck(this);
        } else {
            // Keyboard listener
            movementCheck();
            fireBulletCheck(this);

            // Bounds wrap
            boundsWrap(this);
            
            // asteroids stuff
            if (asteroidList.length == 0) {
                createAsteroids(this);
            }
        }
        // deletes bullet if they expire, and wraps them
        manageBullets(this);
        manageAsteroids(this);
    }
}

function manageAsteroids(self) {
    let width = config.width;
    let height = config.height;
    for (let i = 0; i < asteroidList.length; ++i) {
        let asteroid = asteroidList[i];
        if (asteroid.body.velocity.x > 0 && asteroid.x - asteroid.width / 2 > width) {
            asteroid.x -= width + asteroid.width;
        } else if (asteroid.body.velocity.x < 0 && asteroid.x + asteroid.width / 2 < 0) {
            asteroid.x += width + asteroid.width;
        }

        if (asteroid.body.velocity.y > 0 && asteroid.y - asteroid.height / 2 > height) {
            asteroid.y -= height + asteroid.height;
        } else if (asteroid.body.velocity.y < 0 && asteroid.y + asteroid.height / 2 < 0) {
            asteroid.y += height + asteroid.height;
        }
    }
}

// creates a single asteroid
function createAsteroid(self, x, y, rotation, asteroidState) {

    let randIndex = Math.floor(asteroidImageNames.length * Math.random());
    let randAsteroidImageName = asteroidImageNames[randIndex];
    console.log(randAsteroidImageName);
    let asteroid = self.matter.add.image(x, y, randAsteroidImageName).setCollisionGroup(enemyGroup);
    asteroid.setFriction(0, 0);
    asteroid.setRotation(rotation);
    asteroid.setFixedRotation(true);
    let speed = Math.random() * (asteroidMaxSpeed - asteroidMinSpeed) + asteroidMinSpeed;
    asteroid.asteroidState = asteroidState;
    asteroid.unitType = "asteroid";
    let vxSign = (Math.random() < .5) ? 1 : -1;
    let vySign = (Math.random() < .5) ? 1 : -1;
    asteroid.setVelocityX(vxSign * speed * Math.cos(asteroid.rotation));
    asteroid.setVelocityY(vySign * speed * Math.sin(asteroid.rotation));
    return asteroid;
}

// create many asteroids
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

function fireBulletCheck(self) {
    let spacePressed = false;
    for (let i = 0; i < controls.length; ++i) {
        let scheme = controls[i];
        if (scheme.space.isDown) spacePressed = true;
    }

    if (spacePressed) {
        let canFireBullet = (fireBulletTimer - self.time.now <= 0) ? true : false;
        if (canFireBullet) {
            fireBullet(self, ship.x, ship.y, ship.rotation);
            fireBulletTimer = self.time.now + fireBulletCooldown;
        }
    }
}

function fireBullet(self) {
    let bullet = self.matter.add.image(ship.x, ship.y, 'bullet').setCollisionGroup(allyGroup);
    bullet.unitType = "bullet";
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
    ship.body.rotation = ship.rotation;
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