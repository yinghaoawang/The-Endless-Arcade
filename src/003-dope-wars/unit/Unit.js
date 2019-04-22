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
}