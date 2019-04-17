var config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    physics: {
        default: 'arcade',
        arcade: {
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
var shipAcc = 200;
var shipMaxSpeed = 200;

function preload() {
    this.load.setBaseURL('');
    this.load.image('ship', 'assets/sprites/ship.png');
}

function create () {
    console.log(this);

    ship = this.physics.add.image(400, 100, 'ship');
    cursors = {
        up: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.UP),
        down: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.DOWN),
        left: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT),
        right: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT)
    }
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
        ship.rotation -= .1;
    }
    if (rightPressed && !leftPressed) {
        ship.rotation += .1;
    }
    if (upPressed && !downPressed) {
        ship.body.velocity.x += shipAcc * Math.cos(ship.rotation);
        ship.body.velocity.y += shipAcc * Math.sin(ship.rotation);
    }
    if (downPressed && !upPressed) {
        ship.body.velocity.x -= shipAcc * Math.cos(ship.rotation);
        ship.body.velocity.y -= shipAcc * Math.sin(ship.rotation);
    }

    // inefficient
    let currShipSpeed = Math.sqrt(ship.body.velocity.y * ship.body.velocity.y + ship.body.velocity.x * ship.body.velocity.x);
    if (currShipSpeed > shipMaxSpeed) {
        ship.body.velocity.x = (ship.body.velocity.x / currShipSpeed) * shipMaxSpeed;
        ship.body.velocity.y = (ship.body.velocity.y / currShipSpeed) * shipMaxSpeed;
    }
}

// check if ship is out of bounds, and moves it to other side
function boundsWrap(self) {
    let width = self.physics.world.bounds.width;
    let height = self.physics.world.bounds.height;
    console.log(ship.body.position.x, width);
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