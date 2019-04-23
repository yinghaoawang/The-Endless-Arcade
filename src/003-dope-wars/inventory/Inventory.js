import Item from '../item/Item';
import ItemSlot from './ItemSlot';
import { getItemByName } from '../item/ItemList';
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

        let emptySlots = this.maxSlots - this.slots.length;
        let availableQuantity = emptySlots * item.maxStack;
        
        for (let i = 0; i < this.slots; ++i) {
            let slot = this.slots[i];
            if (slot.item == item) availableQuantity += item.maxStack - slot.quantity;
        }
        if (availableQuantity < quantity) {
            messageHandler.print('Inventory does not have enough slots to add ' + item.name + '.');
            return false;
        }

        let remainingQuantity = quantity;
        
        for (let i = 0; i < this.slots.length; ++i) {
            let slot = this.slots[i];
            if (slot.item == item) {
                let stackableQuantity = item.maxStack - slot.quantity;
                if (stackableQuantity >= remainingQuantity) {
                    slot.quantity += remainingQuantity;
                    remainingQuantity = 0;
                    break;
                } else {
                    remainingQuantity -= stackableQuantity;
                    slot.quantity += stackableQuantity;
                }
            }
        }
        if (remainingQuantity > 0) {
            
            for (let i = this.slots.length; i < this.maxSlots; ++i) {

                if (remainingQuantity > item.maxStack) {
                    this.slots[i] = new ItemSlot(item, item.maxStack);
                    remainingQuantity -= item.maxStack;
                } else {
                    this.slots[i] = new ItemSlot(item, remainingQuantity);
                    return;
                }
            }
        }
        messageHandler.printError('Algorithm for adding item stacks incorrect.');
    }
}
