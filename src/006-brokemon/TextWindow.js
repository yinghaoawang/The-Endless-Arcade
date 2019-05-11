import Phaser from 'phaser3';

export default class TextWindow {
    constructor(scene, x, y, width, height) {
        this.scene = scene;
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.createGraphics();
        this.createTextBox();
        this.textLeft = null;
    }
    displayText(text) {
        let split = text.split(' ');
        this.textBox.setText(split);
        console.log(this.textBox.height);
        this.textBox.setText(text);
        console.log(this.textBox.height);
    }

    createTextBox() {
        this.textMargin = 10;
        this.textBox = this.scene.add.text(this.x + this.textMargin, this.y + this.textMargin);
        this.textBox.setStyle({
            fontSize: 34,
            fontFamily: 'VT323',
            wordWrap: { width: this.width - 2 * this.textMargin },
        });
    }

    createGraphics() {
        this.graphics = this.scene.add.graphics({
            x: this.x,
            y: this.y,
            fillStyle: {
                color: 0x999999,
            }
        });
        this.graphics.fillRect(0, 0, this.width, this.height);
    }
}
