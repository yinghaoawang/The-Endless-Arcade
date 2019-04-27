import Phaser from 'phaser3';
import WindowComponent from './WindowComponent';

export default class StaticWindowFrame extends WindowComponent {
    constructor(scene, parentWindow, x, y, width, height) {
        super(scene, parentWindow, x, y, width, height);

        this._height = height;
        this._width = width;
        this.defaultAlpha = .75;
        
        this.backgroundImage = new Phaser.GameObjects.Image(scene, this.x, this.y, 'window-bg');
        this.backgroundImage.setOrigin(0);
        this.backgroundImage.setDisplaySize(this.width, this.height);
        this.backgroundImage.setAlpha(this.defaultAlpha);
        this.add(this.backgroundImage, true);

        this.paneMargin = 10;
        this.createNewMask();
        
        this.windowMoveListeners.push(() => {
            this.maskGraphics.x = this.x;
            this.maskGraphics.y = this.y
        });
    }

    get viewportArea() {
        return {
            x: this.paneMargin,                                                                                                                                                                                                                                                                   
            y: this.paneMargin,
            width: this.width - this.paneMargin * 2,
            height: this.height - this.paneMargin * 2,
        }
    }

    get height() {
        return this._height;
    }
    set height(value) {
        this._height = value;
        this.backgroundImage.setDisplaySize(this.width, this.height);
        this.maskGraphics.destroy();
        this.createNewMask();
        
        let windowContent = this.parentWindow.windowContent;
        windowContent.updateViewport();
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
        this.destroy();
    }
}