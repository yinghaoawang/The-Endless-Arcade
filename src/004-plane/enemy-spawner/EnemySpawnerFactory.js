import EnemySpawner from './EnemySpawner.js'

export default class EnemySpawnerFactory {
    constructor(scene) {
        this.scene = scene;
        this.spawnQueue = [];

        this.snakeParams = {
            moveFn: (t) => {
                return {
                    x: 2 * Math.sin(2.5 * t),
                    y: 1,
                }
            },
        }
    
        this.uTurnParams = {
            speed: 200,
            moveFn: function fn(t, gameObject) {
                if (typeof fn.flipped == 'undefined') fn.flipped = [];
                if (typeof fn.flipped[gameObject.index] == 'undefined') fn.flipped[gameObject.index] = false;
                let x = gameObject.x;
                let y = gameObject.y;
                if (!fn.flipped[gameObject.index] && y < scene.screenHeight * .75) {
                    return {
                        x: 0,
                        y: 1
                    }
                } else {
                    if (!fn.flipped[gameObject.index]) {
                        gameObject.rotation += Math.PI;
                        fn.flipped[gameObject.index] = true;
                    }
                    return {
                        x: 0,
                        y: -1
                    }
                }
            }.bind(scene),
        }
    
        this.hitAndRunParams = {
            speed: 200,
            moveFn: function fn(t, gameObject) {
                let x = gameObject.x;
                let screenWidth = scene.screenWidth;
                let i = (typeof gameObject.index != 'undefined') ? gameObject.index : 1;
                let iLen = (typeof gameObject.totalIndex != 'undefined') ? gameObject.totalIndex : 1;
                
                if (typeof gameObject.timeSinceStop == 'undefined') gameObject.timeSinceStop = 0;
                if (typeof gameObject.originalFireRate == 'undefined') gameObject.originalFireRate = gameObject.fireRate;
                if (x <= (screenWidth / 2) + (iLen - 1 - i) * gameObject.width * 1.2 - ((1.2 * gameObject.width ) * ((iLen - 1) / 2)))  {
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
            }.bind(scene)
        };
    }

    spawn(key, delay, xOffset, yOffset) {
        let spawner = null;
        switch (key) {
            case 'default':
                spawner = new EnemySpawner(this.scene, { }, null, 5, 500, delay);
                break
            case 'hitNRun':
                spawner = new EnemySpawner(this.scene, this.hitAndRunParams, { fireRate: 2 }, 5, 500, delay);
                break;
            case 'snake':
                spawner = new EnemySpawner(this.scene, this.snakeParams, null, 9, 400, delay);
                break;
            case 'uTurn':
                spawner = new EnemySpawner(this.scene, this.uTurnParams, null, 3, 500, delay);
                break;
            
            default:
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
