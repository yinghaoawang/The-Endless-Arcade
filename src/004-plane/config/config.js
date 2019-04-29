import Phaser from 'phaser3';

export default {
    type: Phaser.AUTO,
    width: 400,
    height: 700,
    pixelArt: true,
    audio: {
        disableWebAudio: true
    },
    physics: {
        default: 'matter',
        matter: {
            debug: true,
            gravity: {
                x: 0,
                y: 0
            }
        }
    },
};
