import Phaser from 'phaser3';

export default class Text extends Phaser.GameObjects.Text {
    constructor(scene, x, y, text) {
        super(scene, x, y, text);
        this.setStyle({
            color: '#000000',
            //backgroundColor: '#ffffff',
            fontFamily: 'VT323',
        });
        this.setOrigin(0);
    }
}