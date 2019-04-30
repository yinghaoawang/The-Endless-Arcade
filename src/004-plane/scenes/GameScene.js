import Phaser from 'phaser3';
import PlayerPlane from '../plane/PlayerPlane';
import setKeySchemes from '../keyboard/keyboard';
import GameStates from '../GameStates';
import Gun from '../plane/Gun';
import Plane from '../plane/Plane';
import Bullet from '../plane/Bullet';
import AutoPlane from '../plane/AutoPlane';

export default class GameScene extends Phaser.Scene {
    constructor() {
        super();
    }

    preload() {
        this.load.audio('bg-music', 'assets/sounds/background-music.wav')
        this.load.audio('shoot', 'assets/sounds/shoot.wav');
        this.load.audio('ship-die', 'assets/sounds/ship-die.wav');
        this.load.audio('enemy-shoot', 'assets/sounds/enemy-shoot.wav');
        this.load.audio('take-damage', 'assets/sounds/take-damage.wav');
        this.load.image('plane', 'assets/sprites/plane.png');
        this.load.image('plane2', 'assets/sprites/plane2.png');
        this.load.image('bullet', 'assets/sprites/bullet.png');
        this.load.image('circle-bullet', 'assets/sprites/circle-bullet.png');
        this.load.image('tiny-bullet', 'assets/sprites/tiny-bullet.png');
        this.load.image('parallax-bg', 'assets/sprites/parallax-background.png');
        this.load.spritesheet('explosion', 'assets/sprites/explosion.png', { frameWidth: 64, frameHeight: 64 }
    );
    }

    create() {
        
        let explodeAnimConfig = {
            key: 'explode',
            frames: this.anims.generateFrameNumbers('explosion'),
            frameRate: 30
        };
        this.anims.create(explodeAnimConfig);

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
        this.enemyDestructableBulletCollCat = this.matter.world.nextCategory();

        this.matter.world.on('collisionstart', (event) => {
            event.pairs.forEach(pairs => {
                pairs.isActive = false;
                // that we have the top level body instead of a part of a larger compound body.
                var bodyA = pairs.bodyA;
                var bodyB = pairs.bodyB;

                let bullet = null;
                let other = null;
                if (bodyA.gameObject instanceof Bullet) {
                    bullet = bodyA.gameObject;
                    other = bodyB.gameObject;
                } else if (bodyB.gameObject instanceof Bullet) {
                    bullet = bodyB.gameObject;
                    other = bodyA.gameObject;
                }

                if (bullet != null) {
                    if (other) {
                        other.health -= bullet.damage;
                        if (other instanceof PlayerPlane) this.sound.play('take-damage', { volume: .3, });
                    }
                    
                    this.createExplosion(bullet.x, bullet.y, 16, 16);
                    this.destroyObject(bullet);
                    
                    if (other && other.health <= 0) {
                        this.createExplosion(other.x, other.y, other.displayWidth * 2, other.displayHeight * 2);
                        this.destroyObject(other);
                        this.sound.play('ship-die', { volume: .4 });
                    }
                } else {
                    let player = null;
                    if (bodyA.gameObject instanceof PlayerPlane) {
                        player = bodyA.gameObject;
                        other = bodyB.gameObject;
                    } else if (bodyB.gameObject instanceof PlayerPlane) {
                        player = bodyB.gameObject;
                        other = bodyA.gameObject;
                    }

                    if (player != null) {
                        this.createExplosion(other.x, other.y, other.displayWidth * 2, other.displayHeight * 2);
                        this.destroyObject(other);
                        this.sound.play('take-damage', { volume: .3, });
                        
                        
                        player.health--;
                        if (player.health <= 0) {
                            this.createExplosion(player.x, player.y, player.displayWidth * 2, player.displayHeight * 2);
                            this.destroyObject(player);
                            
                        }
                    }
                }
                /*
                if ((bodyA.label === 'ball' && bodyB.label === 'dangerousTile') ||
                    (bodyB.label === 'ball' && bodyA.label === 'dangerousTile')) {
                    const ballBody = bodyA.label === 'ball' ? bodyA : bodyB;
                    const ball = ballBody.gameObject;
    
                    // A body may collide with multiple other bodies in a step, so we'll use a flag to
                    // only tween & destroy the ball once.
                    if (ball.isBeingDestroyed) {
                        continue;
                    }
                    ball.isBeingDestroyed = true;
    
                    this.matter.world.remove(ballBody);
                    
                }
                */
            });

            
        });

        this.parallaxBg1 = new Phaser.GameObjects.Image(this, 0, 0, 'parallax-bg');
        this.parallaxBg1.setDisplaySize(this.screenWidth, this.screenHeight);
        this.parallaxBg1.setOrigin(0);
        this.parallaxBg2 = new Phaser.GameObjects.Image(this, 0, -this.screenHeight, 'parallax-bg');
        this.parallaxBg2.setDisplaySize(this.screenWidth, this.screenHeight);
        this.parallaxBg2.setOrigin(0);

        this.add.existing(this.parallaxBg1);
        this.add.existing(this.parallaxBg2);

        this.scoreText = new Phaser.GameObjects.Text(this, 10, 10, ' ', {
            color: '#ffffff',
        });
        this.add.existing(this.scoreText);

        this.healthText = new Phaser.GameObjects.Text(this, 10, 10 + this.scoreText.height + 5, ' ', {
            color: '#ffffff',
        });
        this.add.existing(this.healthText);
        
    }

