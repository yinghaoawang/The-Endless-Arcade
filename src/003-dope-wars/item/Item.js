export default class Item {
    /** Never call this, instead get an item from ItemList */
    constructor(name, maxStack) {
        this.name = name;
        if (typeof maxStack == 'undefined') maxStack = 1;
        this.maxStack = maxStack;
    }
}