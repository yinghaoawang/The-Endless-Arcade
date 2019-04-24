import Inventory from '../inventory/Inventory';

export default class Unit {
    constructor(name) {
        this.name = name;
        this.gold = 0;
        this.inventory = new Inventory();
    }

    addItem(item, quantity) {
        return this.inventory.addItem(item, quantity);
    }
    addItemAtIndex(index, quantity) {
        return this.inventory.addItemAtIndex(index, quantity);
    }

    removeItem(item, quantity) {
        return this.inventory.removeItem(item, quantity);
    }

    removeItemAtIndex(index, quantity) {
        return this.inventory.removeItemAtIndex(index, quantity);
    }
}