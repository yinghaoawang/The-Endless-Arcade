export default function setKeySchemes(scene) {
    scene.wasdKeys = {
        up: scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W),
        down: scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S),
        left: scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A),
        right: scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D),
        fire: scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.PERIOD)
    }
    scene.cursorKeys = scene.input.keyboard.createCursorKeys();
    scene.cursorKeys.fire = scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);

    scene.movementSchemes = [scene.cursorKeys, scene.wasdKeys];
}

export { setKeySchemes };