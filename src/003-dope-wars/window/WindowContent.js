import Phaser from 'phaser3';
import Button from '../input/button/Button';
import Text from '../input/text/Text';
import NumberTextField from '../input/text/NumberField';
import WindowComponent from './WindowComponent';
import Scrollbar from './Scrollbar';

export default class WindowContent extends WindowComponent {
    constructor(scene, parentWindow, x, y, width, height) {
        super(scene, parentWindow, x, y, width, height);

        this.pane = new Phaser.GameObjects.Container(scene, this.x + this.viewportArea.x, this.y + this.viewportArea.y);
        this.add(this.pane, true);

        this.backgroundImage = new Phaser.GameObjects.Image(scene, 0, 0, 'window-inner-pane');
        this.backgroundImage.setOrigin(0);
        this.backgroundImage.setDisplaySize(this.width, this.height);
        this.pane.add(this.backgroundImage);

        this.maskGraphics = scene.add.graphics();
        this.maskGraphics.fillRect(0, 0, this.parentWindow.viewportArea.width, this.parentWindow.viewportArea.height);
        this.maskGraphics.setAlpha(0);
        this.maskGraphics.x = this.x + this.viewportArea.x;
        this.maskGraphics.y = this.y + this.viewportArea.y;
        this.pane.mask = new Phaser.Display.Masks.GeometryMask(this, this.maskGraphics);
        
        this.windowMoveListeners.push(() => {
            this.maskGraphics.x = this.x + this.viewportArea.x;
            this.maskGraphics.y = this.y + this.viewportArea.y;
        });

        this.backgroundHitbox = new Phaser.GameObjects.Rectangle(scene, this.x + this.parentWindow.viewportArea.x, this.y + this.parentWindow.viewportArea.y, this.parentWindow.viewportArea.width, this.parentWindow.viewportArea.height);
        this.backgroundHitbox.setOrigin(0);
        this.backgroundHitbox.setInteractive();
        this.add(this.backgroundHitbox);

        this.backgroundHitbox.on('pointerdown', () => {
            this.parentWindow.height += 100;
            this.parentWindow.onpointerdown();
        });

        if (this.height > this.viewportArea.height) {
            this.addScrollbar();
        }
    }

    get height() {
        return this._height;
    }
    set height(value) {
        this._height = value;
        // if new height value exceeds viewport height, then add or update the scroll bar
        if (this.height > this.viewportArea.height) {
            if (this.scrollbar != null) {
                this.removeScrollbar();
            }
            this.addScrollbar();
        } else {
            // if new height is less than viewport height then make pane fill the viewport, then remove the scrollbar
            if (this.scrollbar != null) {
                this.removeScrollbar();
            }
            this._height = this.viewportArea.height;
            
        }
        if (this.backgroundImage) {
            this.backgroundImage.setDisplaySize(this.width, this.height);
        }
    }

    removeScrollbar() {
        this.scrollbar.destroy();
        this.scrollbar = null;
    }

    addScrollbar() {
        let scrollbarArea = {
            margin: 0,
            width: 18,
        }
        
        this.scrollbar = new Scrollbar(this.scene, this,
            this.x + this.viewportArea.x + this.viewportArea.width - scrollbarArea.width - scrollbarArea.margin, this.y + this.viewportArea.y + scrollbarArea.margin,
            scrollbarArea.width, this.viewportArea.height - 2 * scrollbarArea.margin,
            this.viewportArea, { width: this.width, height: this.height },
            this.pane
        );

        this.add(this.scrollbar, true);
    }

    get viewportArea() {
        return this.parentWindow.viewportArea;
    }

    get isSelected() {
        return this.parentWindow.isSelected;
    }

    createTextCol(xOffset, yOffset, colSpacing, messages, colCount) {
        if (!Array.isArray(messages)) messages = [messages];
        if (typeof colCount == 'undefined') {
            colCount = messages.length;
        } 
        let texts = [];
        let message = '';
        for (let i = 0; i < colCount; ++i) {
            if (i < messages.length) {
                message = messages[i];
            }  
            let text = new Text(this.scene, xOffset, yOffset + colSpacing * i, null, null, message);
            texts.push(text);
            this.pane.add(text);
        }
        return texts;
    }

    createButtonCol(xOffset, yOffset, colSpacing, width, height, colCount, pointerUpTexture, pointerDownTexture, pointerOverTexture) {
        let buttons = [];
        for (let i = 0; i < colCount; ++i) {
            let button = new Button(this.scene, xOffset, yOffset + colSpacing * i, width, height, pointerUpTexture, pointerDownTexture, pointerOverTexture);
            buttons.push(button);
            this.pane.add(button);
        }
        return buttons;

        
    }

    createInputTextCol(xOffset, yOffset, colSpacing, messages, colCount, textWidth) {
        if (!Array.isArray(messages)) messages = [messages];
        if (typeof colCount == 'undefined') {
            colCount = messages.length;
        } 
        let texts = [];
        let message = '';
        for (let i = 0; i < colCount; ++i) {
            if (i < messages.length) {
                message = messages[i];
            }  
            let inputText = new NumberTextField(this.scene, xOffset, yOffset + colSpacing * i, textWidth, 18, 4, message);
            inputText.on('pointerdown', () => {
                this.focus();
            });
            texts.push(inputText);
            this.pane.add(inputText);
        }
        return texts;

    }
}