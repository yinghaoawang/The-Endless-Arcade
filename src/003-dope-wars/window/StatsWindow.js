import Window from './Window';

export default class StatsWindow extends Window {
    constructor(scene, x, y, user) {
        super(scene, x, y, 300, 300, 'Stats');
        this.user = user;

        let xOffset = -1 * this.width / 2 + this.paneMargin + 10;
        let yOffset = -1 * this.height / 2 + this.topBar.displayHeight + this.paneMargin;

        let colSpacing = 20;
        
        this.textLabels = this.createTextCol(xOffset, yOffset, colSpacing, ['Name', 'Gold', 'Days']);
        this.textValues = this.createTextCol(xOffset + 40, yOffset, colSpacing, [this.scene.player.name, this.scene.player.gold, 'Days']);
        this.scene.player.addPropertyChangeListener(() => {
            this.updateStats();
        });
    }

    updateStats() {
        this.textValues[0].setText(this.scene.player.name);
        this.textValues[1].setText(this.scene.player.gold);
        this.textValues[2].setText(this.textValues[2].text + 's');
    }

    update() {
        super.update();
    }
}