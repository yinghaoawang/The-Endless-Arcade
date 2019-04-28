import StaticWindow from './base/StaticWindow';
import TextAreaComponent from './content_component/TextAreaComponent';

export default class StaticTextWindow extends StaticWindow {
    constructor(scene, x, y, width, height) {
        super(scene, x, y, width, height);
        this.textAreaMargin = 3;
        this.windowContent.components.push((new TextAreaComponent(scene, this, this.x + this.viewportArea.x + this.textAreaMargin, this.y + this.viewportArea.y + this.textAreaMargin, this.viewportArea.width - this.textAreaMargin * 2, this.viewportArea.height - this.textAreaMargin * 2)));
    }
}