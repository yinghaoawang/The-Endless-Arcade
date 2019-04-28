import Phaser from 'phaser3';
import Scrollbar from '../Scrollbar';
import ContentComponent from './ContentComponent';

export default class TextAreaComponent extends ContentComponent {
    constructor(scene, parentWindow, x, y, width, height) {
        super(scene, parentWindow, x, y, width, height);

        this.displayRect = new Phaser.GameObjects.Rectangle(scene, this.x, this.y, width, height, '0xffffff', .5);
        this.displayRect.setOrigin(0);
        this.add(this.displayRect, true);

        this.pane = new Phaser.GameObjects.Container(scene, this.x, this.y);
        this.add(this.pane, true);

        this.currentLine = 0;
        this.lines = [];
        this.textStyle = {
            color: '#0000ff',
            fontFamily: 'VT323',
            fontSize: '16px',
            wordWrap: { width: this.width }
        };
        this.textObject = new Phaser.GameObjects.Text(this.scene, 0, 0, '', this.textStyle);
        this.pane.add(this.textObject);

        this.createNewMask();

        /*
        let i = 0
        for (; i < 9; ++i) this.addLine('superCoolGuy79: --- 123 12313 2312123');
        setInterval(() => {
            this.addLine('superCoolGuy79: --- 123 12313 2312123');
            if (++i % 11 == 0) {
                this.clearText();
            }
        }, 3000);
        */        

        this.addScrollbar();
    }

    clearText() {
        this.textObject.setText('');
        if (this.scrollbar) {
            this.scrollbar.updateSize(this.viewportArea, {
                width: this.textObject.width,
                height: this.textObject.height
            });
        }
        this.pane.y = this.y;
    }

    addLine(line) {
        this.lines.push(line);
        let parsedLine = this.textObject.text;
        if (this.textObject.text != '') parsedLine += '\n';
        parsedLine += line;
        this.textObject.setText(parsedLine);
        this.scene.sound.play('message');

        if (this.scrollbar) {
            this.scrollbar.updateSize(this.viewportArea, {
                width: this.textObject.width,
                height: this.textObject.height
            });
        }

        this.pane.y = this.y;
    }

    get viewportArea() {
        return {
            width: this.width,
            height: this.height
        }
    }

    createNewMask() {
        this.maskG = this.scene.add.graphics({
            x: this.x,
            y: this.y,
        });
        this.maskG.fillRect(0, 0, this.width, this.height);
        this.maskG.setAlpha(0);
        this.add(this.maskG);
        
        this.pane.mask = new Phaser.Display.Masks.GeometryMask(this, this.maskG);
    }

    removeScrollbar() {
        this.scrollbar.destroy();
        this.scrollbar = null;
    }

    addScrollbar() {
        let scrollbarArea = {
            margin: 0,
            width: 18,
        }
        
        this.scrollbar = new Scrollbar(this.scene, this,
            this.x + this.width - scrollbarArea.width - scrollbarArea.margin, this.y + scrollbarArea.margin,
            scrollbarArea.width, this.height - 2 * scrollbarArea.margin,
            { width: this.width, height: this.height }, { width: this.textObject.width, height: this.textObject.height },
            this.pane
        );

        this.add(this.scrollbar, true);
    }
    
}
