export default class Gun {
    constructor(damage, fireRate, bulletSpeed, bulletTexture) {
        this.damage = damage;
        this.fireRate = fireRate;
        this.bulletTexture = bulletTexture;
        this.bulletSpeed = bulletSpeed;
        this.directions = [
            0,
            -Math.PI / 6,
            Math.PI/6
        ];
    }
}