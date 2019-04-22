import Window from './Window';
import Text from '../text/Text';

export default class InventoryWindow extends Window {
    constructor(scene, x, y) {
        super(scene, x, y, 500, 300);

        let itemRowXOffset = -1 * this.width / 2 + this.paneMargin + 10;
        let itemRowYOffset = -1 * this.height / 2 + this.topBar.displayHeight + this.paneMargin;
        this.itemNameText = new Text(this.scene, itemRowXOffset, itemRowYOffset, 'Name');
        this.add(this.itemNameText);

        let priceXOffset = itemRowXOffset + 100;
        this.itemPriceText = new Text(this.scene, priceXOffset, itemRowYOffset, 'Price');
        this.add(this.itemPriceText);

        let quantityXOffset = priceXOffset + 80;
        this.itemQuantityText = new Text(this.scene, quantityXOffset, itemRowYOffset, 'Qty.');
        this.add(this.itemQuantityText);

        let valueXOffset = quantityXOffset + 60;
        this.itemValueText = new Text(this.scene, valueXOffset, itemRowYOffset, 'Value');
        this.add(this.itemValueText);

        this.itemRows = 10;
        let itemRowDistance = 20;

        this.itemNameTexts = this.createTextRow(itemRowXOffset, itemRowYOffset, itemRowDistance, 'Battleaxe');
        this.itemPriceTexts = this.createTextRow(priceXOffset, itemRowYOffset, itemRowDistance, '$1000000');
        this.itemQuantityTexts = this.createTextRow(quantityXOffset, itemRowYOffset, itemRowDistance, 10);
        this.itemValueTexts = this.createTextRow(valueXOffset, itemRowYOffset, itemRowDistance, '$10000000');
    }

    createTextRow(rowXOffset, rowYOffset, itemRowDistance, message) {
        let texts = [];
        for (let i = 0; i < this.itemRows; ++i) {
            let text = new Text(this.scene, rowXOffset, rowYOffset + itemRowDistance * (i + 1), message);
            texts.push(text);
            this.add(text);
        }
        return texts;
    }
}