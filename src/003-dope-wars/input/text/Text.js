import Phaser from 'phaser3';

export default class Text extends Phaser.GameObjects.Container {
    constructor(scene, x, y, width, height, text) {
        super(scene, x, y);
        this._text = text;

        this._width = width;
        this.height = height;
        this.textObject = new Phaser.GameObjects.Text(this.scene, 0, 0, text);
        this.textObject.setStyle({
            color: '#000000',
            fontFamily: 'VT323',
        });
        this.textObject.setPadding(2.5, 0, 2.5, 0);
        this.textObject.setOrigin(0);
        this.add(this.textObject);

        this.propertyChangeListeners = [];
    }

    setText(value) {
        this.textObject.setText(value);
    }


    get width() {
        return this._width;
    }

    set width(value) {
        this.textObject.setWordWrapWidth(value, false);
        this._width = value;
    }

    get text() {
        return this._text;
    }

    set text(value) {
        this._text = value;
        if (typeof this.propertyChangeListeners != 'undefined') { 
            this.triggerEvent('propertychange');
        }
    }

    addPropertyChangeListener(listener) {
        this.propertyChangeListeners.push(listener);
    }

    triggerEvent(event) {
        if (event == 'propertychange') {
            this.propertyChangeListeners.forEach((fn) => {
                fn();
            });
        }
    }
    
}
