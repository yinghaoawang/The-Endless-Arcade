let config = {
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

function preload() {
    this.load.setBaseURL('');
    this.load.image('ship', 'assets/sprites/ship.png');
}

function create () {
    console.log(this);

    let ship = this.physics.add.image(400, 100, 'ship');
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

    ship.setCollideWorldBounds(true);
}

function update() {
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
    if (upPressed && !downPressed) {
        console.log("up");
    }
    if (downPressed && !upPressed) {
        console.log("down");
    }
    if (leftPressed && !rightPressed) {
        console.log("left");
    }
    if (rightPressed && !leftPressed) {
        console.log("right");
    }
}