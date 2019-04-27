import Phaser from 'phaser3';

export default class AbstractWindow extends Phaser.GameObjects.Group {
    constructor(scene, x, y, width, height) {
        super(scene);
        this.x = x;
        this.y = y;
        this.scene = scene;
        this.width = width;
        this.height = height;
        this.beingDestroyed = false;
        this.windowComponents = [];
    }

    update() {
        
    }

    destroy(removeFromScene, destroyChild) {
        this.windowComponents.forEach((component) => {
            component.destroy(removeFromScene, destroyChild);
        });
        super.destroy(removeFromScene, destroyChild);
    }
}