export default class City {
    constructor(economy, name) {
        this.economy = economy;
        this.name = name;

        this.itemListings = this.createItemListings();
    }

    createItemListings() {
        let itemListings = [];
        let minChance = .15;
        let maxChance = .30;
        this.economy.itemPrices.forEach(itemInfo => {
            let roll = Math.random();
            if (roll >= minChance && roll <= maxChance) {
                let itemListing = {
                    item: itemInfo.item,
                    price: itemInfo.meanPrice,
                    quantity: itemInfo.meanQuantity,
                }
                itemListings.push(itemListing);
            }
        });
        return itemListings;
    }
}