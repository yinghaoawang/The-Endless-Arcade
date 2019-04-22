import Item from '../item/Item';
import { getItemByName } from '../item/ItemList';
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

    findItem(item) {
        let itemSlot = this.getItemSlotByItem(item);
        if (itemSlot != null) {
            return itemSlot.item; 
        } else {
            messageHandler.printLog('Inventory.findItem() could not find item ' + item.name + ' in inventory.');
            return null;
        }
    }

    getItemSlotByItem(item) {
        for (let i = 0; i < this.slots.length; ++i) {
            let slot = this.slots[i];
            if (slot.item == item) return slot;
        }
        messageHandler.printLog('Could not find item ' + item.name + ' in inventory.');
        return null;
    }

    getNumberOfSlotsContainingItem(item) {
        let count = 0;
        for (let i = 0; i < this.slots.length; ++i) {
            let slot = this.slots[i];
            if (slot.item == item) ++count;
        }
        return count;
    }
    

    removeItem(item, quantity) {
        if (typeof item === 'string') {
            item = getItemByName(item);
            if (item == null) {
                return false;
            }
        }
        
        if (!(item instanceof Item)) {
            messageHandler.printError('Inventory.removeItem() requires an item.');
            return false;
        }

        if (quantity < 0) {
            messageHandler.printError('Inventory.removeItem() requires a positive or zero quantity');
        }

        let quantityToRemove = quantity;
        let numberOfSlotsContaining = this.getNumberOfSlotsContainingItem(item);
        if (numberOfSlotsContaining == 0) {
            messageHandler.printError('Inventory does not contain ' + item.name + ', cannot remove.');
            return false;
        } else {
            while (numberOfSlotsContaining > 0 && quantityToRemove > 0) {
                let slot = this.getItemSlotByItem(item);
                if (slot.quantity <= quantityToRemove) {
                    quantityToRemove -= slot.quantity;
                    this.slots.splice(this.slots.indexOf(slot), 1);
                } else {
                    slot.quantity -= quantityToRemove;
                    quantityToRemove = 0;
                }

                numberOfSlotsContaining = this.getNumberOfSlotsContainingItem(item);
            }
            if (quantityToRemove > 0) {
                messageHandler.printLog('Could not remove ' + quantity + ' ' + item.name + ' from Inventory, ' + quantityToRemove + ' to remove remamining.');
            }
            return true;
        }
    }

    addItem(item, quantity) {
        if (typeof item === 'string') {
            item = getItemByName(item);
            if (item == null) {
                return false;
            }
        }

        if (!(item instanceof Item)) {
            messageHandler.printError('Inventory.addItem() requires an item.');
            return false;
        }

        if (quantity < 0) {
            messageHandler.printError('Inventory.addItem() requires a positive or zero quantity');
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
