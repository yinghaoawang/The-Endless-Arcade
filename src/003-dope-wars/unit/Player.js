import Unit from './Unit';

export default class Player extends Unit {
    constructor(name) {
        super(name);
        this.health = 100;
        this.maxHealth = 100;
        this.tiredness = 0;
        this.maxTiredness = 100;
    }

    step() {
        let hpLoss = 0;
        if (this.tiredness >= 80) hpLoss = 15;
        else if (this.tiredness >= 50) hpLoss = 10;
        else if (this.tiredness >= 40) hpLoss = 5;
        this.health -= hpLoss;
        this.tiredness += 5 + Math.floor(Math.random() * 2);
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