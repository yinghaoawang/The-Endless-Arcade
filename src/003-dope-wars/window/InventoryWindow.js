import Window from './Window';
import Text from '../text/Text';
import TextField from '../text/TextField';
import messageHandler from '../MessageHandler';

export default class InventoryWindow extends Window {
    constructor(scene, x, y) {
        super(scene, x, y, 500, 300);

        let itemRowXOffset = -1 * this.width / 2 + this.paneMargin + 10;
        let itemRowYOffset = -1 * this.height / 2 + this.topBar.displayHeight + this.paneMargin;
        this.itemNameText = new Text(this.scene, itemRowXOffset, itemRowYOffset, 'Name');
        this.add(this.itemNameText);

        let quantityXOffset = itemRowXOffset + 100;
        this.itemQuantityText = new Text(this.scene, quantityXOffset, itemRowYOffset, 'Qty.');
        this.add(this.itemQuantityText);

        let priceXOffset = quantityXOffset + 60;
        this.itemPriceText = new Text(this.scene, priceXOffset, itemRowYOffset, 'Price');
        this.add(this.itemPriceText);

        let dealQuantityXOffset = priceXOffset + 80;
        this.itemDealQuantityText = new Text(this.scene, dealQuantityXOffset, itemRowYOffset, 'Deal');
        this.add(this.itemDealQuantityText);

        let valueXOffset = dealQuantityXOffset + 50;
        this.itemValueText = new Text(this.scene, valueXOffset, itemRowYOffset, 'Value');
        this.add(this.itemValueText);

        this.itemRows = 10;
        let itemRowDistance = 20;

        this.itemNameTexts = this.createTextRow(itemRowXOffset, itemRowYOffset, itemRowDistance, 'Battleaxe');
        this.itemQuantityTexts = this.createTextRow(quantityXOffset, itemRowYOffset, itemRowDistance, 10);
        this.itemPriceTexts = this.createTextRow(priceXOffset, itemRowYOffset, itemRowDistance, '$11111111');
        this.itemDealQuantityTexts = this.createInputTextRow(dealQuantityXOffset, itemRowYOffset, itemRowDistance, 32, '0');
        this.itemValueTexts = this.createTextRow(valueXOffset, itemRowYOffset, itemRowDistance, '$10000000');
        
        this.updateList.push(...this.itemDealQuantityTexts);
    }

    update() {
        super.update();
        this.syncUserInventory();
        this.updateDealQuantityValue();
    }

    syncUserInventory() {
    }

    updateDealQuantityValue() {
        for (let i = 0; i < this.itemRows; ++i) {
            let itemDealQuantityText = this.itemDealQuantityTexts[i].trueText;
            
            let itemPrice = this.itemPriceTexts[i].text;
            if (itemPrice[0] != '$') {
                messageHandler.printError('Price does not have a dollar sign in front.');
                return;
            } else {
                itemPrice = itemPrice.substring(1);
            }
            
            if (itemDealQuantityText.length == 0) {
                itemDealQuantityText = 0;
            }
            
            let itemValue = itemDealQuantityText * itemPrice;
            this.itemValueTexts[i].setText('$' + itemValue);
        }
    }

    createTextRow(rowXOffset, rowYOffset, rowDistance, message) {
        let texts = [];
        for (let i = 0; i < this.itemRows; ++i) {
            let text = new Text(this.scene, rowXOffset, rowYOffset + rowDistance * (i + 1), message);
            texts.push(text);
            this.add(text);
        }
        return texts;
    }

    createInputTextRow(rowXOffset, rowYOffset, rowDistance, rowWidth, message) {
        let texts = [];
        for (let i = 0; i < this.itemRows; ++i) {
            let inputText = new TextField(this.scene, rowXOffset, rowYOffset + rowDistance * (i + 1), rowWidth, this, 4, message);
            inputText.name = 'input-text-' + i;
            texts.push(inputText);
            this.add(inputText);
        }
        return texts;
    }
}