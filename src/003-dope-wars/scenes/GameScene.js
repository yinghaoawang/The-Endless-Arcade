import Phaser from 'phaser3';
import Player from '../unit/Player';
import Item from '../item/Item';

export default class GameScene extends Phaser.Scene {
    constructor() {
        super();
    }

    preload() {

    }

    create() {
        this.player = new Player('Jonah');
        let sword = new Item('Sword', 1);
        let arrow = new Item('Arrow', 100);
        this.player.addItem(arrow, 200);
        console.log(this.player);
    }

    update() {
    }
}
