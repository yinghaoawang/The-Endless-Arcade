import Phaser from 'phaser3';

import Text from './Text';

export default class NumberTextField extends Text {
    constructor(scene, x, y, width, parentContainer, maxTrueText, text) {
        super(scene, x, y, text);
        this.value = (text);
        this.trueWidth = width;
        this.trueHeight = this.height;
        this.maxTrueText = maxTrueText;
        this.setWordWrapWidth(width);
        
        this.setMaxLines(1);
        this.setBackgroundColor('#ffffff');
        this.setPadding(2.5, 0, 2.5, 0);
        
        this.setSize(width - this.padding.left - this.padding.right, this.height - this.padding.top - this.padding.bottom);
        this.backgroundRect = new Phaser.GameObjects.Rectangle(scene, this.x, this.y, this.trueWidth, this.trueHeight);
        this.backgroundRect.setFillStyle('0xffffff');
        this.backgroundRect.setOrigin(0, 0);
        this.setInteractive();
        parentContainer.add(this);
        
        this.parentContainer.add(this.backgroundRect);
        this.parentContainer.moveDown(this.backgroundRect);

        this.on('pointerdown', () => {
            if (this.scene.selectedInput != null) {
                if (this.scene.selectedInput.value.length == 0) this.scene.selectedInput.value = ('0');
                this.scene.selectedInput.setText(this.scene.selectedInput.value);
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
            } else if (this.value.length == 0) {
                this.value = ('0');
                this.setText(this.value + '');
            }
        };
        this.scene.input.on('pointerdown', this.scenePointerListener);

        this.sceneKeyDownListener = (event) => {
            if (this.scene.selectedInput === this) {
                let key = event.key;
                let charCode = key.charCodeAt(0);
                if (charCode >= '0'.charCodeAt(0) && charCode <= '9'.charCodeAt(0)) {
                    if (this.value.length < this.maxValue) {
                        this.value = (this.value + key);
                    }
                } else if (key == 'Backspace') {
                    if (this.value.length > 0) {
                        this.value = (this.value.substring(0, this.value.length - 1));
                    }
                } else if (key == 'Enter') {
                    this.scene.selectedInput = null;
                    if (this.value.length == 0) this.value = ('0');
                }
                    
                if (this.scene.selectedInput != null && (this.value.length < this.maxValue)) {
                    this.setText(this.value + '_');
                } else {
                    this.setText(this.value + '');
                }
            }
        };
        
        this.scene.input.keyboard.on('keydown', this.sceneKeyDownListener);
    }

    deselect() {
        this.scene.selectedInput = null;
        if (this.value.length == 0) {
            this.value = ('0');
        }
        this.setText(this.value + '');
    }

    update() {
        if (this.scene.selectedInput === this) {
            if (this.value == '0') this.value = '';
            
            if (this.value.length < this.maxValue) {
                this.setText(this.value + '_');
            } else {
                this.setText(this.value + '');
            }
        } else {
            this.setText(this.value + '');
        }
    }

    get value() {
        return this.trueText;
    }

    get maxValue() {
        return this.maxTrueText;
    }

    set value(value) {
        this.trueText = value;
        if (typeof this.propertyChangeListeners != 'undefined') { 
            this.triggerEvent('propertychange');
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