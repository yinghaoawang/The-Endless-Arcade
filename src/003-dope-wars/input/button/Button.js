import Phaser from 'phaser3';

export default class Button extends Phaser.GameObjects.Image {
    constructor(scene, x, y, texture) {
        super(scene, x, y, texture);
        this.clicked = false;
        this.setInteractive();
        this.on('pointerdown', function() {
            this.clicked = true;
        });
        this.on('pointerover', function() {
            //this.setTexture('window-close-btn-hover');
            this.setTint('0xffffff', '0xffffff', '0xffffff', '0xffffff');
        });
        this.on('pointerout', function() {
            //this.setTexture('window-close-btn');
            this.clicked = false;
        });
        
    }

    // overload on to adds a terrible 'wrapper' for my own 'pointerclicked' event
    on(...args) {
        // problem: does not use any arguments past index 1 if event is 'pointerclicked'
        if (args[0] == 'pointerclicked') {
            this.on('pointerup', () => {
                if (this.clicked) {
                    args[1]();
                }
            });
        } else {
            super.on.apply(this, args);
        }
    }

    
}