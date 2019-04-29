import Phaser from 'phaser3';
import PlayerPlane from '../plane/PlayerPlane';
import setKeySchemes from '../keyboard/keyboard';
import GameStates from '../GameStates';
import Gun from '../plane/Gun';
import AutoPlane from '../plane/AutoPlane';

export default class GameScene extends Phaser.Scene {
    constructor() {
        super();
    }

    preload() {
        this.load.image('plane', 'assets/sprites/plane.png');
        this.load.image('plane2', 'assets/sprites/plane2.png');
        this.load.image('bullet', 'assets/sprites/bullet.png');
        this.load.image('circle-bullet', 'assets/sprites/circle-bullet.png');
        this.load.image('tiny-bullet', 'assets/sprites/tiny-bullet.png');
    }

    create() {
        this.screenWidth = this.cameras.main.width;
        this.screenHeight = this.cameras.main.height;

        setKeySchemes(this);

        this.paused = false;

        this.bullets = [];
        this.enemies = [];
        this.spawnList = [];

        this.state = GameStates.PLAYING;

        this.allyBulletCollCat = this.matter.world.nextCategory();
        this.allyCollCat = this.matter.world.nextCategory();
        this.enemyCollCat = this.matter.world.nextCategory();
        this.enemyBulletCollCat = this.matter.world.nextCategory();
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
        this.plane = new PlayerPlane(this, this.screenWidth / 2, this.screenHeight - 32, 32, 32, 'plane', 250);

        this.uTurn = (time) => {
            let screenHeight = this.screenHeight;
            let flipped = false;
            let autoPlane = new AutoPlane(this, 150, 0, 18, 18, 'plane2', 130, null, (t, gameObject) => {
                let x = gameObject.x;
                let y = gameObject.y;
                if (!flipped && y < screenHeight * .75) {
                    return {
                        x: 0,
                        y: 1
                    }
                } else {
                    if (!flipped) {
                        gameObject.rotation += Math.PI;
                        flipped = true;
                    }
                    return {
                        x: 0,
                        y: -1
                    }
                }
                
            });
            this.spawnList.push({
                target: autoPlane,
                time: time,
            });
        }

        this.uTurn(this.time.now);

        this.spawnSnake = (time) => {
            for (let i = 0; i < 10; ++i) {
                let autoPlane = new AutoPlane(this, 135, 0, 18, 18, 'plane2', 80, null, (t) => {
                    return {
                        x: 2 * Math.sin(2.5 * t),
                        y: 1,
                    }
                });
                this.spawnList.push({
                    target: autoPlane,
                    time: time + i * 500,
                });
            }
        }

        this.spawnHitNRun = (time) => {
            for (let i = 0; i < 3; ++i) {
                let screenWidth = this.screenWidth;
                let timeSinceStop = 0;
                let lastTime = 0;
                let originalFireRate;
                let autoPlane = new AutoPlane(this, 0, 100, 18, 18, 'plane2', 200, new Gun([{fireRate: 1.5, speed: 100, texture: 'tiny-bullet', bullets: [{}]}]), function (t, gameObject) {
                    let x = gameObject.x;
                    let y = gameObject.y;
                    
                    if (typeof originalFireRate == 'undefined') originalFireRate = gameObject.fireRate;
                    if (x <= (screenWidth / 2) + 30 - 30 * i) {
                        gameObject.fireRate = 0;
                        return {
                            x: 1,
                            y: 0
                        }
                    } else {
                        timeSinceStop += (t - lastTime);
                        lastTime = t;

                        if (timeSinceStop < 3) {
                            gameObject.fireRate = originalFireRate;
                            return {
                                x: 0,
                                y: 0
                            }
                        } else {
                            gameObject.fireRate = 0;
                            return {
                                x: 1,
                                y: 0
                            }
                        }
                        
                    }
                    
                });
                console.log(autoPlane.body);
                //autoPlane.body.checkCollision.none = true;
                this.spawnList.push({
                    target: autoPlane,
                    time: 500 + time + i * 250,
                });
            }
        }

        this.spawnSnake(this.time.now);
    
        this.spawnHitNRun(this.time.now);

        this.add.existing(this.plane);
        
    }
    

    updatePlaying(time, delta) {
        // TODO not this v
        if (typeof this.plane == 'undefined') this.initPlaying();
        
        this.listenPlayerMovement(time, delta);
        this.updateEnemies(time, delta);
        this.updateBullets(time, delta);

        this.updateSpawn(time, delta);
    }

    updateSpawn(time, delta) {
        for (let i = 0 ; i < this.spawnList.length; ++i) {
            let instructions = this.spawnList[i];
            if (time >= instructions.time) {
                this.enemies.push(instructions.target);
                this.add.existing(instructions.target);
                this.spawnList.splice(i, 1);
                --i;
            }
        };
    }

    updateEnemies(time, delta) {
        this.enemies.forEach(enemy => {
            enemy.update(time, delta);
        });
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
