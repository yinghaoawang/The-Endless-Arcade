import Plane from './Plane';
export default class AutoPlane extends Plane {
    constructor(scene, x, y, width, height, texture, speed, gun, moveFn, fireChance) {
        super(scene, x, y, width, height, texture, speed, gun);
        this.rotation = Math.PI / 2;
        this.t = 0;
        this.moveFn = moveFn;
    }

    update(time, delta) {
        let moveFn = this.moveFn;
        if (!this.moveFn) moveFn = (t) => { return { x: 0, y: 1 }; };

        this.x += ((this.speed * delta) / 1000) * moveFn(this.t, this).x;
        this.y += ((this.speed * delta) / 1000) * moveFn(this.t, this).y;

        this.t += delta / 1000;
        this.fire(time, delta);
    }
}