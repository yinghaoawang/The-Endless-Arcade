import AbstractWindow from './AbstractWindow';
import WindowFrame from './WindowFrame';
import WindowContent from './WindowContent';
import WindowComponent from './WindowComponent';

export default class Window extends AbstractWindow {
    constructor(scene, x, y, width, height, name) {
        super(scene, x, y, width, height);
        
        if (typeof scene.windows == 'undefined') {
            scene.windows = [];
        }
        scene.windows.unshift(this);
        
        this.windowMoveListeners = [];

        this.windowFrame = new WindowFrame(scene, this, this.x, this.y, this.width, this.height, name);

        this.contentWidth = this.viewportArea.width;
        this.contentHeight = this.viewportArea.height * 1.5;

        this.windowContent = new WindowContent(scene, this, this.x , this.y, this.contentWidth, this.contentHeight)

        this.windowComponents.push(this.windowContent);
        this.windowComponents.push(this.windowFrame);

        bringWindowToTop(this);
    }

    

    get isSelected() {
        return this.scene.selectedWindow === this;
    }

    get viewportArea() {
        return this.windowFrame.viewportArea;
    }

    setPosition(x, y) {
        this.x = x;
        this.y = y;
    }

    onpointerdown() {
        let windowGroup = this;
        if (this instanceof WindowComponent) {
            windowGroup = this.parentWindow;
        }
          
        if (windowGroup.beingDestroyed) return;
        this.scene.selectedWindow = windowGroup;
        bringWindowToTop(windowGroup);
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
        this.scene.sound.play('window-close');
        this.destroy(true, true);
    }
    
    destroy(removeFromScene, destroyChild) {
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
