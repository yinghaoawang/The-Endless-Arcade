import Phaser from 'phaser3';

export default {
    type: Phaser.AUTO,
    width: 1000,
    height: 600,
    pixelArt: true,
    audio: {
        disableWebAudio: true
    },
    physics: {
        default: 'arcade',
        arcade: {
            debug: false,
        }
    },
};
