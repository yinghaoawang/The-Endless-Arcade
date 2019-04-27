import Phaser from 'phaser3';
import messageHandler from '../MessageHandler';

export default class Scrollbar extends Phaser.GameObjects.Container {
    constructor(scene, parentWindow, x, y, width, height, viewportArea, totalArea, targetPane) {
        super(scene, x, y);
        this.parentWindow = parentWindow;
        this.width = width;
        this.height = height;
        this.viewportArea = viewportArea;
        this.totalArea = totalArea;
        this.targetPane = targetPane;
        
        this.backgroundImage = new Phaser.GameObjects.Image(scene, 0, 0, 'scrollbar-bg');
        this.backgroundImage.setDisplaySize(this.width, this.height);
        this.backgroundImage.setOrigin(0);
        this.backgroundImage.setInteractive();
        this.add(this.backgroundImage);

        this.barMargin = 2;

        this.barGraphics = new Phaser.GameObjects.Image(scene, this.barMargin, 0, 'scrollbar');
        this.updateSize();
        
        this.barGraphics.setOrigin(0);
        this.add(this.barGraphics);

        this.barGraphics.setInteractive({
            useHandCursor: true,
            draggable: true,
        });

        this.barGraphics.on('dragstart', this.ondragstart.bind(this));
        this.barGraphics.on('drag', this.ondrag.bind(this));

        this.sceneListener = () => {
            if (this.isSelected) {
                let downPressed = false;
                let upPressed = false;
                if (scene.cursorKeys.down.isDown) {
                    downPressed = true;
                }
                if (scene.cursorKeys.up.isDown) {
                    upPressed = true;
                }
                if (downPressed && !upPressed) {
                    this.movePane(-20, true);
                } else if (upPressed && !downPressed) {
                    this.movePane(20, true);
                }

            }
        };
        this.scene.input.keyboard.on('keydown', this.sceneListener);
    }

    get isSelected() {
        return this.parentWindow.isSelected;
    }

    destroy() {
        this.scene.input.keyboard.off('keydown', this.sceneListener);
        super.destroy();
    }

    updateSize(viewportArea, totalArea) {
        if (typeof viewportArea != 'undefined')
            this.viewportArea = viewportArea;
        if (typeof totalArea != 'undefined')
            this.totalArea = totalArea;

        if (this.totalArea.width <= this.viewportArea.width) {
            this.totalArea.width = this.viewportArea.width;
        }
        if (this.totalArea.height <= this.viewportArea.height) {
            this.totalArea.height = this.viewportArea.height;

            this.barGraphics.setVisible(false);
        } else {
            this.barGraphics.setVisible(true);
        }

        this.barArea = {
            x: this.barMargin,
            y: 0,
            width: this.width - this.barMargin * 2,
            height: (this.viewportArea.height / this.totalArea.height) * this.height
        }
        
        this.barGraphics.setDisplaySize(this.barArea.width, this.barArea.height);
        this.adjustBarPosition();
    }
    
    adjustBarPosition() {
        let paneDistanceRatio = (this.y - this.targetPane.y) / this.totalArea.height;
        this.barGraphics.y = this.barArea.y + paneDistanceRatio * this.viewportArea.height;
    }

    movePane(value, adjustBarGraphics) {
        if (this.targetPane.y + value > this.y)  {
            messageHandler.printLog('Tried scrolling pane above viewport, corrected the distance.');
            this.targetPane.y = this.y;
        } else if (this.targetPane.y + this.totalArea.height + value < this.y + this.viewportArea.height) {
            this.targetPane.y = this.y + this.viewportArea.height - this.totalArea.height;
            messageHandler.printLog('Tried scrolling pane below viewport, corrected the distance.');
        } else {
            this.targetPane.y += value;
        }
        
        if (adjustBarGraphics) {
            this.adjustBarPosition();
        }
    }

    ondragstart() {
    }

    ondrag(pointer, dragX, dragY) {
        let startY = this.barGraphics.y;
        this.barGraphics.y = this.barArea.y + dragY;
        if (this.barGraphics.y < this.barArea.y) this.barGraphics.y = this.barArea.y;
        if (this.barGraphics.y + this.barGraphics.displayHeight > this.height) this.barGraphics.y = this.height - this.barGraphics.displayHeight;

        let percentageMoved = (startY - this.barGraphics.y) / this.barGraphics.displayHeight;
        let panePixelsMoved = percentageMoved * this.viewportArea.height;
        this.movePane(panePixelsMoved);
    }
}