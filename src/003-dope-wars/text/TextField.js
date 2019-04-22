import Phaser from 'phaser3';

import Text from './Text';
import { numberInputListener, backspaceInputListener } from '../keyboard/KeyboardInput';

export default class TextField extends Text {
    constructor(scene, x, y, width, parentContainer, text) {
        super(scene, x, y, text);
        this.trueText = text;
        this.trueWidth = width;
        this.trueHeight = this.height;
        this.maxTrueText = 5;
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

        this.on('pointerdown', function() {
            this.scene.selectedInput = this;
            if (this.trueText == '0') this.trueText = '';
        });
    }

    update() {
        if (this.scene.selectedInput === this) {
            let numberPressed = numberInputListener(this.scene);
            let backspaceInput = backspaceInputListener(this.scene);
            
            if (numberPressed != null && this.trueText.length < this.maxTrueText) {
                this.trueText += numberPressed;
            }
            if (backspaceInput) {
                if (this.trueText.length > 0) {
                    this.trueText = this.trueText.substring(0, this.trueText.length - 1);
                }
            }

            if (this.trueText.length < this.maxTrueText) {
                this.setText(this.trueText + '_');
            } else {
                this.setText(this.trueText);
            }
        } else {
            if (this.trueText.length == 0) this.trueText = '0';
            this.setText(this.trueText);
        }
        
    }

}