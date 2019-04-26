import Text from '../input/text/Text';
import messageHandler from '../MessageHandler';
import Window from './Window';
import AlertWindow from './AlertWindow';

export default class InventoryWindow extends Window {
    constructor(scene, game, x, y) {
        super(scene, x, y, 500, 300, 'Inventory');

        this.game = game;
        this.targetUnit = game.player;

        let xOffset = 10;
        let yOffset = 5;
        this.itemNameText = new Text(this.scene, xOffset, yOffset, null, null, 'Name');
        this.windowContent.pane.add(this.itemNameText);

        let quantityXOffset = xOffset + 100;
        this.itemQuantityText = new Text(this.scene, quantityXOffset, yOffset, null, null, 'Qty.');
        this.windowContent.pane.add(this.itemQuantityText);

        let priceXOffset = quantityXOffset + 60;
        this.itemPriceText = new Text(this.scene, priceXOffset, yOffset, null, null, 'Price');
        this.windowContent.pane.add(this.itemPriceText);

        let dealQuantityXOffset = priceXOffset + 80;
        this.itemDealQuantityText = new Text(this.scene, dealQuantityXOffset, yOffset, null, null, 'Deal');
        this.windowContent.pane.add(this.itemDealQuantityText);

        let valueXOffset = dealQuantityXOffset + 50;
        this.itemValueText = new Text(this.scene, valueXOffset, yOffset, null, null, 'Value');
        this.windowContent.pane.add(this.itemValueText);

        let sellXOffset = valueXOffset + 80;
        this.itemValueText = new Text(this.scene, sellXOffset, yOffset, null, null, 'Sell');
        this.windowContent.pane.add(this.itemValueText);

        /*
        let sellXOffset = buyXOffset + 40;
        this.itemValueText = new Text(this.scene, sellXOffset, yOffset, 'Sell');
        this.add(this.itemValueText);
        */

        let colDistance = 20;
        this.itemRows = 10;

        this.itemNameTexts = this.windowContent.createTextCol(xOffset, yOffset + colDistance, colDistance, 'Battleaxe', this.itemRows);
        this.itemQuantityTexts = this.windowContent.createTextCol(quantityXOffset, yOffset + colDistance, colDistance, 10, this.itemRows);
        this.itemPriceTexts = this.windowContent.createTextCol(priceXOffset, yOffset + colDistance, colDistance, '$11111', this.itemRows);

        // special input field
        this.itemDealQuantityTexts = this.windowContent.createInputTextCol(dealQuantityXOffset, yOffset + colDistance, colDistance, ['0'], this.itemRows, 32);

        this.itemValueTexts = this.windowContent.createTextCol(valueXOffset, yOffset + colDistance, colDistance, '$10000000', this.itemRows);

        // special button
        let buttonPadding = 2;
        this.sellButtons = this.windowContent.createButtonCol(buttonPadding + sellXOffset, buttonPadding + yOffset + colDistance, colDistance, 15, 15, this.itemRows, 'item-sell-btn', 'item-sell-btn-down', 'item-sell-btn-over');
        // TODO this probably shouldn't go in this file
        this.sellButtons.forEach((button) => {
            button.setOrigin(0, 0);
            button.on('pointerclicked', () => {
                let index = this.sellButtons.indexOf(button);
                this.trySellSlot(index);
            });
        });

        this.targetUnit.addPropertyChangeListener(() => {
            this.update();
        });

        this.itemDealQuantityTexts.forEach((textField) => {
            textField.addPropertyChangeListener(() => {
                this.update();
            });
        });

        this.update();
    }

    trySellSlot(slotIndex) {
        let slot = this.targetUnit.inventory.slots[slotIndex];
        // TODO PRICE IS PLACEHOLDER
        let price = 11111;
        let quantityOwned = slot.quantity;
        let quantityOffered = this.itemDealQuantityTexts[slotIndex].text;
        if (quantityOffered == '') {
            return;
        } else {
            quantityOffered = parseInt(quantityOffered);
        }
        if (quantityOffered == 0) return;
        if (quantityOffered > quantityOwned) {
            new AlertWindow(this.scene, this.scene.screenWidth / 2, this.scene.screenHeight / 3, 'You do not have the quantity offered to sell.');
            return;
        }
        let isRowRemoved = this.targetUnit.inventory.slots[slotIndex].quantity == quantityOffered;
        let isSold = this.targetUnit.removeItemAtIndex(slotIndex, quantityOffered);
        
        if (isSold) {
            if (isRowRemoved) {
                this.shiftUpOfferQuantityValues(slotIndex);
                this.itemDealQuantityTexts[slotIndex].text = '0';
            } else {
                this.itemDealQuantityTexts[slotIndex].value = '';
                this.scene.selectedInput = this.itemDealQuantityTexts[slotIndex];
            }
            
            this.scene.sound.play('item-sell');
            this.targetUnit.addGold(quantityOffered * price);
        }

        this.update();
    }

    shiftUpOfferQuantityValues(index) {
        for (let i = index; i < this.itemRows - 1; ++i) {
            this.itemDealQuantityTexts[i].setText(this.itemDealQuantityTexts[i + 1].text);
        }
    }

    showRow(index) {
        this.itemNameTexts[index].setVisible(true);
        this.itemQuantityTexts[index].setVisible(true);
        this.itemPriceTexts[index].setVisible(true);
        this.itemDealQuantityTexts[index].setVisible(true);
        
        this.itemValueTexts[index].setVisible(true);
        this.sellButtons[index].setVisible(true);
    }

    hideRow(index) {
        this.itemNameTexts[index].setVisible(false);
        this.itemQuantityTexts[index].setVisible(false);
        this.itemPriceTexts[index].setVisible(false);
        this.itemDealQuantityTexts[index].setVisible(false);
        this.itemValueTexts[index].setVisible(false);
        this.sellButtons[index].setVisible(false);
    }

    update() {
        super.update();
        this.updateWithUserValues();
        this.updateInputTexts();
        this.updateDealQuantityValue();
    }

    updateInputTexts() {
        for (let i = 0; i < this.itemDealQuantityTexts.length; ++i) {
            if (parseInt(this.itemDealQuantityTexts[i].text) > parseInt(this.itemQuantityTexts[i].textObject.text)) {
                this.itemDealQuantityTexts[i].text = this.itemQuantityTexts[i].textObject.text;
                
            }
            this.itemDealQuantityTexts[i].update();
        }
    }

    updateWithUserValues() {
        let playerInventory = this.targetUnit.inventory;
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
            let itemDealQuantityText = this.itemDealQuantityTexts[i].text;
            
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
