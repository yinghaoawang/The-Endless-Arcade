import Phaser from 'phaser3';
import Player from '../unit/Player';
import InventoryWindow from '../window/InventoryWindow';
import { setKeySchemes } from '../input/keyboard/keyboardInput';
import Window from '../window/Window';
import StatsWindow from '../window/StatsWindow';

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
        this.load.image('window-close-btn-over', 'assets/window/window-close-btn-over.png');
        this.load.image('window-close-btn-down', 'assets/window/window-close-btn-down.png');
        this.load.image('window-close-btn', 'assets/window/window-close-btn.png');
        this.load.image('window-close-btn-over', 'assets/window/window-close-btn-over.png');
        this.load.image('window-close-btn-down', 'assets/window/window-close-btn-down.png');
        this.load.image('item-buy-btn', 'assets/window/item-buy-btn.png');
        this.load.image('item-buy-btn-over', 'assets/window/item-buy-btn-over.png');
        this.load.image('item-buy-btn-down', 'assets/window/item-buy-btn-down.png');
        this.load.image('item-sell-btn', 'assets/window/item-sell-btn.png');
        this.load.image('item-sell-btn-over', 'assets/window/item-sell-btn-over.png');
        this.load.image('item-sell-btn-down', 'assets/window/item-sell-btn-down.png');
    }

    create() {
        this.screenWidth = this.cameras.main.width;
        this.screenHeight = this.cameras.main.height;

        this.player = new Player('Jonah');
        this.player.addItem('arrow', 3212);
        this.player.addItem('arrow', 2);
        this.player.addItem('sword', 2);
        this.player.addItem('shield', 1);
        this.player.addItem('bow', 1);

        this.testWindow = new Window(this, this.screenWidth / 2, this.screenHeight / 2, 200, 200, 'Window');
        this.testWindow2 = new Window(this, this.screenWidth / 2, this.screenHeight / 2, 200, 200, 'Window');
        //this.inventoryWindow = new InventoryWindow(this, this.screenWidth / 2, this.screenHeight / 2);
        //this.statsWindow = new StatsWindow(this, 350, 180, this.player);

        this.backgroundImage = this.add.image(this.screenWidth / 2, this.screenHeight / 2, 'game-bg');
        this.backgroundImage.setDisplaySize(this.screenWidth, this.screenHeight);
        this.backgroundImage.depth = -1000;

        setKeySchemes(this);
    }

    update() {
    }
}
