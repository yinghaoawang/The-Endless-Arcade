import Ship from './Ship';

export default class AlienShip extends Ship {
    constructor(scene, x, y, texture, width, height, speed) {
        super(scene, x, y, texture, width, height);
        this.speed = speed;
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
        this.velocity = {
            x: this.speed * (targetDirection.x / distance),
            y: this.speed * (targetDirection.y / distance),
        }
        console.log(this.velocity);

        super.update(time, delta);
    }

    fire() {
        
    }
}