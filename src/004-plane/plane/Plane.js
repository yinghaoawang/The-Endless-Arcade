import Phaser from 'phaser3';
import FiringSchemes from './FiringSchemes';
import Gun from './Gun';

export default class Plane extends Phaser.Physics.Matter.Sprite {
    constructor(scene, x, y, width, height, texture, speed, gun) {
        super(scene.matter.world, x, y, texture);
        this.scene = scene;
        if (typeof speed == 'undefined') speed = 200;
        if (typeof gun == 'undefined') gun = new Gun(FiringSchemes.DEFAULT);
        this.setDisplaySize(width, height);
        this.speed = speed;
        this.gun = gun;

        this.lastFired = 0;
    }

    get fireRate() {
        return this.gun.firingPattern.fireRate;
    }
    set fireRate(value) {
        this.gun.firingPattern.fireRate = value;
        
    }

    fire(time, delta) {
        if (time > this.lastFired + this.cooldown) {
            this.gun.shoot(this.scene, this.x, this.y + Math.sin(this.rotation) * this.displayHeight / 2, this.rotation, this);
            this.lastFired = time;
        }
    }

    get cooldown() {
        return 1000 / this.gun.fireRate;
    }
}