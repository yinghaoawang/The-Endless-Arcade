import Phaser from 'phaser3';
import FiringSchemes from '../gun/FiringSchemes';
import Gun from '../gun/Gun';

export default class Plane extends Phaser.Physics.Matter.Sprite {
    constructor(scene, x, y, width, height, texture, speed, gun, maxHealth) {
        super(scene.matter.world, x, y, texture);
        this.timeCreated = scene.time.now;
        this.timeOutOfBounds = 0;
        this.scene = scene;
        if (typeof speed == 'undefined') speed = 200;
        if (typeof gun == 'undefined') gun = new Gun(FiringSchemes.DEFAULT);
        if (typeof maxHealth == 'undefined') maxHealth = 2;
        this.setDisplaySize(width, height);
        this.speed = speed;
        this.gun = gun;
        this.maxHealth = maxHealth;
        this.health = maxHealth;

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
             this.lastFired = time;

            if (!this.fireChance || Math.random() < this.fireChance) {
                this.gun.shoot(this.scene, this.x + Math.cos(this.rotation) * this.displayWidth / 2, this.y + Math.sin(this.rotation) * this.displayHeight / 2, this.rotation, this);
                if (this.soundName) this.scene.sound.play(this.soundName, { volume: .4, });
            }
            
        }
    }
    update(time, delta) {
        if (this.gun) this.gun.update(this, time, delta);
    }

    get cooldown() {
        return 1000 / this.gun.fireRate;
    }
}