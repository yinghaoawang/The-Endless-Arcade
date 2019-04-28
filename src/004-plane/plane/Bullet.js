import Phaser from 'phaser3';
export default class Bullet extends Phaser.GameObjects.Sprite {
    constructor(scene, x, y, texture, speed) {
        super(scene, x, y, texture);
        this.speed = speed;
    }

    update(time, delta) {
        this.x += Math.cos(this.rotation) * ((this.speed * delta) / 1000);
        this.y += Math.sin(this.rotation) * ((this.speed * delta) / 1000);
    }
}