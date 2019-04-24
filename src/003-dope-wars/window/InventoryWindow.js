import Text from '../input/text/Text';
import messageHandler from '../MessageHandler';
import Window from './Window';

export default class InventoryWindow extends Window {
    constructor(scene, x, y) {
        super(scene, x, y, 500, 300);

        let xOffset = -1 * this.width / 2 + this.paneMargin + 10;
        let yOffset = -1 * this.height / 2 + this.topBar.displayHeight + this.paneMargin;
        this.itemNameText = new Text(this.scene, xOffset, yOffset, 'Name');
        this.add(this.itemNameText);

        let quantityXOffset = xOffset + 100;
        this.itemQuantityText = new Text(this.scene, quantityXOffset, yOffset, 'Qty.');
        this.add(this.itemQuantityText);

        let priceXOffset = quantityXOffset + 60;
        this.itemPriceText = new Text(this.scene, priceXOffset, yOffset, 'Price');
        this.add(this.itemPriceText);

        let dealQuantityXOffset = priceXOffset + 80;
        this.itemDealQuantityText = new Text(this.scene, dealQuantityXOffset, yOffset, 'Deal');
        this.add(this.itemDealQuantityText);

        let valueXOffset = dealQuantityXOffset + 50;
        this.itemValueText = new Text(this.scene, valueXOffset, yOffset, 'Value');
        this.add(this.itemValueText);

        let colDistance = 20;
        this.itemRows = 10;

        this.itemNameTexts = this.createTextCol(xOffset, yOffset + colDistance, colDistance, 'Battleaxe', this.itemRows);
        this.itemQuantityTexts = this.createTextCol(quantityXOffset, yOffset + colDistance, colDistance, 10, this.itemRows);
        this.itemPriceTexts = this.createTextCol(priceXOffset, yOffset + colDistance, colDistance, '$11111111', this.itemRows);

        // special input field
        this.itemDealQuantityTexts = this.createInputTextCol(dealQuantityXOffset, yOffset + colDistance, colDistance, 0, this.itemRows, 32);

        this.itemValueTexts = this.createTextCol(valueXOffset, yOffset + colDistance, colDistance, '$10000000', this.itemRows);

        // special button
        this.buyButtons = this.createButtonCol(valueXOffset + 80, 2 + yOffset + colDistance, colDistance, 15, 15, 'Buy', this.itemRows);
        this.buyButtons.forEach((button) => {
            button.setOrigin(0, 0);
        });
        
        this.updateList.push(...this.itemDealQuantityTexts);
    }

    showRow(index) {
        this.itemNameTexts[index].setVisible(true);
        this.itemQuantityTexts[index].setVisible(true);
        this.itemPriceTexts[index].setVisible(true);
        this.itemDealQuantityTexts[index].setVisible(true);
        this.itemValueTexts[index].setVisible(true);
        this.buyButtons[index].setVisible(true);
    }

    hideRow(index) {
        this.itemNameTexts[index].setVisible(false);
        this.itemQuantityTexts[index].setVisible(false);
        this.itemPriceTexts[index].setVisible(false);
        this.itemDealQuantityTexts[index].setVisible(false);
        this.itemValueTexts[index].setVisible(false);
        this.buyButtons[index].setVisible(false);
    }

    update() {
        super.update();
        if (this.beingDestroyed) return;
        this.updateWithUserValues();
        this.updateInputTexts();
        this.updateDealQuantityValue();
    }

    updateInputTexts() {
        for (let i = 0; i < this.itemDealQuantityTexts.length; ++i) {
            if (parseInt(this.itemDealQuantityTexts[i].trueText) > parseInt(this.itemQuantityTexts[i].text)) {
                this.itemDealQuantityTexts[i].trueText = this.itemQuantityTexts[i].text;
            }
        }
    }

    updateWithUserValues() {
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
}
