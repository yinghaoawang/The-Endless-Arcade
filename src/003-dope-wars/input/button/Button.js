import Phaser from 'phaser3';

export default class Button extends Phaser.GameObjects.Image {
    constructor(scene, x, y, pointerUpTexture, pointerDownTexture, pointerOverTexture) {
        super(scene, x, y, pointerUpTexture);
        this.pointerUpTexture = pointerUpTexture;
        this.pointerDownTexture = pointerDownTexture;
        this.pointerOverTexture = pointerOverTexture;
        this.clicked = false;
        this.setInteractive();
        this.on('pointerdown', function() {
            this.clicked = true;
            if (typeof this.pointerDownTexture != 'undefined') {
                this.setTexture(this.pointerDownTexture);
            }
        });
        this.on('pointerover', () => {
            if (!this.clicked) {
                if (typeof this.pointerOverTexture != 'undefined') {
                    this.setTexture(this.pointerOverTexture);
                }
            }
        });
        this.on('pointerout', () => {
            if (!this.clicked) {
                if (typeof this.pointerUpTexture != 'undefined') {
                    this.setTexture(this.pointerUpTexture);
                }
            }
        })
        
        this.sceneListener = () => {
            this.clicked = false;
            if (typeof this.pointerUpTexture != 'undefined') {
                this.setTexture(this.pointerUpTexture);
            }
        };
        this.scene.input.on('pointerup', this.sceneListener);
    }

    destroy() {
        this.scene.input.off('pointerup', this.sceneListener);
        super.destroy();
    }

    // overload on to add a terrible 'wrapper' for my own 'pointerclicked' event
    on(event, fn, context) {
        if (event == 'pointerclicked') {
            this.on('pointerup', () => {
                if (this.clicked) {
                    fn();
                }
            });
        } else {
            super.on(event, fn, context);
        }
    }

    
}