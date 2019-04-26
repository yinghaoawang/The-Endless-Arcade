import Phaser from 'phaser3';
import WindowFrame from './WindowFrame';
import WindowContent from './WindowContent';
import WindowComponent from './WindowComponent';

export default class Window extends Phaser.GameObjects.Group {
    constructor(scene, x, y, width, height, name) {
        super(scene);
        this.x = x;
        this.y = y;
        this.scene = scene;
        this.width = width;
        this.height = height;

        if (typeof scene.windows == 'undefined') {
            scene.windows = [];
        }
        scene.windows.unshift(this);
        this.beingDestroyed = false;
        
        this.windowMoveListeners = [];

        this.windowFrame = new WindowFrame(scene, this, this.x, this.y, this.width, this.height, name);

        this.contentHeight = this.contentPos.height * 1.5;
        this.windowContent = new WindowContent(scene, this, this.x , this.y, this.contentPos.width, this.contentHeight)

        this.windowComponents = [ this.windowContent, this.windowFrame, ]
        //this.windowComponents = [ this.windowFrame , this.windowContent, ]

        bringWindowToTop(this);
    }

    update() {
        
    }

    get contentPos() {
        return this.windowFrame.contentPos;
    }
    setPosition(x, y) {
        this.x = x;
        this.y = y;
    }

    onpointerdown() {
        if (this.beingDestroyed) return;
        this.scene.selectedWindow = this;
        bringWindowToTop(this);
    }

    ondragstart(pointer) {
        let windowGroup = this.parentWindow;
        windowGroup.dragDistX = pointer.x - this.x;
        windowGroup.dragDistY = pointer.y - this.y;
    }

    ondrag(pointer) {
        let windowGroup = this.parentWindow;
        windowGroup.windowComponents.forEach((component) => {
            component.x = pointer.x - windowGroup.dragDistX;
            component.y = pointer.y - windowGroup.dragDistY;
            if (typeof component.windowMoveListeners != 'undefined') { 
                component.triggerEvent('windowmove');
            }
        });
        
    }

    close() {
        this.destroy(true, true);
    }
    
    destroy(removeFromScene, destroyChild) {
        this.windowComponents.forEach((component) => {
            component.destroy(removeFromScene, destroyChild);
        });
        this.scene.windows.splice(this.scene.windows.indexOf(this), 1);
        super.destroy(removeFromScene, destroyChild);
    }
}

export function bringWindowToTop(target) {
    if (target instanceof WindowComponent) {
        target = target.parentWindow;
    }
    target.scene.windows.splice(target.scene.windows.indexOf(target), 1);
    target.scene.windows.push(target);
    let z = 0;
    target.scene.windows.forEach((window) => {
        window.windowComponents.forEach((component) => {
            component.setDepth(z++);
        })
    })
}
