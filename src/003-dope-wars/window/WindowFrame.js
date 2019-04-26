import Phaser from 'phaser3';
import Button from '../input/button/Button';
import Text from '../input/text/Text';
import NumberTextField from '../input/text/NumberField';
import { bringWindowToTop } from './Window';
import WindowComponent from './WindowComponent';

export default class WindowFrame extends WindowComponent {
    constructor(scene, parentWindow, x, y, width, height, name) {
        super(scene, parentWindow, x, y, width, height);
        
        this.backgroundImage = new Phaser.GameObjects.Image(scene, this.x, this.y, 'window-bg');
        this.backgroundImage.setOrigin(0);
        this.backgroundImage.setDisplaySize(this.width, this.height);
        this.backgroundImage.setAlpha(.85);
        this.add(this.backgroundImage, true);

        this.topBar = new Phaser.GameObjects.Image(scene, this.x, this.y, 'window-top-bar');
        this.topBar.setOrigin(0)
        this.topBar.setDisplaySize(this.width, 30);
        this.topBar.setAlpha(.85);
        this.add(this.topBar, true);

        this.paneMargin = 10;

        this.backgroundHitbox = new Phaser.Geom.Polygon([
            0, this.topBar.displayHeight,
            0, this.height,
            this.backgroundImage.width, this.height,
            this.backgroundImage.width, this.topBar.displayHeight,
            this.backgroundImage.width - this.paneMargin, this.topBar.displayHeight,
            this.backgroundImage.width - this.paneMargin, this.height - this.paneMargin,
            this.paneMargin, this.height - this.paneMargin,
            this.paneMargin, this.topBar.displayHeight
        ]);

        this.backgroundImage.setInteractive({
            hitArea: this.backgroundHitbox,
            hitAreaCallback: Phaser.Geom.Polygon.Contains,
            draggable: true,
            useHandCursor: true,
        })

        this.topBar.setInteractive({
            draggable: true,
            useHandCursor: true,
        })

        this.backgroundImage.on('pointerdown', this.parentWindow.onpointerdown.bind(this));
        this.backgroundImage.on('dragstart', this.parentWindow.ondragstart.bind(this));
        this.backgroundImage.on('drag', this.parentWindow.ondrag.bind(this));
        this.topBar.on('pointerdown', this.parentWindow.onpointerdown.bind(this));
        this.topBar.on('dragstart', this.parentWindow.ondragstart.bind(this));
        this.topBar.on('drag', this.parentWindow.ondrag.bind(this));

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
        this.add(this.closeBtn, true);

        this.viewportArea = {
            x: this.paneMargin,
            y: this.topBar.displayHeight,
            width: this.width - this.paneMargin * 2,
            height: this.height - this.paneMargin - this.topBar.displayHeight,
        }

        this.maskGraphics = scene.add.graphics();
        this.maskGraphics.fillRect(this.viewportArea.x, this.viewportArea.y, this.viewportArea.width, this.viewportArea.height);
        this.maskGraphics.setAlpha(0);
        this.maskGraphics.x = this.x;
        this.maskGraphics.y = this.y;
        this.backgroundImage.mask = new Phaser.Display.Masks.GeometryMask(this, this.maskGraphics);
        this.backgroundImage.mask.invertAlpha = true;
        
        this.windowMoveListeners.push(() => {
            this.maskGraphics.x = this.x;
            this.maskGraphics.y = this.y
        });

    }

    update() {
        if (this.being1ed) return;
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
                bringWindowToTop(this);
            });
            texts.push(inputText);
            this.add(inputText);
        }
        return texts;

    }
}