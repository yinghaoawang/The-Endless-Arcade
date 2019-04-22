import Phaser from 'phaser3';

const numberKeysCSV = 'ZERO, ONE, TWO, THREE, FOUR, FIVE, SIX, SEVEN, EIGHT, NINE';
const numberKeysArray = ['ZERO', 'ONE', 'TWO', 'THREE', 'FOUR', 'FIVE', 'SIX', 'SEVEN', 'EIGHT', 'NINE'];

function setKeySchemes(scene) {
    scene.numberScheme = scene.input.keyboard.addKeys(numberKeysCSV);
    scene.backspaceKey = scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.BACKSPACE);
}

function backspaceInputListener(scene) {
    if (Phaser.Input.Keyboard.JustDown(scene.backspaceKey)) {
        return true;
    }
    return false;
}

function numberInputListener(scene) {
    for (let i = 0; i < numberKeysArray.length; ++i) {
        let key = numberKeysArray[i];
        if (Phaser.Input.Keyboard.JustDown(scene.numberScheme[key])) {
            let numberValue = numberKeysArray.indexOf(key);
            console.log(key, numberValue);
            return numberValue;
        }
    }
    return null;
}

export { setKeySchemes, numberInputListener, backspaceInputListener };