import Inventory from '../inventory/Inventory';

export default class Unit {
    constructor(name) {
        this.name = name;
        this.gold = 0;
        this.inventory = new Inventory();
        this.propertyChangeListeners = [];
    }

    addPropertyChangeListener(listener) {
        this.propertyChangeListeners.push(listener);
    }

    triggerEvent(event) {
        if (event == 'propertychange') {
            this.propertyChangeListeners.forEach((fn) => {
                fn();
            });
        }
    }

    addGold(amount) {
        this.setGold(this.gold + amount);
    }

    setGold(amount) {
        this.gold = amount;
        this.triggerEvent('propertychange');
    }

    addItem(item, quantity) {
        let success = this.inventory.addItem(item, quantity);
        this.triggerEvent('propertychange');
        return success;
    }
    addItemAtIndex(index, quantity) {
        let success = this.inventory.addItemAtIndex(index, quantity);
        this.triggerEvent('propertychange');
        return success;
    }

    removeItem(item, quantity) {
        let success = this.inventory.removeItem(item, quantity);
        this.triggerEvent('propertychange');
        return success;
    }

    removeItemAtIndex(index, quantity) {
        let success = this.inventory.removeItemAtIndex(index, quantity);
        this.triggerEvent('propertychange');
        return success;
    }
}