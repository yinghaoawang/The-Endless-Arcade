import Phaser from 'phaser3';
import setKeySchemes from '../keyboard/keyboard';
import GameStates from '../GameStates';

export default class GameScene extends Phaser.Scene {
    constructor() {
        super();
    }

    preload() {
        this.load.image('ship', 'assets/sprites/placeholder.png');
    }

    create() {
        this.screenWidth = this.cameras.main.width;
        this.screenHeight = this.cameras.main.height;

        setKeySchemes(this);

        this.paused = false;

        this.bullets = [];
        this.enemies = [];

        this.state = GameStates.PLAYING;
        
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

    listenPlayerMovement(time, delta) {
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

        if (upPressed && !downPressed) this.player.y -= (this.player.speed * delta) / 1000;
        if (downPressed && !upPressed) this.player.y += (this.player.speed * delta) / 1000;

        if (leftPressed && !rightPressed) this.player.x -= (this.player.speed * delta) / 1000;
        if (rightPressed && !leftPressed) this.player.x += (this.player.speed * delta) / 1000;

        if (firePressed)this.player.fire(time, delta);
    }
}
