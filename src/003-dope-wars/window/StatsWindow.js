import Window from './Window';

export default class StatsWindow extends Window {
    constructor(scene, game, x, y) {
        super(scene, x, y, 300, 300, 'Stats');
        this.game = game;
        this.targetUnit = game.player;

        let xOffset = 10;
        let yOffset = 5;

        let colSpacing = 20;
        
        this.textLabels = this.windowContent.createTextCol(xOffset, yOffset, colSpacing, ['Name', 'Gold', 'Day']);
        this.textValues = this.windowContent.createTextCol(xOffset + 40, yOffset, colSpacing, [this.targetUnit.name, this.targetUnit.gold, this.game.day]);
        this.targetUnit.addPropertyChangeListener(() => {
            this.update();
        });
        
    }

    updateStats() {
        this.textValues[0].setText(this.targetUnit.name);
        this.textValues[1].setText(this.targetUnit.gold);
        this.textValues[2].setText(this.game.day);
    }

    update() {
        super.update();
        this.updateStats();
    }
}