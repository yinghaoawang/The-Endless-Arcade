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

var game = new Phaser.Game(config);
var cursors;
var wasd;

var controls;
var ship;
var shipAcc = .1;
var shipMaxSpeed = 5;
var shipRotationSpeed = .065;
var shipFriction = .025;

var fireBulletCooldown = 150;
var fireBulletTimer = 0;

var bulletSpeed = 8;
var bulletMaxLifespan = 1000;

var bulletList = [];

var allyCategory;
var enemyCategory;

function preload() {
    this.load.setBaseURL('');
    this.load.image('ship', 'assets/sprites/ship.png');
    this.load.image('bullet', 'assets/sprites/bullet.png');
}

function create() {
    

    // controls setup
    cursors = this.input.keyboard.createCursorKeys();
    cursors.space = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.Z);
    wasd = {
        up: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W),
        down: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S),
        left: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A),
        right: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D),
        space: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE)
    }
    controls = [cursors, wasd];

    // collision setup
    allyGroup = -1;
    enemyGroup = -2;

    // create ship
    ship = this.matter.add.image(400, 100, 'ship').setCollisionGroup(allyGroup);
    ship.setFriction(0, 0);

    this.matter.world.on('collisionstart', function (event) {
        event.pairs[0].bodyA.gameObject.setTint(0xff0000);
        event.pairs[0].bodyB.gameObject.setTint(0x00ff00);

    });
}

function update() {
    // these are terrible function names but i'm not just very creative

    // Keyboard listener
    movementCheck();
    fireBulletCheck(this);

    // Bounds wrap
    boundsWrap(this);
    
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
    bullet.setFriction(0, 0);
    bullet.setRotation(ship.rotation)
    bullet.setVelocityX(bulletSpeed * Math.cos(bullet.rotation));
    bullet.setVelocityY(bulletSpeed * Math.sin(bullet.rotation));
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