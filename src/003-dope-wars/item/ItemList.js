import Item from './Item';
import messageHandler from '../MessageHandler';

export let ItemList = [
    new Item('Sword', 1000, 5),
    new Item('Shield', 800, 5),
    new Item('Bow', 1200, 5),
    new Item('Arrow', 15, 100),
    new Item('Crossbow', 2500, 3),
    new Item('Pike', 1500, 5),
];

export function getItemByName(name) {
    for (let i = 0; i < ItemList.length; ++i) {
        let item = ItemList[i];
        if (item.name.toLowerCase() == name.toLowerCase()) return item;
    }
    messageHandler.printError('There exists no item with name \'' + name + '\'.');
    return null;
}

export default ItemList;