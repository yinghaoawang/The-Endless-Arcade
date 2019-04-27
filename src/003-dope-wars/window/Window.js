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

        this.windowFrame = new WindowFrame(scene, this, this.x, this.y, width, height, name);

        this.contentWidth = this.viewportArea.width;
        this.contentHeight = this.viewportArea.height * 1.25;

        this.windowContent = new WindowContent(scene, this, this.x , this.y, this.contentWidth, this.contentHeight)

        this.windowComponents.push(this.windowFrame);
        this.windowComponents.push(this.windowContent);
        
        this.focus();
    }

    get width() {
        return this._width;
    }
    set width(value) {
        this._width = value;
        if (typeof this.windowFrame != 'undefined') this.windowFrame.width = value;
    }
    get height() {
        return this._height;
    }
    set height(value) {
        this._height = value;
        if (typeof this.windowFrame != 'undefined') this.windowFrame.height = value;
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

    focus() {
        if (this.scene.selectedWindow) {
            this.scene.selectedWindow.windowFrame.closeBtn.setAlpha(this.scene.selectedWindow.windowFrame.defaultAlpha);
            this.scene.selectedWindow.windowFrame.topBar.setAlpha(this.scene.selectedWindow.windowFrame.defaultAlpha);
            this.scene.selectedWindow.windowFrame.backgroundImage.setAlpha(this.scene.selectedWindow.windowFrame.defaultAlpha);
        }
        this.scene.selectedWindow = this;
        this.windowFrame.topBar.setAlpha(1);
        this.windowFrame.backgroundImage.setAlpha(1);
        this.windowFrame.closeBtn.setAlpha(1);

        this.bringToTop();
    }

    onpointerdown() {
        let windowGroup = this;
        if (this instanceof WindowComponent) {
            windowGroup = this.parentWindow;
        }
        if (windowGroup.beingDestroyed) return;
        
        windowGroup.focus();
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

    bringToTop() {
        let target = this;
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
}
