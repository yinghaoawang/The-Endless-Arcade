import Phaser from 'phaser3';
import Player from '../unit/Player';
import InventoryWindow from '../window/InventoryWindow';
import { setKeySchemes } from '../keyboard/KeyboardInput';

export default class GameScene extends Phaser.Scene {
    constructor() {
        super();
    }

    preload() {
        this.load.image('game-bg', 'assets/backgrounds/game-background.png');
        this.load.image('window-bg', 'assets/window/window-background.png');
        this.load.image('window-top-bar', 'assets/window/window-top-bar.png');
        this.load.image('window-inner-pane', 'assets/window/window-inner-pane.png');
        this.load.image('window-close-btn', 'assets/window/window-close-btn.png');
        this.load.image('window-close-btn-hover', 'assets/window/window-close-btn-hover.png');
    }

    create() {
        this.screenWidth = this.cameras.main.width;
        this.screenHeight = this.cameras.main.height;

        this.player = new Player('Jonah');
        this.player.addItem('arrow', 1000);
        this.player.removeItem('arrow', 1001);

        this.inventoryWindow = new InventoryWindow(this, this.screenWidth / 2, this.screenHeight / 2);
        this.add.existing(this.inventoryWindow);
        this.backgroundImage = this.add.image(this.screenWidth / 2, this.screenHeight / 2, 'game-bg');
        this.backgroundImage.setDisplaySize(this.screenWidth, this.screenHeight);
        this.backgroundImage.depth = -1000;

        setKeySchemes(this);
    }

    update() {
        this.inventoryWindow.update();
    }
}
