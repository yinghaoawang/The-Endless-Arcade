import AbstractWindow from './AbstractWindow';
import StaticWindowFrame from '../window_component/StaticWindowFrame';
import WindowContent from '../window_component/WindowContent';

export default class StaticWindow extends AbstractWindow {
    constructor(scene, x, y, width, height) {
        super(scene, x, y, width, height);

        this._depth = 0;

        this.windowFrame = new StaticWindowFrame(scene, this, this.x, this.y, this.width, this.height, name);

        this.contentWidth = this.viewportArea.width;
        this.contentHeight = this.viewportArea.height;

        this.windowContent = new WindowContent(scene, this, this.x , this.y, this.contentWidth, this.contentHeight)

        this.windowComponents = [ this.windowContent, this.windowFrame, ]
    }

    onpointerdown() {
    }

    get depth() {
        return this._depth;
    }
    set depth(value) {
        this._depth = value;
        this.windowComponents.forEach(component => {
            component.setDepth(value);
        })
    }

    setDepth(value) {
        this.depth = value;
    }

    update() {
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
    
    destroy(removeFromScene, destroyChild) {
        this.windowComponents.forEach((component) => {
            component.destroy(removeFromScene, destroyChild);
        });
        this.scene.windows.splice(this.scene.windows.indexOf(this), 1);
        super.destroy(removeFromScene, destroyChild);
    }
}
