import EnemySpawner from './EnemySpawner.js'

export default class EnemySpawnerFactory {
    constructor(scene) {
        this.scene = scene;
        this.spawnQueue = [];

        this.snakeMove = (t) => {
            return {
                x: 2 * Math.sin((2.5 * t) - Math.PI / 2),
                y: 1,
            }
        };

        this.uTurnMove = function (t, gameObject) {
            if (typeof gameObject.flipped == 'undefined') gameObject.flipped = false;
            let x = gameObject.x;
            let y = gameObject.y;
            if (!gameObject.flipped && y < scene.screenHeight * .75) {
                return {
                    x: 0,
                    y: 1
                }
            } else {
                if (!gameObject.flipped) {
                    gameObject.rotation += Math.PI;
                    gameObject.flipped = true;
                }
                return {
                    x: 0,
                    y: -1
                }
            }
        }.bind(scene);
        
        this.hitAndRunMove = function (t, gameObject) {
            let x = gameObject.x;
            let screenWidth = scene.screenWidth;
            let i = (typeof gameObject.index != 'undefined') ? gameObject.index : 1;
            let iLen = (typeof gameObject.totalIndex != 'undefined') ? gameObject.totalIndex : 1;
            
            if (typeof gameObject.timeSinceStop == 'undefined') gameObject.timeSinceStop = 0;
            if (typeof gameObject.originalFireRate == 'undefined') gameObject.originalFireRate = gameObject.fireRate;
            if (x <= (screenWidth / 2) + (iLen - 1 - i) * gameObject.width * 2 - ((2 * gameObject.width ) * ((iLen - 1) / 2)))  {
                gameObject.fireRate = 0;
                return {
                    x: 1,
                    y: 0
                }
            } else {
                if (typeof gameObject.lastTime == 'undefined') gameObject.lastTime = t;
                gameObject.timeSinceStop += (t - gameObject.lastTime);
                gameObject.lastTime = t;
                if (gameObject.timeSinceStop < 3) {
                    gameObject.fireRate = gameObject.originalFireRate;
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
        }.bind(scene);
        
        this.roundUMove = function (t, gameObject) {
            let screenWidth = scene.screenWidth;
            let screenHeight = scene.screenHeight;

            if (typeof gameObject.flipped == 'undefined') gameObject.flipped = false;
            if (typeof gameObject.oppositeX == 'undefined') gameObject.oppositeX = screenWidth - gameObject.x;
            let x = gameObject.x;
            let y = gameObject.y;

            if (!gameObject.flipped) {
                if (y < screenHeight * .6) {
                    return {
                        x: 0, y: 1
                    }
                } else {
                    if (x >= gameObject.oppositeX) {
                        gameObject.flipped = true;
                    }
                    gameObject.setRotation(0);
                    return {
                        x: 1, y: 0
                    }
                }
            } else {
                gameObject.setRotation(-1 * Math.PI / 2)
                return {
                    x: 0, y: -1
                }
            }
            
        }

        this.kamikazeMove = (t, gameObject) => {
            if (typeof gameObject.moveTarget == 'undefined') {
                if (scene.player && !scene.player.beingDestroyed) {
                    gameObject.moveTarget = {
                        x: scene.player.x,
                        y: scene.player.y
                    }
                } else {
                    gameObject.moveTarget = {
                        x: scene.screenWidth / 2,
                        y: scene.screenHeight,
                    }
                }
                gameObject.moveDirection = {
                    x: gameObject.moveTarget.x - gameObject.x,
                    y: gameObject.moveTarget.y - gameObject.y,
                };
                let distance = Math.sqrt(gameObject.moveDirection.x * gameObject.moveDirection.x + gameObject.moveDirection.y * gameObject.moveDirection.y);
                gameObject.moveDirection.x /= distance;
                gameObject.moveDirection.y /= distance;
                gameObject.rotation = Math.atan2(gameObject.moveTarget.y - gameObject.y, gameObject.moveTarget.x - gameObject.x);;
            }

            return gameObject.moveDirection;
        }

        this.homingMove = (t, gameObject) => {
            if (scene.player && !scene.player.beingDestroyed) {
                gameObject.moveTarget = scene.player;
            } else {
                gameObject.moveTarget = {
                    x: scene.screenWidth / 2,
                    y: scene.screenHeight,
                }
            }
                
            let targetDirection = {
                x: gameObject.moveTarget.x - gameObject.x,
                y: gameObject.moveTarget.y - gameObject.y,
            };
            gameObject.targetRotation = Math.atan2(targetDirection.y, targetDirection.x);
            
            if (!gameObject.notInitted) {
                gameObject.rotation = gameObject.targetRotation;
                gameObject.notInitted = true;
            }

            let rotationalSpeed = 3 / 1000;
            if ((gameObject.targetRotation < 0 && gameObject.rotation > 0) ||
                (gameObject.targetRotation > 0 && gameObject.rotation < 0)) {
                    gameObject.rotation -= rotationalSpeed;
            } else if (gameObject.targetRotation - gameObject.rotation < 0) {
                gameObject.rotation -= rotationalSpeed;
            } else {
                gameObject.rotation += rotationalSpeed;
            }

            return {
                x: Math.cos(gameObject.rotation),
                y: Math.sin(gameObject.rotation)
            };
        }
    }

    spawnFromParts(planeKey, moveFunctionKey, firingSchemeKey, count, gap, delay, xOffset, yOffset) {
        let planeTypeParams = Object.assign({}, this.getPlaneParams(planeKey));
        let moveFunction = this.getMoveFunction(moveFunctionKey);
        let firingSchemeParams = this.getFiringSchemeParams(firingSchemeKey);
        planeTypeParams.moveFn = moveFunction;
        if (typeof xOffset != 'undefined') {
            if (typeof planeTypeParams.x == 'undefined') planeTypeParams.x = 0;
            planeTypeParams.x += xOffset;
        }
        if (typeof yOffset != 'undefined') {
            if (typeof planeTypeParams.y == 'undefined') planeTypeParams.y = 0;
            planeTypeParams.y += yOffset;
        }
        
        let spawner = new EnemySpawner(this.scene, planeTypeParams, firingSchemeParams, count, gap, delay);
        this.spawnQueue.push(spawner);
    }

    getPlaneParams(key) {
        switch (key) {
            case 'default':
                return {};

            case 'peashooter':
                return {};
            
            case 'peastriker':
                return {
                    speed: 200,
                }

            case 'striker':
                return {
                    speed: 180, maxHealth: 6,
                    texture: 'plane3', width: 36, height: 24,
                    fireChance: .5, targetPlayer: true,
                };

            case 'dart':
                return {
                    speed: 750, maxHealth: 1, damage: 2,
                    texture: 'plane4', width: 27, height: 9,
                }

            case 'homingDart':
                return {
                    speed: 180, maxHealth: 1, damage: 2,
                    texture: 'plane4', width: 27, height: 9,
                }

            case 'blimp':
                return {
                    speed: 65, maxHealth: 50, damage: 5,
                    texture: 'plane5', width: 160, height: 80
                }

            case 'typhoon':
                return {
                    speed: 75, maxHealth: 3, damage: 1,
                    texture: 'plane6', width: 48, height: 24
                }

            case null:
                return {};

            default:
                console.error('Invalid plane type key: ' + key);
                return {};
        }
    }

    getMoveFunction(key) {
        switch (key) {
            case 'default':
                return null;

            case 'snake':
                return this.snakeMove;

            case 'hitNRun':
                return this.hitAndRunMove;

            case 'kamikaze':
                return this.kamikazeMove;

            case 'roundU':
                return this.roundUMove;

            case 'uTurn':
                return this.uTurnMove;
               
            case 'homing':
                return this.homingMove;
                
            
            case null:
                return null;

            default:
                console.error('Invalid move function type key: ' + key);
                return null;
        }
    }

    getFiringSchemeParams(key) {
        switch (key) {
            case 'default':
                return null;

            case 'peashooter':
                return {
                    fireRate: .5
                };

            case 'peastriker':
                return {
                    fireRate: .5,
                    targetPlayer: true
                }

            case 'striker':
                return {
                    fireRate: .5,
                    texture: 'circle-bullet',
                    bullets: [
                        { direction: 0, },
                        { direction: -Math.PI / 10, },
                        { direction: Math.PI / 10, },
                    ]
                };

            case 'typhoon':
                return {
                    fireRate: .25,
                    texture: 'circle-bullet',
                    targetPlayer: true,
                    bulletDelay: 2000,
                    bulletGap: 50,
                    bullets: [{}, {}, {}, {}, {}]
                }

            case 'dart':
                return null;
            
            case null:
                return null

            default:
                console.error('Invalid firing scheme key: ' + key);
                return null;
        }
    }
    
    update(time, delta) {
        for (let i = 0; i < this.spawnQueue.length; ++i) {
            let spawner = this.spawnQueue[i];
            spawner.update(time, delta);
            if (spawner.spawnTimes.length == 0) {
                this.spawnQueue.splice(i--, 1);
            }
        }
    }
}
