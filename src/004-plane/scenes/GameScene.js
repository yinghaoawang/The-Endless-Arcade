import Phaser from 'phaser3';
import Plane from '../plane/Plane';
import setKeySchemes from '../keyboard/keyboard';
import GameStates from '../GameStates';

export default class GameScene extends Phaser.Scene {
    constructor() {
        super();
    }

    preload() {
        //this.load.audio('message', 'assets/sounds/message.wav');
        this.load.image('plane', 'assets/sprites/plane.png');
        this.load.image('bullet', 'assets/sprites/bullet.png');
        this.load.image('circle-bullet', 'assets/sprites/circle-bullet.png');
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

    initPlaying() {
        this.plane = new Plane(this, this.screenWidth / 2, this.screenHeight - 32, 32, 32, 'plane', 250);
        this.plane.rotation -= Math.PI / 2;
        this.add.existing(this.plane);
    }

    updatePlaying(time, delta) {
        // TODO not this v
        if (typeof this.plane == 'undefined') this.initPlaying();
        

        this.listenPlayerMovement(time, delta);
        this.updateBullets(time, delta);
    }

    updateBullets(time, delta) {
        this.bullets.forEach(bullet => {
            bullet.update(time, delta);
            if (this.outOfBounds(bullet)) {
                this.bullets.splice(this.bullets.indexOf(bullet), 1);
                bullet.destroy();
            }
        });
    }

    outOfBounds(object) {
        return object.x > this.screenWidth ||
            object.x < 0 || object.y < 0 ||
            object. y > this.screenHeight;
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
        if (upPressed && !downPressed) this.plane.y -= (this.plane.speed * delta) / 1000;
        if (downPressed && !upPressed) this.plane.y += (this.plane.speed * delta) / 1000;

        if (leftPressed && !rightPressed) this.plane.x -= (this.plane.speed * delta) / 1000;
        if (rightPressed && !leftPressed) this.plane.x += (this.plane.speed * delta) / 1000;

        if (firePressed)this.plane.fire(time, delta);
    }
}
