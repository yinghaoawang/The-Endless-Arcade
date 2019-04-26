import Phaser from 'phaser3';
import WindowFrame from './WindowFrame';
import WindowContent from './WindowContent';
import WindowComponent from './WindowComponent';

export default class Window extends Phaser.GameObjects.Group {
    constructor(scene, x, y, width, height, name) {
        super(scene);
        this.scene = scene;
        this.width = width;
        this.height = height;

        if (typeof scene.windows == 'undefined') {
            scene.windows = [];
        }
        scene.windows.unshift(this);
        this.beingDestroyed = false;
        
        this.windowMoveListeners = [];

        this.windowFrame = new WindowFrame(scene, this, x, y, this.width, this.height, name);
        //this.add(this.windowFrame);

        this.contentHeight = this.contentPos.height * 1.5;
        //this.windowContent = new WindowContent(scene, this, this.x, this.y, this.contentPos.width, this.contentHeight)
        //this.add(this.windowContent);


        this.windowComponents = [/*this.windowContent,*/ this.windowFrame, ]

        bringWindowToTop(this);
    }

    get contentPos() {
        return this.windowFrame.contentPos;
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

    onpointerdown() {
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
        this.destroy();
    }
    
    destroy() {
        this.windowComponents.forEach((component) => {
            component.destroy();
        });
        this.scene.windows.splice(this.scene.windows.indexOf(this), 1);
        super.destroy();
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
