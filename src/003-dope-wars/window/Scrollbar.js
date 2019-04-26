import Phaser from 'phaser3';

export default class Scrollbar extends Phaser.GameObjects.Container {
    constructor(scene, x, y, width, height, viewportArea, totalArea) {
        super(scene, x, y);
        this.width = width;
        this.height = height;
        this.viewportArea = viewportArea;
        this.totalArea = totalArea;
        
        this.graphics = scene.add.graphics(this.x, this.y);
        this.graphics.fillStyle('0x000000');
        this.graphics.fillRect(0, 0, this.width, this.height);
        this.add(this.graphics);

        this.barArea = {
            x: 0,
            y: 0,
            width: this.width,
            height: (this.viewportArea.height / this.totalArea.height) * this.height
        }

        this.barGraphics = scene.add.graphics(this.x + this.barArea.x, this.y + this.barArea.y);
        this.graphics.fillStyle('0x550055');
        this.graphics.fillRect(0, 0, this.barArea.width, this.barArea.height);
        this.add(this.graphics);
    }
}