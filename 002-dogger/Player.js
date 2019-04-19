class Doggo extends Phaser.GameObjects.Image {
    constructor (scene, x, y) {
        super(scene, x, y);
        this.setTexture('doggo');
        this.setPosition(x, y);
    }
}

class Horsie extends Phaser.GameObjects.Image {
    constructor(scene, x, y) {
        super(scene, x, y);
        this.setTexture('horse1');
        this.setPosition(x, y);
    }
}