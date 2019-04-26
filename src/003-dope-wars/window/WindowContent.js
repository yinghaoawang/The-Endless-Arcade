import Phaser from 'phaser3';
import Button from '../input/button/Button';
import Text from '../input/text/Text';
import NumberTextField from '../input/text/NumberField';
import { bringWindowToTop } from './Window';
import WindowComponent from './WindowComponent';

export default class WindowContent extends WindowComponent {
    constructor(scene, parentWindow, x, y, width, height) {
        super(scene, parentWindow, x, y, width, height);

        this.pane = new Phaser.GameObjects.Container(scene, this.x + this.parentWindow.contentPos.x, this.y + this.parentWindow.contentPos.y);
        this.add(this.pane, true);

        this.backgroundImage = new Phaser.GameObjects.Image(scene, 0, 0, 'window-inner-pane');
        this.backgroundImage.setOrigin(0);
        this.backgroundImage.setDisplaySize(this.width, this.height);
        this.pane.add(this.backgroundImage);

        this.maskGraphics = scene.add.graphics();
        this.maskGraphics.fillRect(0, 0, this.width, this.parentWindow.contentPos.height);
        this.maskGraphics.setAlpha(0);
        this.maskGraphics.x = this.pane.x;
        this.maskGraphics.y = this.pane.y;
        this.pane.mask = new Phaser.Display.Masks.GeometryMask(this, this.maskGraphics);
        
        this.windowMoveListeners.push(() => {
            this.maskGraphics.x = this.pane.x;
            this.maskGraphics.y = this.pane.y;
        });

        this.backgroundHitbox = new Phaser.GameObjects.Rectangle(scene, this.x + this.parentWindow.contentPos.x, this.y + this.parentWindow.contentPos.y, this.parentWindow.contentPos.width, this.parentWindow.contentPos.height);
        this.backgroundHitbox.setOrigin(0);
        this.backgroundHitbox.setInteractive();
        this.add(this.backgroundHitbox);

        this.backgroundHitbox.on('pointerdown', this.parentWindow.onpointerdown.bind(this));
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
                bringWindowToTop(this);
            });
            texts.push(inputText);
            this.pane.add(inputText);
        }
        return texts;

    }
}