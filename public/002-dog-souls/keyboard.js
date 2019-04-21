function userNameInputCheck(scene) {
    let enterPressed = false;
    let backspacePressed = false;
    let keyPressed;
    for (let i = 0; i < userNameCharArray.length; ++i) {
        let key = userNameCharArray[i];
        if (Phaser.Input.Keyboard.JustDown(scene.userNameScheme[key])) {
            keyPressed = key;
        }
    }
    if (Phaser.Input.Keyboard.JustDown(scene.userNameScheme.enter)) enterPressed = true;
    if (Phaser.Input.Keyboard.JustDown(scene.userNameScheme.backspace)) backspacePressed = true;

    if (enterPressed) {
        tryPostScore(scene);
        toMainMenu(scene);
    } else if (backspacePressed) {
        if (scene.userName.length > 0) {
            scene.userName = scene.userName.substring(0, scene.userName.length - 1);
        }
    } else if (typeof keyPressed != 'undefined') {
        if (scene.userName.length < scene.maxNameLength) {
            scene.userName += keyPressed;
        }
    }
}

function setKeySchemes(scene) {
    scene.wasd = {
        up: scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W),
        down: scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S),
        left: scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A),
        right: scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D),
        slow: scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SHIFT),
        start: scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE)
    }
    scene.cursors = scene.input.keyboard.createCursorKeys();
    scene.cursors.slow = scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
    scene.cursors.start = scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
    scene.keySchemes = [scene.cursors, scene.wasd];

    scene.userNameScheme = scene.input.keyboard.addKeys(userNameCharCSV);
    scene.userNameScheme.backspace = scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.BACKSPACE);
    scene.userNameScheme.enter = scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ENTER);
}

function startGameCheck(scene) {
    let startPressed = false;
    for (let i = 0; i < scene.keySchemes.length; ++i) {
        let scheme = scene.keySchemes[i];
        if (Phaser.Input.Keyboard.JustDown(scheme.start)) {
            startPressed = true;
        }
    }
    if (startPressed) {
        toPlayGame(scene);
    }
}

function keyboardCheck(scene) {
    let upPressed = false;
    let downPressed = false;
    let leftPressed = false;
    let rightPressed = false;
    let slowPressed = false;
    for (let i = 0; i < scene.keySchemes.length; ++i) {
        let scheme = scene.keySchemes[i];
        if (Phaser.Input.Keyboard.JustDown(scheme.up)) {
            upPressed = true;
        }
        if (Phaser.Input.Keyboard.JustDown(scheme.down)) {
            downPressed = true;
        }
        if (Phaser.Input.Keyboard.JustDown(scheme.left)) {
            leftPressed = true;
        }
        if (Phaser.Input.Keyboard.JustDown(scheme.right)) {
            rightPressed = true;
        }
        if (scheme.slow.isDown) {
            slowPressed = true;
        }
    }

    if (slowPressed) {
        if (scene.doggo.canMove) {
            scene.doggo.moveCoolDown = 400;
        }
    } else {
        if (scene.doggo.canMove) {
            scene.doggo.moveCoolDown = 200;
        }
    }

    if (upPressed && !downPressed) {
        scene.doggo.moveUp();
    } else if (downPressed && !upPressed) {
        scene.doggo.moveDown();
    } else if (leftPressed && !rightPressed) {
        scene.doggo.moveLeft();
    } else if (rightPressed && !leftPressed) {
        scene.doggo.moveRight();
    }
}