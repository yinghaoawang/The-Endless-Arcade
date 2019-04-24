import Unit from './Unit';

export default class Player extends Unit {
    constructor(name) {
        super(name);
    }
    addItem(item, quantity) {
        let success = super.addItem(item, quantity);
        if (typeof this.updateInventoryCallback != 'undefined') {
            this.updateInventoryCallback();
        }
        return success;
    }

    addItemAtIndex(index, quantity) {
        let success = super.addItemAtIndex(index, quantity);
        if (typeof this.updateInventoryCallback != 'undefined') {
            this.updateInventoryCallback();
        }
        return success;
    }
    
    removeItem(item, quantity) {
        let success = super.removeItem(item, quantity);
        if (typeof this.updateInventoryCallback != 'undefined') {
            this.updateInventoryCallback();
        }
        return success;
    }
    removeItemAtIndex(index, quantity) {
        let success = super.removeItemAtIndex(index, quantity);
        if (typeof this.updateInventoryCallback != 'undefined') {
            this.updateInventoryCallback();
        }
        return success;
    }
}