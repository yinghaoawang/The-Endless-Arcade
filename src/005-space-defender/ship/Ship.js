import Phaser from 'phaser3';

export default class Ship extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y, texture, width, height) {
        super(scene, x, y, texture);
        this._width = width;
        this._height = height;
        

        this.lastFired = Number.NEGATIVE_INFINITY;

        this.velocity = {
            x: 0, y: 0,
        }
        
        scene.add.existing(this);
        scene.physics.add.existing(this);
        this.setDisplaySize(this._width, this._height);

        this.body.setCollideWorldBounds();

        
    }

    destroy() {
        if (this.beingDestroyed) return;
        this.scene.physics.world.remove(this);
        super.destroy();
        this.beingDestroyed = true;
    }

    get width() {
        return this._width;
    }
    set width(value) {
        this._width = value;
        this.setDisplaySize(this._width, this._height);
    }
    get height() {
        return this._height;
    }
    set height(value) {
        this._height = value;
        this.setDisplaySize(this._width, this._height);
    }

    update(time, delta) {
        this.x += (this.velocity.x * delta) / 100;
        this.y += (this.velocity.y * delta) / 100;
    }
}