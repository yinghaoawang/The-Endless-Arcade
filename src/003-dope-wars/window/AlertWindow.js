import Window from './base/Window';
import Text from '../input/text/Text';

export default class AlertWindow extends Window {
    constructor(scene, x, y, message) {
        super(scene, x, y, 250, 150, 'Alert');
        this.textMargin = 10;
        this.messageText = new Text(scene, 0, this.textMargin / 2, this.width - this.textMargin, this.height - this.textMargin, message);
        this.windowContent.pane.add(this.messageText);
        scene.sound.play('alert');
    }
}