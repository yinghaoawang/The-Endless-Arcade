export default class Gun {
    constructor(damage, fireRate, bulletSpeed, bulletTexture) {
        this.damage = damage;
        this.fireRate = fireRate;
        this.bulletTexture = bulletTexture;
        this.bulletSpeed = bulletSpeed;
        this.patterns = [
            {
                rotation: 0,
            },
            {
                rotation: -Math.PI / 12,
                function: {
                    x: (t) => { return 10 * Math.cos(t); },
                    y: (t) => { return 10 * Math.sin(t); }
                }
            },
            {
                rotation: Math.PI / 12,
                function: {
                    x: (t) => { return 10 * Math.cos(t); },
                    y: (t) => { return 10 * Math.sin(t); }
                }
            }    
        ];
    }
}