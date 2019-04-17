var config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    physics: {
        default: 'matter',
        matter: {
            debug: true,
            gravity: { y: 0 }
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
var movementControls;
var ship;
var shipAcc = .1;
var shipMaxSpeed = 5;
var shipRotationSpeed = .065;
var shipFriction = .025;

function preload() {
    this.load.setBaseURL('');
    this.load.image('ship', 'assets/sprites/ship.png');
}

function create() {
    ship = this.matter.add.image(400, 100, 'ship');
    ship.setFriction(0);
    ship.setFrictionAir(0);
    cursors = this.input.keyboard.createCursorKeys();
    wasd = {
        up: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W),
        down: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S),
        left: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A),
        right: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D)
    }
    movementControls = [cursors, wasd];
}

function update() {
    // these are terrible function names but i'm not just very creative

    // Keyboard listener
    movementCheck();
    // Bounds wrap
    boundsWrap(this);
    
}

// moves the ship based on input keys
function movementCheck() {
    let upPressed = false;
    let downPressed = false;
    let leftPressed = false;
    let rightPressed = false;
    for (let i = 0 ; i < movementControls.length; ++i) {
        let scheme = movementControls[i];
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

    // apply friction
    let newVx = ship.body.velocity.x - shipFriction * Math.cos(ship.rotation);
    let newVy = ship.body.velocity.y - shipFriction * Math.sin(ship.rotation);
    if (newVx < 0) newVx = 0;
    if (newVy < 0) newVy = 0;
    ship.setVelocity(newVx, newVy);

    // prevents ship from going faster than its max speed
    let currShipSpeedSquared = ship.body.velocity.y * ship.body.velocity.y + ship.body.velocity.x * ship.body.velocity.x;
    if (currShipSpeedSquared > shipMaxSpeed * shipMaxSpeed) {
        let currShipSpeed = Math.sqrt(currShipSpeedSquared);
        let newVx = (ship.body.velocity.x / currShipSpeed) * shipMaxSpeed;
        let newVy = (ship.body.velocity.y / currShipSpeed) * shipMaxSpeed;
        ship.setVelocity(newVx, newVy);
    }
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