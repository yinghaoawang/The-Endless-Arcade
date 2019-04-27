import Phaser from 'phaser3';
import InventoryWindow from '../window/InventoryWindow';
import { setKeySchemes } from '../input/keyboard/keyboardInput';
import Window from '../window/Window';
import AlertWindow from '../window/AlertWindow';
import StatsWindow from '../window/StatsWindow';
import Game from '../Game';
import StaticWindow from '../window/StaticWindow';

export default class GameScene extends Phaser.Scene {
    constructor() {
        super();
    }

    preload() {
        this.load.audio('alert', 'assets/sounds/alert.wav');
        this.load.audio('window-close', 'assets/sounds/window-close.wav');
        this.load.audio('item-buy', 'assets/sounds/item-purchase.wav');
        this.load.audio('item-sell', 'assets/sounds/item-purchase.wav');
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
        this.load.image('scrollbar', 'assets/window/scrollbar.png');
        this.load.image('scrollbar-bg', 'assets/window/scrollbar-background.png');
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

        setKeySchemes(this);

        this.gameInstance = new Game();

        let abstractWindowArea = {
            width: 500,
            height: 200
        }
        this.abstractWindow = new StaticWindow(this, 0, this.screenHeight - abstractWindowArea.height, abstractWindowArea.width, abstractWindowArea. height);
        this.abstractWindow.depth = 0;
        
        this.testWindow = new Window(this, this.screenWidth / 2, this.screenHeight / 2, 400, 300, 'Window');
        this.alertWindow = new AlertWindow(this, 350, 350, 'Mingm123 123213 213 231 ong?');
        this.alertWindow = new AlertWindow(this, this.screenWidth / 2 -250, this.screenHeight / 2 -250, 'Mingmong?');
        this.alertWindow = new AlertWindow(this, this.screenWidth / 2 -150, this.screenHeight / 2 -150, 'Mingmong mingmong ming mong mingmin gmingmongmongmin 123 123 123 1231231 g???!?! ?!@?! ?!?!? !?');
        this.inventoryWindow = new InventoryWindow(this, this.gameInstance, this.screenWidth / 2, this.screenHeight / 2);
        this.statsWindow = new StatsWindow(this, this.gameInstance, 350, 180);

        this.backgroundImage = this.add.image(this.screenWidth / 2, this.screenHeight / 2, 'game-bg');
        this.backgroundImage.setDisplaySize(this.screenWidth, this.screenHeight);
        this.backgroundImage.depth = -1000;

    }
  
    update() {
    }
}