    get score() {
        return this._score;
    }

    set score(value) {
        this._score = value;
        if (typeof this.scoreText != 'undefined') this.scoreText.setText('Score: ' + value);
    }

    createExplosion(x, y, width, height) {
        let explosion = new Phaser.GameObjects.Sprite(this, x, y, 'explosion');
        explosion.setDisplaySize(width, height);
        
        explosion.anims.load('explode');
        explosion.anims.play('explode');
        explosion.once('animationcomplete', (anim, frame) => {
            this.destroyObject(explosion);
        });
        this.add.existing(explosion);
    }

    destroyObject(object) {
        if (object.beingDestroyed) return;
        if (object instanceof Bullet) {
            this.bullets.splice(this.bullets.indexOf(object), 1);
        }
        if (object instanceof AutoPlane) {
            this.enemies.splice(this.enemies.indexOf(object), 1);
            this.score += 50;
        }
        object.destroy();
        object.beingDestroyed = true;
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

    updateHealthText() {
        this.healthText.setText('Health: ' + this.player.health);
    }

    initPlaying() {
        this.sound.play('bg-music', {
            volume: .1,
            loop: true,
        });
        this.score = 0;
        this.player = new PlayerPlane(this, this.screenWidth / 2, this.screenHeight - 32, 32, 32, 'plane', 250);
        this.player.propertyChangeListeners.push(this.updateHealthText.bind(this));
        this.updateHealthText();

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
                let autoPlane = new AutoPlane(this, 0, 100, 18, 18, 'plane2', 200, new Gun([{damage: 1, fireRate: 1.5, speed: 100, texture: 'tiny-bullet', bullets: [{}]}]), function (t, gameObject) {
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
                this.spawnList.push({
                    target: autoPlane,
                    time: 500 + time + i * 250,
                });
            }
        }

        this.spawnSnake(this.time.now);
        this.uTurn(this.time.now);
        this.spawnHitNRun(this.time.now);

        this.spawnPatterns = [this.spawnSnake, this.uTurn, this.spawnHitNRun];
        this.lastSpawned = this.time.now;
        this.spawnRate = 1;

        this.add.existing(this.player);
        
    }
    

    updatePlaying(time, delta) {
        // TODO not this v
        if (!this.player) this.initPlaying();
        
        if (this.player && !this.player.beingDestroyed) this.listenPlayerMovement(time, delta);
        this.updateEnemies(time, delta);
        this.updateBullets(time, delta);

        this.updateSpawn(time, delta);
        this.updateParallax(time, delta);
    }
    updateParallax(time, delta) {
        this.parallaxBg1.y++;
        this.parallaxBg2.y++;
        if (this.parallaxBg1.y > this.screenHeight) {
            this.parallaxBg1.y -= this.screenHeight * 2;
        }
        if (this.parallaxBg2.y > this.screenHeight) {
            this.parallaxBg2.y -= this.screenHeight * 2;
        }
    }

    updateSpawn(time, delta) {
        if (time > this.lastSpawned + 1000 / this.spawnRate) {
            this.spawnPatterns[~~(Math.random() * this.spawnPatterns.length)](time);
            this.lastSpawned = time;
        }

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

        if (upPressed && !downPressed) this.player.y -= (this.player.speed * delta) / 1000;
        if (downPressed && !upPressed) this.player.y += (this.player.speed * delta) / 1000;

        if (leftPressed && !rightPressed) this.player.x -= (this.player.speed * delta) / 1000;
        if (rightPressed && !leftPressed) this.player.x += (this.player.speed * delta) / 1000;

        if (firePressed)this.player.fire(time, delta);
    }
}
