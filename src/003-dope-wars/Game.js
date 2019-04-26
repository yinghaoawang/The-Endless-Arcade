import Player from './unit/Player';
import Economy from './Economy';
import ItemList from './item/ItemList';
import City from './City';

export default class Game {
    constructor() {
        this.player = new Player('Jonah');
        this.player.addItem('arrow', 112);
        this.player.addItem('arrow', 2);
        this.player.addItem('sword', 2);
        this.player.addItem('shield', 1);
        this.player.addItem('bow', 1);
        this.economy = new Economy(ItemList);
        this.cities = this.createCities(this.economy, 5);
        this.day = 1;
    }

    createCities(economy, cityCount) {
        let cities = [];
        for (let i = 0; i < cityCount; ++i) {
            let city = new City(economy, 'City ' + Math.random() * 100);
            cities.push(city);
        }
        return cities;
    }
}