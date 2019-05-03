import Phaser from 'phaser3';
import setKeySchemes from '../keyboard/keyboard';
import GameStates from '../GameStates';
import PlayerShip from '../ship/PlayerShip';
import AlienShip from '../ship/AlienShip';

export default class GameScene extends Phaser.Scene {
    constructor() {
        super();
    }

    preload() {
        this.load.image('game-bg', 'assets/sprites/game-bg.png');
        this.load.image('player-ship', 'assets/sprites/placeholder.png');
        this.load.image('alien-ship', 'assets/sprites/placeholder.png');
        this.load.image('alien-bullet', 'assets/sprites/placeholder.png');
        this.load.image('player-beam', 'assets/sprites/placeholder.png');
    }

    create() {
        this.screenWidth = this.cameras.main.width;
        this.screenHeight = this.cameras.main.height;

        this.worldWidth = this.screenWidth * 3;
        this.worldHeight = this.screenHeight

        setKeySchemes(this);

        this.paused = false;

        this.bullets = [];
        this.enemies = [];

        this.cameraScrollSpeed = 100;
        this.cameras.main.setBounds(0, 0, this.worldWidth, this.worldHeight);
        let minimapArea = {
            width: 1.5 * this.screenWidth / 4,
            height: this.screenHeight / 4,
            y: 0,
            x: this.screenWidth / 2 - (1.5 * this.screenWidth / 4) / 2,
        }
        
        this.minimap = this.cameras.add(minimapArea.x, minimapArea.y, minimapArea.width, minimapArea.height);
        this.minimap.setZoom(.25).setName('minimap').setAlpha(.5);
        this.minimap.setBounds(0, 0, this.worldWidth, this.worldHeight);

        for (let i = 0; i < Math.ceil(this.worldWidth / this.screenWidth); ++i) {
            let gameBG = this.add.image(i * this.screenWidth, 0, 'game-bg').setOrigin(0).setTint('0xff0000');
            gameBG.setDisplaySize(this.screenWidth, this.screenHeight);
        }
        
        this.physics.world.setBounds(0, 0, this.worldWidth, this.worldHeight);

        this._score = 0;
        this._level = 1;
        this.scoreText = new Phaser.GameObjects.Text(this, 75, 10, ' DFAFDS', { color: '#ffffff', fontFamily: 'VT323'}).setOrigin(1, 0).setAlign('right').setScrollFactor(0);
        this.levelText = new Phaser.GameObjects.Text(this, 75, 28, 'ASDFASDF ', { fontFamily: 'VT323'}).setOrigin(1, 0).setAlign('right').setScrollFactor(0);
        this.add.existing(this.scoreText);
        this.add.existing(this.levelText);
        this.minimap.ignore(this.scoreText);
        this.minimap.ignore(this.levelText);

        this.changeState(GameStates.PLAYING);
    }

    get score() { return this._score; }
    get level() { return this._level; }
    set score(value) {
        this._score = value;
        this.scoreText.setText('Score: ' + value);
    }
    set level(value) {
        this._level = value;
        this.levelText.setText('Wave: ' + value);
    }
  
    update(time, delta) {
        if (this.state == GameStates.MAIN_MENU) {

        } else if (this.state == GameStates.PLAYING) {
            this.updatePlaying(time, delta);
        } else if (this.state == GameStates.GAME_OVER) {

        } else {
            console.error('Invalid game state: ' + this.state);
            return;
        }
    }

    updatePlaying(time, delta) {
        this.listenPlayerMovement(time, delta)
        this.player.update(time, delta);

        for (let i = 0; i < this.enemies.length; ++i) {
            let enemy = this.enemies[i];
            enemy.update(time, delta);
        }

        for (let i = 0; i < this.bullets.length; ++i) {
            let bullet = this.bullets[i];
            bullet.update(time, delta);
        }

        this.physics.world.collide(this.bullets, this.enemies, function (bullet, enemy) {
            if (bullet.owner instanceof PlayerShip) {
                bullet.destroy();
                enemy.destroy();
            }
        });
        this.physics.world.collide(this.bullets, this.player, function (bullet, player) {
            if (bullet.owner instanceof AlienShip) {
                bullet.destroy();
                player.destroy();
            }
        });
        this.physics.world.collide(this.player, this.enemies, function (player, enemy) {
            player.destroy();
            enemy.destroy();
        });

        this.cameras.cameras.forEach(camera => {
            this.targetCameraPosition = {
                x: this.player.x - camera.width / 2,
                y: -this.screenHeight / 2,
            };
    
            if (camera.scrollX < this.targetCameraPosition.x) {
                camera.scrollX += (this.cameraScrollSpeed * delta) / 100;
                if (camera.scrollX > this.targetCameraPosition.x) camera.scrollX  = this.targetCameraPosition.x;
            } else if (camera.scrollX > this.targetCameraPosition.x) {
                camera.scrollX -= (this.cameraScrollSpeed * delta) / 100;
                if (camera.scrollX < this.targetCameraPosition.x) camera.scrollX = this.targetCameraPosition.x;
            }
        });
    }

    changeState(state) {
        if (state == GameStates.PLAYING) {
            this.cameras.main.setScroll(0, 0);
            this.player = new PlayerShip(this, this.worldWidth / 2, this.screenHeight / 2, 16, 16);
            new AlienShip(this, 200, 200, 'alien-ship', 12, 12);
            this.level = 1;
            this.score = 0;
        }

        this.state = state;
    }

    listenPlayerMovement(time, delta) {
        if (!this.player || this.player.beingDestroyed) return;

        let downPressed = false;
        let upPressed = false;
        let leftPressed = false;
        let rightPressed = false;
        let firePressed = false;
        this.movementSchemes.forEach(scheme => {
            if (scheme.down.isDown) downPressed = true;
            if (scheme.up.isDown) upPressed = true;
            if (scheme.left.isDown) leftPressed = true;
            if (scheme.right.isDown) rightPressed = true;
            if (scheme.fire.isDown) firePressed = true;
        })

        if (leftPressed && !rightPressed) {
            this.player.velocity.x -= (this.player.acceleration * delta) / 100;
            this.player.direction = 'left';
        }
        if (rightPressed && !leftPressed) {
            this.player.velocity.x += (this.player.acceleration * delta) / 100;
            this.player.direction = 'right';
        }
        if (upPressed && !downPressed) this.player.velocity.y -= (this.player.acceleration * delta) / 100;
        if (downPressed && !upPressed) this.player.velocity.y += (this.player.acceleration * delta) / 100;

        if (firePressed)this.player.fire(time, delta);
    }
}
