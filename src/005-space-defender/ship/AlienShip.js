import Ship from './Ship';
import Bullet from './Bullet';

export default class AlienShip extends Ship {
    constructor(scene, x, y, texture, width, height) {
        super(scene, x, y, texture, width, height);
        this.speed = 10;
        this.fireCooldown = 1;
        this.fireChance = .25;
        this.bulletSpeed = 15;
        scene.enemies.push(this);
    }

    update(time, delta) {
        let player = this.scene.player;
        if (!player || player.beingDestroyed) return;

        // get direction towards the player
        let targetDirection = {
            x: player.x - this.x,
            y: player.y - this.y
        };

        // normalize the direction and adjust to the ship's speed
        let distance = Math.sqrt(targetDirection.x * targetDirection.x + targetDirection.y * targetDirection.y);
        let normalizedDirection = {
            x: (targetDirection.x / distance),
            y: (targetDirection.y / distance),
        };
        this.velocity = {
            x: this.speed * normalizedDirection.x,
            y: this.speed * normalizedDirection.y
        }

        super.update(time, delta);

        if (time >= this.lastFired + this.fireCooldown * 1000) {
            this.fire(normalizedDirection);
            this.lastFired = time;
        }
    }

    fire(normalizedDirection) {
        if (Math.random() < this.fireChance) {
            let bulletVelocity = {
                x: this.bulletSpeed * normalizedDirection.x,
                y: this.bulletSpeed * normalizedDirection.y
            };
            new Bullet(this.scene, this, this.x, this.y, 'alien-bullet', 5, 5, bulletVelocity.x, bulletVelocity.y);
        }
    }

    destroy() {
        if (this.beingDestroyed) return;
        this.scene.enemies.splice(this.scene.enemies.indexOf(this), 1);
        super.destroy();
        this.beingDestroyed = true;
    }
}