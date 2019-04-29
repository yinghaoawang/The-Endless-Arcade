import Plane from './Plane';

export default class PlayerPlane extends Plane {
    constructor(scene, x, y, width, height, texture, speed) {
        super(scene, x, y, width, height, texture, speed);
        this.rotation = -Math.PI / 2;
        this.setInteractive({
            pixelPerfect: true,
            useHandCursor: true
        });

        this.on('pointerdown', this.gun.nextLevel.bind(this.gun));

        this.setCollisionCategory(scene.allyCollCat);
        this.setCollidesWith([scene.enemyCollCat, scene.enemyBulletCollCat]);
        if (this.gun) {
            this.gun.collisionCategory = scene.allyBulletCollCat;
            this.gun.collidesWith = [scene.enemyBulletCollCat, scene.enemyCollCat];
        }
    }
}