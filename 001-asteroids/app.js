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
        create: create
    }
};

var game = new Phaser.Game(config);

function preload() {
    this.load.setBaseURL('');

    this.load.image('ship', 'assets/sprites/ship.png');
}

function create () {
    console.log(this);

    var ship = this.physics.add.image(400, 100, 'ship');

    ship.setCollideWorldBounds(true);

    emitter.startFollow(ship);
}