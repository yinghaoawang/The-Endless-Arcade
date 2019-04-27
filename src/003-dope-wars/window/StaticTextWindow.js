import StaticWindow from './StaticWindow';
import TextArea from './TextArea';

export default class StaticTextWindow extends StaticWindow {
    constructor(scene, x, y, width, height) {
        super(scene, x, y, width, height);
        this.textAreaMargin = 3;
        this.windowContent.addComponent(new TextArea(scene, this, this.x + this.viewportArea.x + this.textAreaMargin, this.y + this.viewportArea.y + this.textAreaMargin, this.viewportArea.width - this.textAreaMargin * 2, this.viewportArea.height - this.textAreaMargin * 2));
    
    }
}