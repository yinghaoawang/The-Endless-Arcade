import Phaser from 'phaser3';
export default class Bullet extends Phaser.Physics.Matter.Sprite {
    constructor(scene, x, y, damage, texture, speed, rotationPath) {
        super(scene.matter.world, x, y, texture);
        this.damage = damage;
        this.scene = scene;
        this.speed = speed;
        this.t = 0;
        this.rotationPath = rotationPath;
    }

    update(time, delta) {
        this.rotation = this.rotationPath;
        this.x += Math.cos(this.rotationPath) * ((this.speed * delta) / 1000);
        this.y += Math.sin(this.rotationPath) * ((this.speed  * delta) / 1000);
        if (typeof this.function != 'undefined') {
            this.x += Math.cos(this.rotationPath) * this.function.x(this.t);
            this.y += Math.sin(this.rotationPath) * this.function.y(this.t);
            this.t += delta * .1;
        } 
    }
}