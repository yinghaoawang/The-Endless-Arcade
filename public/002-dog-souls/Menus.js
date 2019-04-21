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

class MainMenu {
    constructor(scene) {
        this.scene = scene;
        this.titleText = scene.add.text(scene.screenWidth * .5, scene.screenHeight * .1, 'DOG SOULS', {
            fontSize: '40px'
        });
        this.titleText.setOrigin(.5, 0);

        this.instructionsText = scene.add.text(scene.screenWidth * .525, scene.screenHeight * .2);
        this.instructionsText.setText(`You are a DOG.\nReach the TOP to win.\nAvoid HORSES.\n\nArrow keys or WASD to move.\nHold SPACE or SHIFT to move slowly.\n\nPress SPACE to begin.`);
        this.instructionsText.setOrigin(.5, 0);
        this.instructionsText.setAlign('left');
        this.instructionsText.setLineSpacing('5');
        this.hide();
    }

    show() {
        this.instructionsText.setVisible(true);
        this.titleText.setVisible(true);
    }
    hide() {
        this.instructionsText.setVisible(false);
        this.titleText.setVisible(false);
    }
}


class HighScoreMenu {
    constructor(scene) {
        this.scene = scene;
        this.highScoreStyle = {
            fontSize: '20px'
        };

        this.gameOverText = scene.add.text(scene.screenWidth * .5, scene.screenHeight * .09, 'High Scores');
        this.gameOverText.setOrigin(.5, 0);
        this.gameOverText.setStyle({ fontSize: '35px' });
        this.gameOverText.depth = -1;

        this.highScoreNameText = scene.add.text(scene.screenWidth * .4, scene.screenHeight * .15);
        this.highScoreNameText.setStyle(this.highScoreStyle);
        this.highScoreNameText.setAlign('right');
        this.highScoreNameText.setOrigin(.5, 0);
        this.highScoreNameText.setLineSpacing(5);

        this.userNameText = scene.add.text(scene.screenWidth * .4, scene.screenHeight * .82);
        this.userNameText.setStyle(this.highScoreStyle);
        this.userNameText.setAlign('right');
        this.userNameText.setOrigin(.5, 0);

        this.highScoreNumberText = scene.add.text(scene.screenWidth * .6, scene.screenHeight * .15);
        this.highScoreNumberText.setStyle(this.highScoreStyle);
        this.highScoreNumberText.setAlign('left');
        this.highScoreNumberText.setOrigin(.5, 0);
        this.highScoreNumberText.setLineSpacing(5);

        this.userScoreText = scene.add.text(scene.screenWidth * .6, scene.screenHeight * .82);
        this.userScoreText.setStyle(this.highScoreStyle);
        this.userScoreText.setAlign('left');
        this.userScoreText.setOrigin(.5, 0);

        this.hide();
    }

    update() {
        let highScoreNameStr = '';
        let highScoreNumberStr = '';
        highScoreNameStr += 'Name\n';
        highScoreNumberStr += 'Score\n';
        let highScores = this.scene.highScores;
        for (let i = 0; i < highScores.length; ++i) {
            let highScoreName = highScores[i].score_name;
            let highScoreNumber = highScores[i].score_number;
            highScoreNumberStr += highScoreNumber + '\n';
            highScoreNameStr += highScoreName + '\n';
        }
        this.highScoreNumberText.setText(highScoreNumberStr);
        this.highScoreNameText.setText(highScoreNameStr);
        this.userScoreText.setText(this.scene.score);
        this.userNameText.setText(this.scene.userName);
    }

    hide() {
        this.gameOverText.setVisible(false);
        this.highScoreNumberText.setVisible(false);
        this.highScoreNameText.setVisible(false);
        this.userScoreText.setVisible(false);
        this.userNameText.setVisible(false);
    }

    show() {
        this.gameOverText.setVisible(true);
        this.highScoreNumberText.setVisible(true);
        this.highScoreNameText.setVisible(true);
        this.userScoreText.setVisible(true);
        this.userNameText.setVisible(true);
    }
    
}