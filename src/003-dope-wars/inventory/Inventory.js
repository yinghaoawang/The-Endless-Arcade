import Item from '../item/Item';
import ItemSlot from './ItemSlot';
import messageHandler from '../MessageHandler';

export default class Inventory {
    constructor(maxSlots) {
        if (typeof maxSlots == 'undefined') {
            maxSlots = 10;
        }
        this.maxSlots = maxSlots;
        this.slots = [];
    }

    addItem(item, quantity) {
        if (!(item instanceof Item)) {
            messageHandler.printError('addItem() requires an item.');
            return false;
        }

        let requiredSlots = Math.floor(quantity / item.maxStack);
        let lastStackSize = quantity % item.maxStack;
        if (lastStackSize == 0) {
            --requiredSlots;
            lastStackSize = item.maxStack;
        }

        if (this.slots.length + requiredSlots >= this.maxSlots) {
            messageHandler.print('Inventory does not have enough slots to add ' + item.name + '.');
            return false;
        }

        for (let i = 0; i < requiredSlots + 1; ++i) {
            if (i == requiredSlots) {
                this.slots.push(new ItemSlot(item, lastStackSize));
            } else {
                this.slots.push(new ItemSlot(item, item.maxStack));
            }
        }
    }
}
