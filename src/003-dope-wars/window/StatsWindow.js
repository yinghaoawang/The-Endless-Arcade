import Window from './Window';

export default class StatsWindow extends Window {
    constructor(scene, x, y, user) {
        super(scene, x, y, 300, 300, 'Stats');
        this.user = user;

        let xOffset = -1 * this.width / 2 + this.paneMargin + 10;
        let yOffset = -1 * this.height / 2 + this.topBar.displayHeight + this.paneMargin;

        let colSpacing = 20;
        
        this.textLabels = this.createTextCol(xOffset, yOffset, colSpacing, ['Name', 'Gold', 'Days'], 10);
    }

    update() {
        super.update();
    }
}