import Phaser from 'phaser3';
import Player from '../unit/Player';
import Window from '../window/Window';

export default class GameScene extends Phaser.Scene {
    constructor() {
        super();
    }

    preload() {
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

        this.statsWindow = new Window(this, this.screenWidth / 2, this.screenHeight / 2, 562, 200);
        this.add.existing(this.statsWindow);
    }

    update() {
    }
}
