import Phaser from 'phaser3';

import Text from './Text';


// TODO TEST IF THIS CLASS WORKS
export default class NumberTextField extends Text {
    constructor(scene, x, y, width, parentContainer, maxTrueText, text) {
        super(scene, x, y, text);
        this.trueText = text;
        this.trueWidth = width;
        this.trueHeight = this.height;
        this.maxTrueText = maxTrueText;
        this.setWordWrapWidth(width);
        
        this.setMaxLines(1);
        this.setBackgroundColor('#ffffff');
        this.setPadding(2.5, 0, 2.5, 0);
        this.setSize(width - this.padding.left - this.padding.right, this.height - this.padding.top - this.padding.bottom);
        this.setInteractive();
        parentContainer.add(this);
        this.backgroundRect = new Phaser.GameObjects.Rectangle(scene, this.x, this.y, this.trueWidth, this.trueHeight);
        this.backgroundRect.setFillStyle('0xffffff');
        this.backgroundRect.setOrigin(0, 0);
        this.parentContainer.add(this.backgroundRect);
        this.parentContainer.moveDown(this.backgroundRect);

        this.on('pointerdown', () => {
            if (this.scene.selectedInput != null) {
                this.scene.selectedInput.setText(this.scene.selectedInput.trueText);
            }
            this.scene.selectedInput = this;
            
            if (this.trueText.length < this.maxTrueText) {
                this.setText(this.trueText + '_');
            } else {
                this.setText(this.trueText + '');
            }
        });

        this.scene.input.on('pointerdown', (pointer) => {
            
            if (this.scene.selectedInput === this) {
                let absX = this.parentContainer.x + this.x;
                let absY = this.parentContainer.y + this.y;
                if (pointer.x >= absX && pointer.x <= absX + this.trueWidth && pointer.y >= absY && pointer.y <= absY + this.trueHeight) {
                    // do nothing
                    
                } else {
                    // if pointer up 
                    this.scene.selectedInput = null;
                    this.setText(this.trueText + '');
                }
            }
        });

        this.scene.input.keyboard.on('keydown', (event) => {
            if (this.scene.selectedInput === this) {
                let key = event.key;
                let charCode = key.charCodeAt(0);
                if (charCode >= 'a'.charCodeAt(0) && charCode <= 'z'.charCodeAt(0)) {
                    if (this.trueText.length < this.maxTrueText) {
                        this.trueText += key;
                    }
                } else if (charCode >= 'A'.charCodeAt(0) && charCode <= 'Z'.charCodeAt(0)) {
                    if (this.trueText.length < this.maxTrueText) {
                        this.trueText += key;
                    }
                } else if (charCode >= '0'.charCodeAt(0) && charCode <= '9'.charCodeAt(0)) {
                    if (this.trueText.length < this.maxTrueText) {
                        this.trueText += key;
                    }
                } else if (key == 'Backspace') {
                    if (this.trueText.length > 0) {
                        this.trueText = this.trueText.substring(0, this.trueText.length - 1);
                    }
                } else if (key == 'Enter') {
                    this.scene.selectedInput = null;
                    if (this.trueText.length == 0) this.trueText = '0';
                }
                    
                if (this.scene.selectedInput != null && (this.trueText.length < this.maxTrueText)) {
                    this.setText(this.trueText + '_');
                } else {
                    this.setText(this.trueText + '');
                }
            }
        });
    }

    setVisible(value) {
        this.backgroundRect.setVisible(value);
        super.setVisible(value);
    }

}