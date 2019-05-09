import Phaser from 'phaser3';

export default class ContentComponent extends Phaser.GameObjects.Group {
    constructor(scene, parentWindow, x, y, width, height) {
        super(scene);
        this.parentWindow = parentWindow;
        this._x = x;
        this._y = y;
        this._width = width;
        this._height = height;

        this._depth = 0;

        scene.add.existing(this);
    }

    get movingComponents() {
        let components = [];
        components.push(...this.getChildren());
        return components;
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

    set x(value) {
        let diff = value - this.x;
        this._x = value;

        this.movingComponents.forEach(component => {
            component.x += diff;
        })
    }

    set y(value) {
        let diff = value - this.y;
        this._y = value;

        this.movingComponents.forEach(component => {
            component.y += diff;
        })
    }

    update() {
        if (this.beingDestroyed) return;
        super.update();
    }

    destroy(removeFromScene, destroyChild) {
        this.beingDestroyed = true;
        super.destroy(removeFromScene, destroyChild);
    }

}
