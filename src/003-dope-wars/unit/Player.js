import Unit from './Unit';

export default class Player extends Unit {
    constructor(name) {
        super(name);
        
    }

    addItem(item, quantity) {
        let success = super.addItem(item, quantity);
        return success;
    }

    addItemAtIndex(index, quantity) {
        let success = super.addItemAtIndex(index, quantity);
        return success;
    }
    
    removeItem(item, quantity) {
        let success = super.removeItem(item, quantity);
        return success;
    }
    removeItemAtIndex(index, quantity) {
        let success = super.removeItemAtIndex(index, quantity);
        return success;
    }
}