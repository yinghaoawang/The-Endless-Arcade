export default class Gun {
    constructor(damage, fireRate, bulletSpeed, bulletTexture) {
        this.damage = damage;
        this.fireRate = fireRate;
        this.bulletTexture = bulletTexture;
        this.bulletSpeed = bulletSpeed;
        this.patterns = [
            {
                direction: 0,
            },
            {
                direction: -Math.PI / 10,
                function: {
                    x: (t) => { return 10 * Math.sin(t); },
                    y: (t) => { return 10 * Math.cos(t); }
                }
            },
            {
                direction: Math.PI / 10,
                function: {
                    x: (t) => { return 10 * Math.sin(t); },
                    y: (t) => { return 10 * Math.cos(t); }
                }
            }    
        ];
    }
}