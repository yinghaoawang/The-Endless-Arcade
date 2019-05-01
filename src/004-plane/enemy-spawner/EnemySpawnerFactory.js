import EnemySpawner from './EnemySpawner.js'

export default class EnemySpawnerFactory {
    constructor(scene) {
        this.scene = scene;
        this.spawnQueue = [];

        this.snakeMove = (t) => {
            return {
                x: 2 * Math.sin(2.5 * t),
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

        this.snakeParams = {
            moveFn: this.snakeMove
        }
    
        this.uTurnParams = {
            speed: 200,
            moveFn: this.uTurnMove,
        }

        this.strikeRoundParams = {
            speed: 200, maxHealth: 6,
            texture: 'plane3', width: 36, height: 24,
            fireChance: .75, targetPlayer: true,
            moveFn: this.roundUMove,
        };
    
        this.hitAndRunParams = {
            speed: 200,
            moveFn: this.hitAndRunMove
        };

        this.dartCrashParams = {
            speed: 750, maxHealth: 1,
            texture: 'plane4', width: 27, height: 9,
            moveFn: this.kamikazeMove,
        }
    }

    spawnPremade(key, delay, xOffset, yOffset) {
        let spawner = null;
        switch (key) {
            case 'default':
                spawner = new EnemySpawner(this.scene, { }, null, 5, 500, delay);
                break
            case 'hitNRun':
                spawner = new EnemySpawner(this.scene, Object.assign({}, this.hitAndRunParams), { fireRate: 2 }, 5, 500, delay);
                break;
            case 'snake':
                spawner = new EnemySpawner(this.scene, Object.assign({}, this.snakeParams), null, 9, 400, delay);
                break;
            case 'uTurn':
                spawner = new EnemySpawner(this.scene, Object.assign({}, this.uTurnParams), null, 3, 500, delay);
                break;
            case 'strikerRound':
                spawner = new EnemySpawner(this.scene, Object.assign({}, this.strikeRoundParams), { fireRate: 2 }, 1, null, delay);
                break;
            case 'dartCrash':
                spawner = new EnemySpawner(this.scene, Object.assign({}, this.dartCrashParams), null, 1, null, delay);
                break;

            default:
                console.error('Invalid spawn key: ' + key);
                spawner = null;
                break;
        }
        
        if (spawner != null) {
            if (typeof xOffset != 'undefined') {
                if (typeof spawner.planeParams.x == 'undefined') spawner.planeParams.x = 0;
                spawner.planeParams.x += xOffset;
            }
            if (typeof yOffset != 'undefined') {
                if (typeof spawner.planeParams.y == 'undefined') spawner.planeParams.y = 0;
                spawner.planeParams.y += yOffset;
            }
            this.spawnQueue.push(spawner);
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

    getMoveFunction(key) {
        switch (key) {
            case 'default':
                return null;

            case 'hitNRun':
                return this.hitAndRunMove;

            case 'kamikaze':
                return this.kamikazeMove;

            case 'roundU':
                return this.roundUMove;

            case 'uTurn':
                return this.uTurnMove;

            default:
                console.error('Invalid move function type key: ' + key);
                return null;
        }
    }

    getFiringSchemeParams(key) {
        switch (key) {
            case 'default':
                return null;

            case 'striker':
                return {
                    fireRate: 2
                };

            case 'dart':
                return null;

            default:
                console.error('Invalid firing scheme key: ' + key);
                return null;
        }
    }

    getPlaneParams(key) {
        switch (key) {
            case 'default':
                return {};

            case 'striker':
                return {
                    speed: 200, maxHealth: 6,
                    texture: 'plane3', width: 36, height: 24,
                    fireChance: .75, targetPlayer: true,
                };

            case 'dart':
                return {
                    speed: 750, maxHealth: 1,
                texture: 'plane4', width: 27, height: 9,
                }

            default:
                console.error('Invalid plane type key: ' + key);
                return {};
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
