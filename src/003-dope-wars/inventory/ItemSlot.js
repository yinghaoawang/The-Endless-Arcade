import messageHandler from '../MessageHandler';
import Item from '../item/Item';

export default class ItemSlot {
    constructor(item, quantity) {
        if (!(item instanceof Item)) {
            messageHandler.printError('ItemSlot.addItem() requires an item.');
            return;
        }
        if (typeof quantity == 'undefined') {
            messageHandler.printError('ItemSlot.addItem() requires a quantity value.');
            return;
        }
        if (quantity <= 0) {
            messageHandler.print('Must have a quantity value greater than 0 to add the item.');
            return;
        }
        if (quantity > item.maxStack) {
            messageHandler.print('Quantity exceeds the item\'s max stack.');
            return;
        }
        this.item = item;
        this.quantity = quantity;
        return;
    }
}
