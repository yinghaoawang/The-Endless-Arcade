import Phaser from 'phaser3';

import Text from './Text';

export default class NumberTextField extends Text {
    constructor(scene, x, y, width, height, maxLength, text) {
        super(scene, x, y, width, height, text);
        this.text = text;
        this.maxLength = maxLength;
        
        this.backgroundRect = new Phaser.GameObjects.Rectangle(scene, 0, 0, this.width, this.height);
        this.backgroundRect.setFillStyle('0xffffff');
        this.backgroundRect.setOrigin(0);
        this.backgroundRect.setInteractive();
        this.add(this.backgroundRect, true);
        this.moveUp(this.textObject);

        this.backgroundRect.on('pointerdown', () => {
            if (this.scene.selectedInput != null) {
                if (this.scene.selectedInput.text.length == 0) this.scene.selectedInput.text = ('0');
                this.scene.selectedInput.setText(this.scene.selectedInput.text);
            }
            this.scene.selectedInput = this;
            this.update();
        });
        

        this.scenePointerListener = (pointer) => {
            if (this.scene.selectedInput === this) {
                let absX = this.parentContainer.x + this.x;
                let absY = this.parentContainer.y + this.y;
                // if clicked outside, and is currently selected then 
                if (pointer.x < absX || pointer.x > absX + this.trueWidth || pointer.y < absY || pointer.y > absY + this.trueHeight) {
                    this.deselect();
                }
            } else if (this.text.length == 0) {
                this.text = ('0');
                this.setText(this.text + '');
            }
        };
        this.scene.input.on('pointerdown', this.scenePointerListener);

        this.sceneKeyDownListener = (event) => {
            if (this.scene.selectedInput === this) {
                let key = event.key;
                let charCode = key.charCodeAt(0);
                if (charCode >= '0'.charCodeAt(0) && charCode <= '9'.charCodeAt(0)) {
                    if (this.text.length < this.maxLength) {
                        this.text = (this.text + key);
                    }
                } else if (key == 'Backspace') {
                    if (this.text.length > 0) {
                        this.text = (this.text.substring(0, this.text.length - 1));
                    }
                } else if (key == 'Enter') {
                    this.scene.selectedInput = null;
                    if (this.text.length == 0) this.text = ('0');
                }

                if (this.scene.selectedInput != null && (this.text.length < this.maxLength)) {
                    this.setText(this.text + '_');
                } else {
                    this.setText(this.text + '');
                }
            }
        };
        
        this.scene.input.keyboard.on('keydown', this.sceneKeyDownListener);
    }

    deselect() {
        this.scene.selectedInput = null;
        if (this.text.length == 0) {
            this.text = ('0');
        }
        this.setText(this.text + '');
    }

    update() {
        if (this.scene.selectedInput === this) {
            if (this.text == '0') this.text = '';
            
            if (this.text.length < this.maxLength) {
                this.setText(this.text + '_');
            } else {
                this.setText(this.text + '');
            }
        } else {
            this.setText(this.text + '');
        }
    }

    destroy() {
        this.scene.input.off('pointerdown', this.scenePointerListener);
        this.scene.input.keyboard.off('keydown', this.sceneKeyDownListener);
    }

    setVisible(value) {
        this.backgroundRect.setVisible(value);
        super.setVisible(value);
    }
}