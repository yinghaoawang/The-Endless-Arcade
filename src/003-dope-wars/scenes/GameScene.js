import Phaser from 'phaser3';
import Player from '../unit/Player';

export default class GameScene extends Phaser.Scene {
    constructor() {
        super();
    }

    preload() {

    }

    create() {
        this.player = new Player('Jonah');
        this.player.addItem('arrow', 1000);
        this.player.removeItem('arrow', 1001);
        console.log(this.player);
    }

    update() {
    }
}
