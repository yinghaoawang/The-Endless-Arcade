export default class Economy {
    constructor(itemList) {
        this.itemList = itemList;
        this.itemPrices = this.randomizeCosts(itemList);
        this.inflationRate = .02;
    }

    inflatePrices() {
        this.itemPrices.forEach((item) => {
            item.meanPrice *= 1 + this.inflationRate;  
        });
    }

    randomizeCosts(itemList) {
        let updatedList = [];
        itemList.forEach((item) => {
            let stackCost = item.price * item.maxStack;
            let itemListing = {
                item: item,
                meanPrice: Math.ceil(this.randomize(stackCost, .25, .5) / item.maxStack),
                meanQuantity: Math.ceil(this.randomize(item.maxStack, .25, .5))
            }
            updatedList.push(itemListing);
        });
        return updatedList;
    }

    randomize(value, randMin, randMax) {
        let sign = (Math.random() > .5) ? 1 : -1;
        let amount = value * (Math.random() * (randMax - randMin) + randMin);
        return value + sign * amount;
    }
}