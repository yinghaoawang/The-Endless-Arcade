import Phaser from 'phaser3';
import TextWindow from '../TextWindow';

export default class GameScene extends Phaser.Scene {
    constructor() {
        super();
    }

    preload() {
    }

    create() {
        this.screenWidth = this.cameras.main.width;
        this.screenHeight = this.cameras.main.height;
        this.textWindow = new TextWindow(this, 0, this.screenHeight * .7, this.screenWidth, this.screenHeight * .3);
        let text = `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Curabitur faucibus at eros blandit venenatis. Nulla sollicitudin nunc ac dui dignissim, id gravida purus convallis. Aenean in metus bibendum, rutrum erat eget, sagittis metus. Donec vehicula nisi ex, et mattis massa sollicitudin non. Integer ornare interdum dolor sed auctor. Proin maximus eget metus ac pulvinar. Duis facilisis tempor nulla, non finibus magna vehicula sit amet. Aenean eget faucibus libero, eu faucibus est.`;
        this.textWindow.displayText(text);
    }

    update(time, delta) {
    }

}
