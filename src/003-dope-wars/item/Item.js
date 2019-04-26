import messageHandler from "../MessageHandler";

export default class Item {
    /** Never call this, instead get an item from ItemList */
    constructor(name, price, maxStack, durability) {
        this.name = name;
        if (typeof price == 'undefined') messageHandler.lastError('Item ' + name + ' must have a price.');
        if (typeof maxStack == 'undefined') maxStack = 1;
        if (typeof durability == 'undefined') durability = 100;

        this.durability = durability;
        this.price = price;
        this.maxStack = maxStack;
    }
}