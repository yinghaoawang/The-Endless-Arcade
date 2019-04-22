export default class Item {
    constructor(name, maxStack) {
        this.name = name;
        if (typeof maxStack == 'undefined') maxStack = 1;
        this.maxStack = maxStack;
    }
}