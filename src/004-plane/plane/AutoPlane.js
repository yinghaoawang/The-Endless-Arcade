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
            this.originalDirections = [];
            for (let i = 0; i < this.gun.firingPattern.bullets.length; ++i) {
                let direction = this.gun.firingPattern.bullets[i].direction;
                this.originalDirections[i] = direction;
            }
        }
        this.soundName = 'enemy-shoot';
    }

    update(time, delta) {
        if (this.beingDestroyed) return;

        let moveFn = this.moveFn;
        if (!this.moveFn) moveFn = (t) => { return { x: 0, y: 1 }; };

        let moveFnDist = Math.sqrt(moveFn(this.t, this).x * moveFn(this.t, this).x + moveFn(this.t, this).y * moveFn(this.t, this).y);
        if (moveFnDist == 0) moveFnDist = 1;

        this.x += ((this.speed * delta) / 1000) * (moveFn(this.t, this).x / moveFnDist);
        this.y += ((this.speed * delta) / 1000) * (moveFn(this.t, this).y / moveFnDist);

        this.t += delta / 1000;
        if (this.scene.outOfBounds(this)) {
            this.timeOutOfBounds += delta / 1000;
            if (this.timeOutOfBounds > 5) this.scene.silentDestroyObject(this);
            return;
        } else if (this.gun) {
            this.timeOutOfBounds = 0;
            if (this.targetPlayer && this.scene.player && !this.scene.player.beingDestroyed) {
                let direction = {
                    x: this.scene.player.x - this.x,
                    y: this.scene.player.y - this.y,
                };
                for (let i = 0; i < this.originalDirections.length; ++i) {
                    let dir = Math.atan2(direction.y, direction.x) - this.rotation + this.originalDirections[i];
                    this.gun.firingPattern.bullets[i].direction = dir;
                };
            }
            this.fire(time, delta);
        } else {
            this.timeOutOfBounds = 0;
        }
        super.update(time, delta);
    }
}