import Plane from './Plane';
export default class AutoPlane extends Plane {
    constructor(scene, x, y, width, height, texture, speed, moveFn, gun, fireChance) {
        super(scene, x, y, width, height, texture, speed, gun);
        this.rotation = Math.PI / 2;
        this.t = 0;
        this.moveFn = moveFn;
        this.setCollisionCategory(scene.enemyCollCat);
        this.setCollidesWith([scene.allyCollCat, scene.allyBulletCollCat]);
        if (gun) {
            this.gun.collisionCategory = scene.enemyBulletCollCat;
            this.gun.collidesWith = [scene.allyCollCat];
        }

        this.soundName = 'enemy-shoot';
    }

    update(time, delta) {
        if (this.beingDestroyed) return;
        let moveFn = this.moveFn;
        if (!this.moveFn) moveFn = (t) => { return { x: 0, y: 1 }; };

        this.x += ((this.speed * delta) / 1000) * moveFn(this.t, this).x;
        this.y += ((this.speed * delta) / 1000) * moveFn(this.t, this).y;

        this.t += delta / 1000;
        if (this.gun) this.fire(time, delta);
    }
}