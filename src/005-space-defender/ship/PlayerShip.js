import Ship from './Ship';
import Bullet from './Bullet';

const playerMaxSpeed = 40;
const playerAcceleration = 10;
const playerFriction = 1;

export default class PlayerShip extends Ship {
    constructor(scene, x, y, width, height) {
        super(scene, x, y, 'player-ship', width, height);
        this.lastFired = Number.NEGATIVE_INFINITY;
        this.bulletSpeed = 100;
        this.fireCooldown = .75;
        this.maxSpeed = playerMaxSpeed;
        this.acceleration = playerAcceleration;
        this.friction = playerFriction;
        this._direction = 'right';

        this.setCircle(this.height / 2, 22, 0);
    }

    get direction() {
        return this._direction;
    }

    set direction(value) {
        this._direction = value;
        if (value == 'left') {
            this.flipX = true;
        } else if (value == 'right') {
            this.flipX = false;            
        } else {
            console.error('Invalid direction parameter: ' + value);
        }
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

    fire(time, delta) {
        if (time >= this.lastFired + this.fireCooldown * 1000) {
            let bulletArea = {
                x: this.x + (this.direction == 'left' ? -(this.width / 2 + 50) : (this.width / 2 + 50)),
                y: this.y,
                width: 120,
                height: 8
            };
            let bulletVelocity = {
                x: this.bulletSpeed * (this.direction == 'left' ? -1 : 1),
                y: 0
            };
            let bullet = new Bullet(this.scene, this, bulletArea.x, bulletArea.y, 'player-beam', bulletArea.width, bulletArea.height, bulletVelocity.x, bulletVelocity.y);
            if (this.direction == 'left') bullet.flipX = true;
            this.lastFired = time;
        }
    }
}