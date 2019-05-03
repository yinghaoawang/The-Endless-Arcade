import Phaser from 'phaser3';

export default class Bullet extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, owner, x, y, texture, width, height, xVelocity, yVelocity) {
        super(scene, x, y, texture);
        this.owner = owner;
        this.width = width;
        this.height = height;
        this.setDisplaySize(width, height);
        this.xVelocity = xVelocity;
        this.yVelocity = yVelocity;

        scene.bullets.push(this);
        scene.add.existing(this);
        scene.physics.add.existing(this);
    }

    update(time, delta) {
        this.x += (this.xVelocity * delta) / 100;
        this.y += (this.yVelocity * delta) / 100;
        if (this.x - this.width / 2 > this.scene.worldWidth) this.destroy();
        else if (this.x + this.width / 2 < 0) this.destroy();
        else if (this.y - this.height / 2 > this.scene.worldHeight) this.destroy();
        else if (this.y + this.height / 2 < 0) this.destroy();
    }

    destroy() {
        if (this.beingDestroyed) return;
        this.scene.bullets.splice(this.scene.bullets.indexOf(this), 1);
        this.scene.physics.world.remove(this);
        super.destroy();
        this.beingDestroyed = true;
    }

}