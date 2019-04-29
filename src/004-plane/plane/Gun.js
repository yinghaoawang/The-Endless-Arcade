import Bullet from './Bullet';


export default class Gun {
    constructor(firingScheme, level) {
        if (typeof level == 'undefined') level = 1;
        this.firingScheme = firingScheme;
        
        this.level = level;
        this.firingPattern = firingScheme[level - 1];
    }

    get fireRate() {
        return this.firingPattern.fireRate;
    }
    
    nextLevel() {
        if (++this.level > this.firingScheme.length) return;
        this.firingPattern = this.firingScheme[this.level - 1];
    }

    shoot(scene, x, y, rotation) {
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