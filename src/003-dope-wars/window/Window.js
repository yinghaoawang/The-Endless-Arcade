import Phaser from 'phaser3';
import Button from '../input/button/Button';

export default class Window extends Phaser.GameObjects.Container {
    constructor(scene, x, y, width, height) {
        super(scene, x, y);
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
        scene.windows.unshift(this);
        this.beingDestroyed = false;
        
        this.updateList = [];

        this.backgroundImage = new Phaser.GameObjects.Image(scene, 0, 0, 'window-bg');
        this.backgroundImage.setDisplaySize(this.width, this.height);
        this.backgroundImage.setInteractive({ draggable: true });
        this.backgroundImage.on('pointerdown', () => {
            bringWindowToTop(this);
        });
        this.backgroundImage.on('dragstart', (pointer) => {
            this.dragDistX = pointer.x - this.x;
            this.dragDistY = pointer.y - this.y;
        });
        this.backgroundImage.on('drag', (pointer) => {
            this.x = pointer.x - this.dragDistX,
            this.y = pointer.y - this.dragDistY
        });

        this.backgroundImage.setAlpha(.9);
        this.add(this.backgroundImage);

        this.topBar = new Phaser.GameObjects.Image(scene, 0, -1 * this.height / 2, 'window-top-bar');
        this.topBar.setOrigin(.5, 0)
        this.topBar.setDisplaySize(this.width, 30);
        this.topBar.setAlpha(.7);
        this.add(this.topBar);

        this.paneMargin = 10;
        this.innerPane = new Phaser.GameObjects.Image(scene, 0, -1 * this.height / 2 + this.topBar.displayHeight, 'window-inner-pane');
        this.innerPane.setOrigin(.5, 0);
        this.innerPane.setDisplaySize(this.width - this.paneMargin * 2, this.height - this.paneMargin - this.topBar.displayHeight);
        this.innerPane.setInteractive();
        this.innerPane.on('pointerdown', () => {
            bringWindowToTop(this);
        });
        this.add(this.innerPane);

        /* Doesn't work. I want this to work.
        this.setInteractive(new Phaser.Geom.Rectangle(-1 * this.width / 2, -1 * this.height / 2, this.width / 2, this.height / 2), Phaser.Geom.Rectangle.Contains);
        this.on('pointerdown', () => {
            bringWindowToTop(this);
        });
        */

        this.closeBtn = new Button(scene, this.width / 2 - this.topBar.displayHeight / 4, -1 * this.height / 2 + this.topBar.displayHeight / 4, 'window-close-btn', 'window-close-btn-down', 'window-close-btn-over');
        this.closeBtn.setOrigin(1, 0);
        this.closeBtn.setDisplaySize(this.topBar.displayHeight / 2, this.topBar.displayHeight / 2);
        this.closeBtn.on('pointerclicked', () => { this.close(); });
        
        this.add(this.closeBtn);

        scene.add.existing(this);
    }

    update() {
        if (this.beingDestroyed) return;
        for (let i = 0; i < this.updateList.length; ++i) {
            let updateItem = this.updateList[i];
            updateItem.update();
        }
    }

    destroy() {
        this.beingDestroyed = true;
        this.scene.windows.splice(this.scene.windows.indexOf(this), 1);
        super.destroy();
    }

    close() {
        this.closeBtn.destroy();
        for (let i = 0; i < this.updateList.length; ++i) {
            let updateItem = this.updateList[i];
            updateItem.destroy();
            this.updateList.splice(i, 1);
            --i;
        }
        this.destroy();
        
    }
}

export function bringWindowToTop(target) {
    target.scene.windows.splice(target.scene.windows.indexOf(target), 1);
    target.scene.windows.push(target);
    for (let i = 0; i < target.scene.windows.length; ++i) {
        target.scene.windows[i].depth = i;
    }
}
