import Phaser from 'phaser3';

export default class Text extends Phaser.GameObjects.Text {
    constructor(scene, x, y, text, width) {
        super(scene, x, y, text);
        this.setStyle({
            color: '#000000',
            fontFamily: 'VT323',
        });
        
        if (typeof width != 'undefined') {
            this.setWordWrapWidth(width);
        }

        this.setOrigin(0);
    }
}
