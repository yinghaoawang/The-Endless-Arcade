class Doggo extends Phaser.GameObjects.Sprite {
    constructor (scene, x, y) {
        super(scene, x, y, 'doggo');
        this.scene = scene;
        this.scene.add.existing(this);
    }
}

class Horsie extends Phaser.GameObjects.Image {
    constructor(scene, x, y) {
        super(scene, x, y);
        this.setTexture('horse1');
        this.setPosition(x, y);
    }
}