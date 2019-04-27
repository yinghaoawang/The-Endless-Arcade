import Phaser from 'phaser3';

export default class AbstractWindow extends Phaser.GameObjects.Group {
    constructor(scene, x, y, width, height) {
        super(scene);
        this.scene = scene;
        
        this._x = x;
        this._y = y;
        this._width = width;
        this._height = height;

        this.beingDestroyed = false;
        this.windowComponents = [];
    }

    get y() {
        return this._y;
    }
    get x() {
        return this._x;
    }
    get width() {
        return this._width;
    }
    get height() {
        return this._height;
    }
    set width(value) {
        this._width = value;
    }
    set height(value) {
        this._height = value;
    }

    update() {
        if (this.beingDestroyed) return;
    }

    destroy(removeFromScene, destroyChild) {
        this.windowComponents.forEach((component) => {
            component.destroy(removeFromScene, destroyChild);
        });
        super.destroy(removeFromScene, destroyChild);
    }
}