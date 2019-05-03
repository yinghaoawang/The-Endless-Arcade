import Ship from './Ship';

const playerMaxSpeed = 50;
const playerAcceleration = 10;
const playerFriction = 1;

export default class PlayerShip extends Ship {
    constructor(scene, x, y, width, height) {
        super(scene, x, y, 'player-ship', width, height)
        //this.verticalSpeed = playerVerticalSpeed;
        this.maxSpeed = playerMaxSpeed;
        this.acceleration = playerAcceleration;
        this.friction = playerFriction;
    }

    update(time, delta) {
        let sign = {};
        sign.x = this.velocity.x < 0 ? -1 : 1;
        sign.y = this.velocity.y < 0 ? -1 : 1;

        if (Math.abs(this.velocity.x) > this.maxSpeed) this.velocity.x = sign.x * this.maxSpeed;
        if (Math.abs(this.velocity.y) > this.maxSpeed) this.velocity.y = sign.y * this.maxSpeed;

        super.update(time, delta);

        if (Math.abs(this.velocity.x) - (this.friction * delta) / 100 < 0) this.velocity.x = 0;
        else this.velocity.x += -1 * sign.x * (this.friction * delta) / 100;

        if (Math.abs(this.velocity.y) - (this.friction * delta) / 100 < 0) this.velocity.y = 0;
        else this.velocity.y += -1 * sign.y * (this.friction * delta) / 100;
    }

    fire() {
        
    }
}