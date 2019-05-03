import Bullet from './Bullet';


export default class Gun {
    constructor(firingScheme, level) {
        if (typeof level == 'undefined') level = 1;
        this.firingScheme = firingScheme;
        
        this.level = level;
        this.firingPattern = firingScheme[level - 1];
        
        this.bulletSpawnTimes = [];
        this.useTimedBullets = false;
    }

    get fireRate() {
        return this.firingPattern.fireRate;
    }
    
    nextLevel() {
        if (++this.level > this.firingScheme.length) return;
        this.firingPattern = this.firingScheme[this.level - 1];
    }

    update(gameObject, time, delta) {
        if (!this.useTimedBullets) {
            return;
        }
        let scene = gameObject.scene;
        for (let i = 0; i < this.bulletSpawnTimes; ++i) {

        }
    }

    shoot(scene, x, y, rotation) {
        if (this.firingPattern.bulletDelay > 0 || this.firingPattern.bulletGap > 0) {
            this.useTimedBullets = true;
        }

        if (this.firingPattern.targetPlayer && scene.player && !scene.player.beingDestroyed) {
            let direction = {
                x: scene.player.x - x,
                y: scene.player.y - y,
            };
            this.firingPattern.bullets[0].direction = Math.atan2(direction.y, direction.x) - rotation;
        }

        // TODO HERE
        if (this.useTimedBullets) {
            this.firingPattern.bullets.forEach(bulletPattern => {
                return;
            });
        }
        this.firingPattern.bullets.forEach(bulletPattern => {
            let bulletDirection = 0;
            let bulletDamage = this.firingPattern.damage;
            let bulletSpeed = this.firingPattern.speed;
            let bulletTexture = this.firingPattern.texture;
            let bulletOffset = { x: 0, y: 0 };
            if (typeof bulletPattern.direction != 'undefined') bulletDirection = bulletPattern.direction;
            if (typeof bulletPattern.speed != 'undefined') bulletSpeed = bulletPattern.speed;
            if (typeof bulletPattern.damage != 'undefined') bulletDamage = bulletPattern.damage;
            if (typeof bulletPattern.texture != 'undefined') bulletTexture = bulletPattern.texture;
            if (typeof bulletPattern.offset != 'undefined') {
                if (typeof bulletPattern.offset.x != 'undefined') bulletOffset.x = bulletPattern.offset.x;
                if (typeof bulletPattern.offset.y != 'undefined') bulletOffset.y = bulletPattern.offset.y;
            }

            let rotationPath = rotation + bulletDirection;
            let bullet = new Bullet(scene, x + bulletOffset.x, y + Math.sin(rotation) * (bulletOffset.y), bulletDamage, bulletTexture, bulletSpeed, rotationPath);
            bullet.function = bulletPattern.function;
            scene.bullets.push(bullet);
            scene.add.existing(bullet);
            
            bullet.setCollisionCategory(this.collisionCategory);
            bullet.setCollidesWith(this.collidesWith);
        });
    }
}