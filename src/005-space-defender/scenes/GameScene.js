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
        this.load.image('player-ship', 'assets/sprites/placeholder.png');
        this.load.image('alien-ship', 'assets/sprites/placeholder.png');
    }

    create() {
        this.screenWidth = this.cameras.main.width;
        this.screenHeight = this.cameras.main.height;

        setKeySchemes(this);

        this.paused = false;

        this.bullets = [];
        this.enemies = [];

        this.changeState(GameStates.PLAYING);
        
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
    }

    changeState(state) {
        if (state == GameStates.PLAYING) {
            //this.cameras.main.setScroll(0);
            this.player = new PlayerShip(this, 0, this.screenHeight / 2, 16, 16);
            let alienShip = new AlienShip(this, 200, 200, 'alien-ship', 12, 12, 10);
            this.enemies.push(alienShip);
        }

        this.state = state;
    }

    listenPlayerMovement(time, delta) {
        console.log(this.player.x, this.player.y);
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

        /*
        if (upPressed && !downPressed) {
            this.player.velocity.y = -1 * this.player.verticalSpeed;
        } else if (downPressed && !upPressed) {
            this.player.velocity.y = this.player.verticalSpeed;
        } else {
            this.player.velocity.y = 0;
        }
        */

        if (leftPressed && !rightPressed) this.player.velocity.x -= (this.player.acceleration * delta) / 100;
        if (rightPressed && !leftPressed) this.player.velocity.x += (this.player.acceleration * delta) / 100;
        if (upPressed && !downPressed) this.player.velocity.y -= (this.player.acceleration * delta) / 100;
        if (downPressed && !upPressed) this.player.velocity.y += (this.player.acceleration * delta) / 100;

        if (firePressed)this.player.fire(time, delta);
    }
}
