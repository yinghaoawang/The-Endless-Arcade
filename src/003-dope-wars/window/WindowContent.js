import Phaser from 'phaser3';
import Button from '../input/button/Button';
import Text from '../input/text/Text';
import NumberTextField from '../input/text/NumberField';
import { bringWindowToTop } from './Window';
import WindowComponent from './WindowComponent';

export default class WindowContent extends WindowComponent {
    constructor(scene, parentWindow, x, y, width, height) {
        super(scene, parentWindow, x, y, width, height);

        this.pane = new Phaser.GameObjects.Image(scene, this.x + this.parentWindow.contentPos.x, this.y + this.parentWindow.contentPos.y, 'window-inner-pane');
        this.pane.setOrigin(0);
        this.pane.setDisplaySize(this.width, this.height);
        this.add(this.pane, true);

        this.maskGraphics = scene.add.graphics();
        this.maskGraphics.fillRect(0, 0, this.width, this.parentWindow.contentPos.height);
        this.maskGraphics.x = this.pane.x;
        this.maskGraphics.y = this.pane.y;
        this.pane.mask = new Phaser.Display.Masks.GeometryMask(this, this.maskGraphics);
        
        this.windowMoveListeners.push(() => {
            this.maskGraphics.x = this.pane.x;
            this.maskGraphics.y = this.pane.y;
        });
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
            let text = new Text(this.scene, xOffset, yOffset + colSpacing * i, message);
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
            let inputText = new NumberTextField(this.scene, xOffset, yOffset + colSpacing * i, textWidth, this, 4, message);
            inputText.on('pointerdown', () => {
                bringWindowToTop(this);
            });
            texts.push(inputText);
            this.pane.add(inputText);
        }
        return texts;

    }
}