import Phaser from 'phaser3';
export default class Bullet extends Phaser.GameObjects.Sprite {
    constructor(scene, x, y, texture, speed) {
        super(scene, x, y, texture);
        this.speed = speed;
        this.t = 0;
        this.rotationPath;
    }

    update(time, delta) {
        this.rotation = this.rotationPath;
        this.x += Math.cos(this.rotationPath) * ((this.speed/2 * delta) / 1000);
        this.y += Math.sin(this.rotationPath) * ((this.speed/2  * delta) / 1000);
        if (typeof this.function != 'undefined') {
            this.x += Math.cos(this.rotationPath) * this.function.x(this.t);
            this.y += Math.sin(this.rotationPath) * this.function.y(this.t);
            console.log(this.x, this.y);
            this.rotation = this.t;
            this.t += .5;
        } 
    }
}