import Phaser from 'phaser3';
import Button from '../input/button/Button';
import Text from '../input/text/Text';
import NumberTextField from '../input/text/NumberField';
import WindowComponent from './WindowComponent';

export default class WindowFrame extends WindowComponent {
    constructor(scene, parentWindow, x, y, width, height, name) {
        super(scene, parentWindow, x, y, width, height);

        this._height = height;
        this._width = width;
        this.defaultAlpha = .75;
        
        this.backgroundImage = new Phaser.GameObjects.Image(scene, this.x, this.y, 'window-bg');
        this.backgroundImage.setOrigin(0);
        this.backgroundImage.setDisplaySize(this.width, this.height);
        this.backgroundImage.setAlpha(this.defaultAlpha);
        this.add(this.backgroundImage, true);

        this.topBar = new Phaser.GameObjects.Image(scene, this.x, this.y, 'window-top-bar');
        this.topBar.setOrigin(0)
        this.topBar.setDisplaySize(this.width, 30);
        this.topBar.setAlpha(this.defaultAlpha);
        this.add(this.topBar, true);

        this.paneMargin = 10;

        this.topBar.setInteractive({
            draggable: true,
            useHandCursor: true,
        });

        this.topBar.on('pointerdown', this.parentWindow.onpointerdown.bind(this));
        this.topBar.on('dragstart', this.parentWindow.ondragstart.bind(this));
        this.topBar.on('drag', this.parentWindow.ondrag.bind(this));

        this.createNewBackgroundHitbox();
        
       if (typeof name != 'undefined') {
            this.name = name;
            this.nameText = new Text(scene, this.x + this.paneMargin + 5, this.y + 5, null, null, this.name);
            this.add(this.nameText, true);
        }

        this.closeBtn = new Button(scene, this.x + this.width - this.topBar.displayHeight / 4, this.y + this.topBar.displayHeight / 4, 30, 30, 'window-close-btn', 'window-close-btn-down', 'window-close-btn-over');
        this.closeBtn.setOrigin(1, 0);
        this.closeBtn.setDisplaySize(this.topBar.displayHeight / 2, this.topBar.displayHeight / 2);
        this.closeBtn.on('pointerclicked', () => { this.parentWindow.close(); });
        this.closeBtn.on('pointerdown', this.parentWindow.onpointerdown.bind(this));
        this.closeBtn.setAlpha(this.defaultAlpha);
        this.add(this.closeBtn, true);

        this.createNewMask();
        
        this.windowMoveListeners.push(() => {
            this.maskGraphics.x = this.x;
            this.maskGraphics.y = this.y
        });

    }

    get polygonHitboxPoints() {
        return [
            0, 0,
            0, this.height - this.topBar.displayHeight,
            this.width, this.height - this.topBar.displayHeight,
            this.width, 0,
            this.width - this.paneMargin, 0,
            this.width - this.paneMargin, this.height - this.paneMargin - this.topBar.displayHeight,
            this.paneMargin, this.height - this.paneMargin - this.topBar.displayHeight,
            this.paneMargin, 0
        ]
    }

    get viewportArea() {
        return {
            x: this.paneMargin,
            y: this.topBar.displayHeight,
            width: this.width - this.paneMargin * 2,
            height: this.height - this.paneMargin - this.topBar.displayHeight,
        }
    }

    get height() {
        return this._height;
    }
    set height(value) {
        console.log(value);
        this._height = value;
        this.backgroundImage.setDisplaySize(this.width, this.height);
        this.backgroundHitbox.destroy();
        this.createNewBackgroundHitbox();
        this.maskGraphics.destroy();
        this.createNewMask();
        
        let windowContent = this.parentWindow.windowContent;
        
        windowContent.updateViewport();
    }

    createNewBackgroundHitbox() {
        this.backgroundHitbox = new Phaser.GameObjects.Polygon(this.scene, this.x, this.y + this.topBar.displayHeight, this.polygonHitboxPoints);
        this.backgroundHitbox.setOrigin(0);
        this.backgroundHitbox.setInteractive({
            draggable: true,
            useHandCursor: true,
        });
        this.backgroundHitbox.on('pointerdown', this.parentWindow.onpointerdown.bind(this));
        this.backgroundHitbox.on('dragstart', this.parentWindow.ondragstart.bind(this));
        this.backgroundHitbox.on('drag', this.parentWindow.ondrag.bind(this));
        this.add(this.backgroundHitbox, true);
    }

    createNewMask() {
        this.maskGraphics = this.scene.add.graphics();
        this.maskGraphics.fillRect(this.viewportArea.x, this.viewportArea.y, this.viewportArea.width, this.viewportArea.height);
        this.maskGraphics.setAlpha(0);
        this.maskGraphics.x = this.x;
        this.maskGraphics.y = this.y;
        this.backgroundImage.mask = new Phaser.Display.Masks.GeometryMask(this, this.maskGraphics);
        this.backgroundImage.mask.invertAlpha = true;
    }

    close() {
        this.closeBtn.destroy(true, true);
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
            this.add(text);
        }
        return texts;
    }

    createButtonCol(xOffset, yOffset, colSpacing, width, height, colCount, pointerUpTexture, pointerDownTexture, pointerOverTexture) {
        let buttons = [];
        for (let i = 0; i < colCount; ++i) {
            let button = new Button(this.scene, xOffset, yOffset + colSpacing * i, width, height, pointerUpTexture, pointerDownTexture, pointerOverTexture);
            buttons.push(button);
            this.add(button);
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
                this.focus();
            });
            texts.push(inputText);
            this.add(inputText);
        }
        return texts;

    }
}