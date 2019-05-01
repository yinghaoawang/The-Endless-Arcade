import Plane from './Plane';
export default class AutoPlane extends Plane {
    constructor(scene, x, y, width, height, texture, speed, maxHealth, damage, moveFn, gun, fireChance, targetPlayer) {
        super(scene, x, y, width, height, texture, speed, gun, maxHealth);
        this.damage = damage;
        this.fireChance = fireChance;
        this.targetPlayer = targetPlayer;
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
        if (this.scene.outOfBounds(this)) {
            this.timeOutOfBounds += delta / 1000;
            if (this.timeOutOfBounds > 2000) this.scene.silentDestroyObject(this);
            return;
        } else if (this.gun) {
            if (this.targetPlayer && this.scene.player && !this.scene.player.beingDestroyed) {
                let direction = {
                    x: this.scene.player.x - this.x,
                    y: this.scene.player.y - this.y,
                };
                this.gun.firingPattern.bullets[0].direction = Math.atan2(direction.y, direction.x) - this.rotation;
            }
            this.fire(time, delta);
        }
    }
}