import Phaser from 'phaser3';

export let config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    pixelArt: true,
    physics: {
        default: 'arcade',
        arcade: {
            debug: false,
        }
    },
    scene: {
        preload: 'preload',
        create: 'create',
        update: 'update'
    }
};
