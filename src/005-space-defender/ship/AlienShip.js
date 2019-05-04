import Ship from './Ship';
import Bullet from './Bullet';

export default class AlienShip extends Ship {
    constructor(scene, x, y, texture, width, height) {
        super(scene, x, y, texture, width, height);
        this.speed = 10;
        this.fireCooldown = 1;
        this.fireChance = .25;
        this.bulletSpeed = 15;
        this.isFiring = false;
        scene.enemies.push(this);

        this.setCircle(this.width / 2);

        this.wanderDuration = 1000;
        this.nextWanderTime = Number.NEGATIVE_INFINITY;
        this.wanderDistance = 3000;

        this.detectionRadius = 300;
    }

    wander(time, delta) {
        if (time >= this.nextWanderTime) {
            // new wander position
            let targetPosition = {};
            do {
                targetPosition.x = this.x + Math.cos(Math.random() * Math.PI * 2) * this.wanderDistance;
                targetPosition.y = this.y + Math.sin(Math.random() * Math.PI * 2) * this.wanderDistance;
                
            } while (targetPosition.x < 0 || targetPosition.x > this.scene.worldWidth ||
                targetPosition.y < 0 || targetPosition.y > this.scene.worldHeight);

            let targetDirection = {
                x: targetPosition.x - this.x,
                y: targetPosition.y - this.y,
            }

            let distance = Math.sqrt(targetDirection.x * targetDirection.x + targetDirection.y * targetDirection.y);

            let normalizedPosition = {
                x: targetDirection.x / distance,
                y: targetDirection.y / distance,
            }

            this.velocity = {
                x: normalizedPosition.x * this.speed,
                y: normalizedPosition.y * this.speed
            };

            this.nextWanderTime = time + (Math.random() + 1) * this.wanderDuration;
        }
    }

    update(time, delta) {
        let player = this.scene.player;
        if (!player || player.beingDestroyed) {
            this.wander(time, delta);
            super.update(time, delta);
            return;
        };

        // get direction towards the player
        let targetDirection = {
            x: player.x - this.x,
            y: player.y - this.y
        };

        // normalize the direction and adjust to the ship's speed
        let distance = Math.sqrt(targetDirection.x * targetDirection.x + targetDirection.y * targetDirection.y);

        if (distance <= this.detectionRadius) {
            this.chase(targetDirection, distance, time, delta);
        } else {
            this.wander(time, delta);
        }

        super.update(time, delta);
        
    }

    chase(targetDirection, distance, time, delta) {
        let player = this.scene.player;
        // if distance from player close enough then chase player
        let normalizedDirection = {
            x: (targetDirection.x / distance),
            y: (targetDirection.y / distance),
        };
        this.velocity = {
            x: this.speed * normalizedDirection.x,
            y: this.speed * normalizedDirection.y
        }

        if (!this.isFiring && time >= this.lastFired + ((1 + Math.random()) * this.fireCooldown * 1000)) {
            if (Math.random() < this.fireChance) {
                this.isFiring = true;
                this.anims.load('alien-fire');
                this.anims.play('alien-fire');
                this.once('animationcomplete', (anim, frame) => {
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

                let bulletVelocity = {
                    x: this.bulletSpeed * normalizedDirection.x,
                    y: this.bulletSpeed * normalizedDirection.y
                };

                let bullet = new Bullet(this.scene, this, this.x, this.y, 'alien-bullet', 8, 8, bulletVelocity.x, bulletVelocity.y);
                if (bulletVelocity.x < 0) bullet.flipX = true;
                if (bulletVelocity.y > 0) bullet.flipY = true;
                this.isFiring = false;
                
                this.setFrame(0);
                this.lastFired = this.scene.time.now;
            });
            } else {
                this.lastFired = time;
            }
            
            
        }
    }

    destroy() {
        if (this.beingDestroyed) return;
        this.scene.enemies.splice(this.scene.enemies.indexOf(this), 1);
        super.destroy();
        this.beingDestroyed = true;
    }
}