import Phaser from 'phaser3';

export default {
    type: Phaser.AUTO,
    width: 960,
    height: 640,
    pixelArt: true,
    audio: {
        disableWebAudio: true
    },
    physics: {
        default: 'arcade',
        arcade: {
            debug: true,
        }
    },
};
