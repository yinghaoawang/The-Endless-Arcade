import Phaser from 'phaser3';
import Button from '../input/button/Button';
import Text from '../input/text/Text';
import NumberTextField from '../input/text/NumberField';
import { bringWindowToTop } from './Window';

export default class WindowFrame extends Phaser.GameObjects.Container {
    constructor(scene, parentWindow, x, y, width, height, name) {
        super(scene, x, y);
        this.parentWindow = parentWindow;
        if (typeof width == 'undefined') {
            width = 400;
        }
        if (typeof height == 'undefined') {
            height = 300;
        }
        this.width = width;
        this.height = height;

        if (typeof scene.windows == 'undefined') {
            scene.windows = [];
        }
        this.beingDestroyed = false;
        
        this.windowMoveListeners = [];
        
        this.backgroundImage = new Phaser.GameObjects.Image(scene, 0, 0, 'window-bg');
        this.backgroundImage.setDisplaySize(this.width, this.height);
        this.backgroundImage.setAlpha(.85);
        this.add(this.backgroundImage);

        this.topBar = new Phaser.GameObjects.Image(scene, 0, -1 * this.height / 2, 'window-top-bar');
        this.topBar.setOrigin(.5, 0)
        this.topBar.setDisplaySize(this.width, 30);
        this.topBar.setAlpha(.85);
        this.add(this.topBar);

        this.paneMargin = 10;

        this.backgroundHitbox =  new Phaser.Geom.Polygon([
            0, this.topBar.displayHeight,
            0, this.height,
            this.width, this.height,
            this.width, this.topBar.displayHeight,
            this.width - this.paneMargin, this.topBar.displayHeight,
            this.width - this.paneMargin, this.height - this.paneMargin,
            this.paneMargin, this.height - this.paneMargin,
            this.paneMargin, this.topBar.displayHeight
        ]);

        this.setInteractive({
            hitArea: this.backgroundHitbox,
            hitAreaCallback: Phaser.Geom.Polygon.Contains,
            draggable: true,
            useHandCursor: true,
        });
        this.topBar.setInteractive({
            draggable: true,
            useHandCursor: true,
        })

        this.on('pointerdown', this.onpointerdown);
        this.on('dragstart', this.ondragstart);
        this.on('drag', this.ondrag);
        this.topBar.on('pointerdown', this.onpointerdown.bind(this));
        this.topBar.on('dragstart', this.ondragstart.bind(this));
        this.topBar.on('drag', this.ondrag.bind(this));

       if (typeof name != 'undefined') {
            this.name = name;
            this.nameText = new Text(scene, -1 * this.width / 2 + this.paneMargin + 5, -1 * this.height / 2 + 5, this.name);
            this.add(this.nameText);
        }

        this.closeBtn = new Button(scene, this.width / 2 - this.topBar.displayHeight / 4, -1 * this.height / 2 + this.topBar.displayHeight / 4, 30, 30, 'window-close-btn', 'window-close-btn-down', 'window-close-btn-over');
        this.closeBtn.setOrigin(1, 0);
        this.closeBtn.setDisplaySize(this.topBar.displayHeight / 2, this.topBar.displayHeight / 2);
        this.closeBtn.on('pointerclicked', () => { this.close(); });
        this.closeBtn.on('pointerdown', this.onpointerdown.bind(this));
        this.add(this.closeBtn);

        this.contentPos = {
            x: this.paneMargin,
            y: this.topBar.displayHeight,
            width: this.width - this.paneMargin * 2,
            height: this.height - this.paneMargin - this.topBar.displayHeight,
        }

        this.maskGraphics = scene.add.graphics();
        this.maskGraphics.fillRect(this.contentPos.x, this.contentPos.y, this.contentPos.width, this.contentPos.height);
        this.maskGraphics.setAlpha(0);
        this.maskGraphics.x = this.x - this.width / 2;
        this.maskGraphics.y = this.y - this.height / 2;
        this.mask = new Phaser.Display.Masks.GeometryMask(this, this.maskGraphics);
        this.mask.invertAlpha = true;
        
        this.windowMoveListeners.push(() => {
            this.maskGraphics.x = this.x - this.width / 2;
            this.maskGraphics.y = this.y - this.height / 2;
        });

        scene.add.existing(this);

        bringWindowToTop(this);
    }

    triggerEvent(event) {
        if (event == 'windowmove') {
            this.windowMoveListeners.forEach((fn) => {
                fn();
            });
        }
    }

    update() {
        if (this.beingDestroyed) return;
    }

    destroy() {
        this.beingDestroyed = true;
        this.scene.windows.splice(this.scene.windows.indexOf(this), 1);
        super.destroy();
    }

    close() {
        this.closeBtn.destroy();
        this.destroy();
        
    }

    onpointerdown() {
        bringWindowToTop(this);
    }

    ondragstart(pointer) {
        this.dragDistX = pointer.x - this.x;
        this.dragDistY = pointer.y - this.y;
    }

    ondrag(pointer) {
        this.x = pointer.x - this.dragDistX,
        this.y = pointer.y - this.dragDistY
        if (typeof this.windowMoveListeners != 'undefined') { 
            this.triggerEvent('windowmove');
        }
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