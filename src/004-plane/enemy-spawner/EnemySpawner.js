import AutoPlane from '../plane/AutoPlane';
import Gun from '../gun/Gun';

export default class EnemySpawner {
    constructor(scene, planeParams, firingSchemeParams, numberOfPlanes, planeSpawnTimeGap, spawnDelay) {
        this.scene = scene;
        numberOfPlanes = numberOfPlanes || 1;
        planeSpawnTimeGap = planeSpawnTimeGap || 0;
        spawnDelay = spawnDelay || 0;
        this.numberOfPlanes = numberOfPlanes;
        this.planeParams = planeParams;
        this.spawnTimes = [];
        this.firingSchemeParams = firingSchemeParams;
        for (let i = 0; i < numberOfPlanes; ++i) {
            this.spawnTimes.push(this.scene.time.now + spawnDelay + i * planeSpawnTimeGap);
        }
        this.currentPlaneIndex = 0;
    }

    update(time, delta) {
        for (let i = 0 ; i < this.spawnTimes.length; ++i) {
            let spawnTime = this.spawnTimes[i];
            if (time >= spawnTime) {
                this.spawnPlane();
                this.currentPlaneIndex++
                this.spawnTimes.splice(i, 1);
                --i;
            }
        };
    }

    spawnPlane() {
        let x = this.planeParams.x || 0;
        let y = this.planeParams.y || 0;
        let width = this.planeParams.width || 18;
        let height = this.planeParams.height || 18;
        let texture = this.planeParams.texture || 'plane2';
        let speed = (typeof this.planeParams.speed != 'undefined') ? this.planeParams.speed : 100;
        let moveFn = this.planeParams.moveFn || (() => { return { x: 0, y: 1 };});;
        let fireChance = this.planeParams.fireChance || .25;
        let targetPlayer = this.planeParams.targetPlayer || false;
        let maxHealth = this.planeParams.maxHealth || 1;
        let damage = this.planeParams.damage || 1;
        console.log(this.planeParams.damage);
        
        let gun = null;
        if (this.firingSchemeParams != null) {
            let firingScheme = {
                damage: this.firingSchemeParams.damage || 1,
                fireRate: this.firingSchemeParams.fireRate || .5,
                speed: this.firingSchemeParams.speed || 125,
                texture: this.firingSchemeParams.texture || 'tiny-bullet',
                targetPlayer: this.firingSchemeParams.targetPlayer || false,
                
                bullets: this.firingSchemeParams.bullets || [{ direction: 0 }],
            };
            gun = new Gun([ firingScheme ]);
        };

        let enemyPlane = new AutoPlane(this.scene, x, y, width, height, texture, speed, maxHealth, damage, moveFn, gun, fireChance, targetPlayer);
        enemyPlane.index = this.currentPlaneIndex;
        enemyPlane.totalIndex = this.numberOfPlanes;
        

        this.scene.enemies.push(enemyPlane);
        this.scene.add.existing(enemyPlane);
    }

}
