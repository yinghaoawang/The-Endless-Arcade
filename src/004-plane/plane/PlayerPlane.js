import Plane from './Plane';

export default class PlayerPlane extends Plane {
    constructor(scene, x, y, width, height, texture, speed) {
        super(scene, x, y, width, height, texture, speed, undefined, 5);
        this.rotation = -Math.PI / 2;
        this._health = 5;
        this.setInteractive({
            pixelPerfect: true,
            useHandCursor: true
        });

        this.on('pointerdown', this.gun.nextLevel.bind(this.gun));

        this.setCollisionCategory(scene.allyCollCat);
        this.setCollidesWith([scene.enemyCollCat, scene.enemyBulletCollCat]);
        if (this.gun) {
            this.gun.collisionCategory = scene.allyBulletCollCat;
            this.gun.collidesWith = [scene.enemyDestructableBulletCollCat, scene.enemyCollCat];
        }

        this.propertyChangeListeners = [];

        this.density *= 999999999;
    }
    get health() {
        return this._health;
    }
    set health(value) {
        this._health = value;
        if (typeof this.propertyChangeListeners != 'undefined') {
            this.propertyChangeListeners.forEach(fn => {
                fn();
            });
        }
    }
}