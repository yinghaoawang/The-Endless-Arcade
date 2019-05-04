import AlienShip from './AlienShip';

export default class JellyShip extends AlienShip {
    constructor(scene, x, y, texture, width, height) {
        super(scene, x, y, texture, width, height);
        this.speed = 40;
        this.moveCooldown = 1;
        this.moveDuration = .5;
        this.isMoving = false;
        this.startedMoving = Number.NEGATIVE_INFINITY;
        this.lastMoved = Number.NEGATIVE_INFINITY;
    }

    update(time, delta) {
        if (this.beingDestroyed || !this.scene.player || this.scene.player.beingDestroyed) return;

        if (!this.isMoving) {
            if (time >= this.lastMoved + (1 + Math.random() * .5) * this.moveCooldown * 1000) {
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
                this.startedMoving = time;
                this.isMoving = true;
            }
            
        } else {
            // it is moving, then make sure it stops moving after designated time
            if (time >= this.startedMoving + (1 + Math.random() * .5) * this.moveDuration * 1000) {
                this.velocity = {
                    x: 0, y: 0,
                };
                this.lastMoved = time;
                this.isMoving = false;
            }
        }
            
        
        this.x += (this.velocity.x * delta) / 100;
        this.y += (this.velocity.y * delta) / 100;
    }
}