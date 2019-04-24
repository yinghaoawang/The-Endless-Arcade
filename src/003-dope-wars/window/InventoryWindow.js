import Window, { bringWindowToTop } from './Window';
import Text from '../input/text/Text';
import NumberTextField from '../input/text/TextField';
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
        let itemColDistance = 20;

        this.itemNameTexts = this.createTextCol(itemRowXOffset, itemRowYOffset, itemColDistance, 'Battleaxe');
        this.itemQuantityTexts = this.createTextCol(quantityXOffset, itemRowYOffset, itemColDistance, 10);
        this.itemPriceTexts = this.createTextCol(priceXOffset, itemRowYOffset, itemColDistance, '$11111111');
        this.itemDealQuantityTexts = this.createInputTextCol(dealQuantityXOffset, itemRowYOffset, itemColDistance, 32, '0');
        this.itemValueTexts = this.createTextCol(valueXOffset, itemRowYOffset, itemColDistance, '$10000000');
        
        this.updateList.push(...this.itemDealQuantityTexts);
    }

    showRow(index) {
        this.itemNameTexts[index].setVisible(true);
        this.itemQuantityTexts[index].setVisible(true);
        this.itemPriceTexts[index].setVisible(true);
        this.itemDealQuantityTexts[index].setVisible(true);
        this.itemValueTexts[index].setVisible(true);
    }

    hideRow(index) {
        this.itemNameTexts[index].setVisible(false);
        this.itemQuantityTexts[index].setVisible(false);
        this.itemPriceTexts[index].setVisible(false);
        this.itemDealQuantityTexts[index].setVisible(false);
        this.itemValueTexts[index].setVisible(false);
    }

    update() {
        super.update();
        if (this.beingDestroyed) return;
        this.syncUserInventory();
        this.updateDealQuantityValue();
    }

    syncUserInventory() {
        let playerInventory = this.scene.player.inventory;
        for (let i = 0; i < playerInventory.slots.length; ++i) {
            let slot = playerInventory.slots[i];
            this.itemNameTexts[i].setText(slot.item.name);
            this.itemQuantityTexts[i].setText(slot.quantity);
            this.showRow(i);
        }
        for (let i = playerInventory.slots.length; i < playerInventory.maxSlots; ++i) {
            this.hideRow(i);
        }
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

    createTextCol(colXOffset, colYOffset, colDistance, message) {
        let texts = [];
        for (let i = 0; i < this.itemRows; ++i) {
            let text = new Text(this.scene, colXOffset, colYOffset + colDistance * (i + 1), message);
            texts.push(text);
            this.add(text);
        }
        return texts;
    }

    createInputTextCol(colXOffset, colYOffset, colDistance, textWidth, message) {
        let texts = [];
        for (let i = 0; i < this.itemRows; ++i) {
            let inputText = new NumberTextField(this.scene, colXOffset, colYOffset + colDistance * (i + 1), textWidth, this, 4, message);
            inputText.on('pointerdown', () => {
                bringWindowToTop(this);
            });
            texts.push(inputText);
            this.add(inputText);
        }
        return texts;
    }
}