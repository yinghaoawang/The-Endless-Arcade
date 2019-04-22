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

        this.width = width;
        this.height = height;

        this.backgroundImage = new Phaser.GameObjects.Image(scene, 0, 0, 'window-bg');
        this.backgroundImage.setDisplaySize(this.width, this.height);
        this.backgroundImage.setInteractive({ draggable: true });
        this.backgroundImage.on('dragstart', function(pointer) {
            this.dragDistX = pointer.x - this.x;
            this.dragDistY = pointer.y - this.y;
        }.bind(this));
        this.backgroundImage.on('drag', function(pointer) {
            this.x = pointer.x - this.dragDistX,
            this.y = pointer.y - this.dragDistY
        }.bind(this));
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
        this.closeBtn.on('pointerup', function() {
            if (this.closeBtn.clicked) {
                this.close();
            }
        }.bind(this));
        this.add(this.closeBtn);
    }

    close() {
        this.destroy();
    }
}
