import Phaser from 'phaser3';
import Gun from './Gun';
import Bullet from './Bullet';

export default class Plane extends Phaser.GameObjects.Sprite {
    constructor(scene, x, y, width, height, texture, speed, gun) {
        super(scene, x, y, texture);
        if (typeof speed == 'undefined') speed = 200;
        if (typeof gun == 'undefined') gun = new Gun(50, 5, 500, 'bullet');
        this.speed = speed;
        this.setDisplaySize(width, height);
        this.setInteractive({
            pixelPerfect: true,
        });
        this.gun = gun;

        this.lastFired = 0;
    }

    fire(time, delta) {
        if (time > this.lastFired + this.cooldown) {
            this.gun.patterns.forEach(pattern => {
                let bullet = new Bullet(this.scene, this.x, this.y - this.displayHeight / 2, this.gun.bulletTexture, this.gun.bulletSpeed);
                bullet.rotationPath = this.rotation + pattern.direction * 2;
                //bullet.t = pattern.direction;
                bullet.function = pattern.function;
                this.scene.bullets.push(bullet);
                this.scene.add.existing(bullet);
                this.lastFired = time;
            });
            
        }
    }

    get cooldown() {
        return 1000 / this.gun.fireRate;
    }
}