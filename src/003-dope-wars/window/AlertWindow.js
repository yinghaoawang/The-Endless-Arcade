import Window from './Window';
import Text from '../input/text/Text';

export default class AlertWindow extends Window {
    constructor(scene, x, y, message) {
        super(scene, x, y, 300, 150, 'Alert');
        this.width = 300;
        this.height = 150;
        
        this.textMargin = 10;
        this.messageText = new Text(scene, 0, -1 * this.height / 2 + this.topBar.height + this.paneMargin + this.textMargin / 2, message, this.width - this.paneMargin - this.textMargin);
        this.messageText.setOrigin(.5, 0);
        this.messageText.setMaxLines(5);
        this.add(this.messageText);
    }
}