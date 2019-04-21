class PlayingMenu {
    constructor(scene) {
        this.scene = scene;
        this.livesText = scene.add.text(10, 30, 'Lives: ');
        this.scoreText = scene.add.text(10, 10, 'Score: ');
        this.livesText.setOrigin(0, 0);
        this.scoreText.setOrigin(0, 0);
        this.livesText.setAlign('left');
        this.scoreText.setAlign('left');
        this.bigNG = scene.add.text(scene.screenWidth / 2, scene.screenHeight / 2);
        this.bigNG.setVisible(false);
        this.bigNG.depth = 1000;
        this.bigNG.setStyle({
            fontSize: '80px'
        });
        this.bigNG.setOrigin(.5);

        this.levelText = scene.add.text(scene.screenWidth - 10, 10, 'Level: ');
        this.ngText = scene.add.text(scene.screenWidth - 10, 30, 'NG: ');
        this.levelText.setOrigin(1, 0);
        this.ngText.setOrigin(1, 0);
        this.levelText.setAlign('right');
        this.ngText.setAlign('right');

        this.hide();
    }
    ngFade() {
        this.bigNG.setText('NG ' + this.scene.ng);
        this.bigNG.setVisible(true);
        this.scene.tweens.add({
            scrollY: 0,
            targets: this.ngText,
            ease: 'Linear',
            duration: 4000,
            onComplete: function() {
                this.bigNG.setVisible(false);
            }.bind(this)
        });
    }
    update() {
        this.livesText.setText('Lives: ' + this.scene.lives);
        this.scoreText.setText('Score: ' + this.scene.score);
        this.levelText.setText('Level: ' + this.scene.level);
        if (this.scene.ng > 0) {
            this.ngText.setText('NG: ' + this.scene.ng);
        } else {
            this.ngText.setText('');
        }
    }
    show() {
        this.livesText.setVisible(true);
        this.scoreText.setVisible(true);
        this.levelText.setVisible(true);
        this.ngText.setVisible(true);
    }
    hide() {
        this.livesText.setVisible(false);
        this.scoreText.setVisible(false);
        this.levelText.setVisible(false);
        this.ngText.setVisible(false);
    }
}