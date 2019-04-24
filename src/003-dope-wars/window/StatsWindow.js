import Window from './Window';
import Text from '../text/Text';

export default class StatsWindow extends Window {
    constructor(scene, x, y, user) {
        super(scene, x, y, 300, 300);
        this.user = user;

        let xOffset = -1 * this.width / 2 + this.paneMargin + 10;
        let yOffset = -1 * this.height / 2 + this.topBar.displayHeight + this.paneMargin;

        let colSpacing = 20;
        
        this.createTextCol(10, xOffset, yOffset, colSpacing, ['Name', 'Gold', 'Days', ''])
        
        
    }

    createTextCol(colCount, colXOffset, colYOffset, colDistance, messages) {
        let texts = [];
        if (typeof messages === 'string') {
            messages = [messages];
        }

        let message = '';
        for (let i = 0; i < colCount; ++i) {
            if (i < messages.length) message = messages[i];  
            let text = new Text(this.scene, colXOffset, colYOffset + colDistance * i, message);
            texts.push(text);
            this.add(text);
        }
        return texts;
    }

    update() {
        super.update();
    }
}