import Phaser from 'phaser3';
import WindowFrame from './WindowFrame';

export default class Window extends Phaser.GameObjects.Group {
    constructor(scene, x, y, width, height, name) {
        super(scene);
        this.scene = scene;
        if (typeof width == 'undefined') {
            width = 400;
        }
        if (typeof height == 'undefined') {
            height = 300;
        }

        if (typeof scene.windows == 'undefined') {
            scene.windows = [];
        }
        scene.windows.unshift(this);
        this.beingDestroyed = false;
        
        this.windowMoveListeners = [];

        this.windowFrame = new WindowFrame(scene, this, x, y, this.width, this.height, name);
        this.add(this.windowFrame);

        this._contentCoords = {
            x: this.windowFrame.paneMargin,
            y: this.windowFrame.topBar.height,
            width: this.windowFrame.width - this.windowFrame.paneMargin * 2,
            height: this.windowFrame.height - this.windowFrame.paneMargin * 2,
        }
    }

    get contentCoords() {
        return this._contentCoords;
    }

    get x() {
        return this.windowFrame.x;
    }

    get y() {
        return this.windowFrame.y;
    }

    set x(value) {
        this.windowFrame.x = value;
    }

    set y(value) {
        this.windowFrame.y = value;
    }

    setPosition(x, y) {
        this.x = x;
        this.y = y;
    }
}

export function bringWindowToTop(target) {
    if (target instanceof WindowFrame) {
        target = target.parentWindow;
    }
    target.scene.windows.splice(target.scene.windows.indexOf(target), 1);
    target.scene.windows.push(target);
    let z = 0;
    target.scene.windows.forEach((window) => {
        window.getChildren().forEach((child) => {
            child.setDepth(z++);
        })
    })
}
