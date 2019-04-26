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
            let initialRandMin = .25;
            let initialRandMax = .5;
            let itemListing = {
                item: item,
                meanPrice: Math.ceil((stackCost * (Math.random() * (initialRandMax - initialRandMin) + initialRandMin)) / item.maxStack),
                meanQuantity: Math.ceil(item.maxStack * (Math.random() * (initialRandMax - initialRandMin) + initialRandMin)),
            }
            updatedList.push(itemListing);
        });
        return updatedList;
    }
}