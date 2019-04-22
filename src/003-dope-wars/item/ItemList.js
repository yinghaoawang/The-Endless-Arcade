import Item from './Item';
import messageHandler from '../MessageHandler';

export let ItemList = [
    new Item('Sword'),
    new Item('Shield'),
    new Item('Arrow', 100),
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