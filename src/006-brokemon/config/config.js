import Phaser from 'phaser3';

export default {
    type: Phaser.AUTO,
    width: 740,
    height: 576,
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
