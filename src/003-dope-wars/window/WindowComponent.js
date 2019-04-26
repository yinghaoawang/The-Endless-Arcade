import Phaser from 'phaser3';

export default class WindowComponent extends Phaser.GameObjects.Group {
    constructor(scene, parentWindow, x, y, width, height) {
        super(scene);
        this.parentWindow = parentWindow;
        this._x = x;
        this._y = y;
        this.width = width;
        this.height = height;

        this.beingDestroyed = false;
        this.windowMoveListeners = [];
    
        scene.add.existing(this);
    }

    get y() {
        return this._y;
    }

    get x() {
        return this._x;
    }

    set x(value) {
        let diff = value - this.x;
        this._x = value;
        this.getChildren().forEach((child) => {
            child.x += diff;
        });
    }

    set y(value) {
        let diff = value - this.y;
        this._y = value;
        this.getChildren().forEach((child) => {
            child.y += diff;
        });
    }

    destroy(removeFromScene, destroyChild) {
        this.beingDestroyed = true;
        super.destroy(removeFromScene, destroyChild);
    }

    triggerEvent(event) {
        if (event == 'windowmove') {
            this.windowMoveListeners.forEach((fn) => {
                fn();
            });
        }
    }

}