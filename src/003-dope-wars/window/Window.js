import Phaser from 'phaser3';

export default class Window extends Phaser.GameObjects.Container {
    constructor(scene, x, y, width, height) {
        super(scene, x, y);

        if (typeof width == 'undefined') {
            width = 400;
        }
        if (typeof height == 'undefined') {
            height = 300;
        }

        if (typeof scene.windows == 'undefined') {
            scene.windows = [];
        }
        scene.windows.unshift(this);

        this.beingDestroyed = false;

        scene.add.existing(this);

        this.updateList = [];

        this.width = width;
        this.height = height;

        this.backgroundImage = new Phaser.GameObjects.Image(scene, 0, 0, 'window-bg');
        this.backgroundImage.setDisplaySize(this.width, this.height);
        this.backgroundImage.setInteractive({ draggable: true });
        this.backgroundImage.on('dragstart', (pointer) => {
            this.dragDistX = pointer.x - this.x;
            this.dragDistY = pointer.y - this.y;
        });
        this.backgroundImage.on('drag', (pointer) => {
            this.x = pointer.x - this.dragDistX,
            this.y = pointer.y - this.dragDistY
        });
        this.add(this.backgroundImage);

        this.topBar = new Phaser.GameObjects.Image(scene, 0, -1 * this.height / 2, 'window-top-bar');
        this.topBar.setOrigin(.5, 0)
        this.topBar.setDisplaySize(this.width, 30);
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

        this.closeBtn = new Phaser.GameObjects.Image(scene, this.width / 2 - this.topBar.displayHeight / 4, -1 * this.height / 2 + this.topBar.displayHeight / 4, 'window-close-btn');
        this.closeBtn.setOrigin(1, 0);
        this.closeBtn.setDisplaySize(this.topBar.displayHeight / 2, this.topBar.displayHeight / 2);
        this.closeBtn.setInteractive();
        this.closeBtn.on('pointerdown', function() {
            this.clicked = true;
        });
        this.closeBtn.on('pointerover', function() {
            this.setTexture('window-close-btn-hover');
        });
        this.closeBtn.on('pointerout', function() {
            this.setTexture('window-close-btn');
            this.clicked = false;
        });
        this.closeBtn.on('pointerup', () => {
            if (this.closeBtn.clicked) {
                this.close();
            }
        });
        this.add(this.closeBtn);
        this.setInteractive();
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
