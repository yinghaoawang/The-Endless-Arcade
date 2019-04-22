import Phaser from 'phaser3';
import { tileSize, tilePosToCoords, coordsToTilePos } from './Tile';

class GridUnit extends Phaser.GameObjects.Sprite {
    constructor(scene, tileX, tileY, texture) {
        super(scene, tilePosToCoords(tileX, tileY).x, tilePosToCoords(tileX, tileY).y, texture);
        this.scene = scene;
        this.scene.add.existing(this);
        this.canMove = true;
        this.moveCoolDown = 1;
        this.moveTimer = 0;
        this.targetTile = undefined;
        this.currTile;
        this.setTilePos(Math.floor(tileX), Math.floor(tileY));
    }

    setTargetTilePos(tileX, tileY) {
        this.targetTile = {
            x: tileX,
            y: tileY
        }
    }

    setTilePos(tileX, tileY) {
        let tilePos = tilePosToCoords(tileX, tileY);
        this.setPosition(tilePos.x, tilePos.y);
        this.currTile = {
            x: Math.floor(tileX),
            y: Math.floor(tileY)
        }
    }
    
    moveToTile(tileX, tileY) {
        if (this.canMove) {
            let signX = 0;
            if (tileX - this.currTile.x < 0) signX = -1;
            else if (tileX - this.currTile.x > 0) signX = 1;
            let signY = 0;
            if (tileY - this.currTile.y < 0) signY = -1;
            else if (tileY - this.currTile.y > 0) signY = 1; 
            this.canMove = false;
            this.moveTimer = this.scene.time.now + this.moveCoolDown;
            this.setTargetTilePos(this.currTile.x + signX, this.currTile.y + signY);
        }
    }

    setToTile(tileX, tileY) {
        let tilePos = tilePosToCoords(tileX, tileY);
        this.setPosition(tilePos.x, tilePos.y)
    }

    allowMove() {
        if (typeof this.targetTile != 'undefined') {
            this.setTilePos(this.targetTile.x, this.targetTile.y);
        }
        this.targetTile = undefined;
        this.canMove = true;
    }

    update(time, delta) {
        if (!this.canMove) {
            let timeRemaining = this.moveTimer - time;
            if (timeRemaining <= 0) {
                this.allowMove();
            } else {
                let vX = delta * tileSize * (this.targetTile.x - this.currTile.x) / (this.moveCoolDown);
                let vY = delta * tileSize * (this.targetTile.y - this.currTile.y) / (this.moveCoolDown)
                this.x += vX;
                this.y += vY;
            }
        }
        
    }
}

class ControlledGridUnit extends GridUnit {
    constructor(scene, tileX, tileY, texture) {
        super(scene, tileX, tileY, texture);
        this.moveCoolDown = 250;
    }

    moveUp() {
        if (this.canMove) {
            let tilePos = coordsToTilePos(this.x, this.y);
            if (tilePos.y > 0) {
                this.moveToTile(tilePos.x, tilePos.y - 1);
            }
        }
    }

    moveDown() {
        if (this.canMove) {
            let tilePos = coordsToTilePos(this.x, this.y);
            if (tilePos.y < this.scene.tileYCount - 1) {
                this.moveToTile(tilePos.x, tilePos.y + 1);
            }
        }
    }

    moveLeft() {
        if (this.canMove) {
            let tilePos = coordsToTilePos(this.x, this.y);
            if (tilePos.x > 0) {
                this.moveToTile(tilePos.x - 1, tilePos.y);
                this.flipX = true;
            }
        }
    }

    moveRight() {
        if (this.canMove) {
            let tilePos = coordsToTilePos(this.x, this.y);
            if (tilePos.x < this.scene.tileXCount - 1) {
                this.moveToTile(tilePos.x + 1, tilePos.y);
                this.flipX = false;
            }
        }
    }
}

class Doggo extends ControlledGridUnit {
    constructor(scene, tileX, tileY) {
        super(scene, tileX, tileY, 'doggo');
        this.moveCoolDown = 150;
    }
}

class Horsie extends GridUnit {
    constructor(scene, startTileX, startTileY, targetTileX, targetTileY, moveCoolDownPerTile) {
        super(scene, startTileX, startTileY, 'horse1');
        if (typeof moveCoolDownPerTile == 'undefined') {
            moveCoolDownPerTile = 300;
        }
        this.moveCoolDown = moveCoolDownPerTile;
        this.moveToTile(targetTileX, targetTileY);
        this.finalTargetTile = {
            x: targetTileX,
            y: targetTileY
        }
    }

    update(time, delta) {
        super.update(time, delta);
        if (typeof targetTile == 'undefined') {
            if (this.currTile.x != this.finalTargetTile.x ||
                this.currTile.y != this.finalTargetTile.y) {
                this.moveToTile(this.finalTargetTile.x, this.finalTargetTile.y);
            }
        }
    }
}

class HorseSpawner {
    constructor(scene, y, horseCD, spawnMinCD, spawnMaxCD, startRight) {
        this.spawning = false;
        this.scene = scene;
        this.y = y;
        this.horseCD = horseCD;
        this.spawnMinCD = spawnMinCD;
        this.spawnMaxCD = spawnMaxCD;
        this.startRight = startRight;
        this.nextSpawnTime;
    }
    update(time, delta) {
        if (!this.spawning) {
            this.nextSpawnTime = time + Math.random() * (this.spawnMaxCD - this.spawnMinCD) + this.spawnMinCD;
            this.spawning = true;
        } else {
            if (this.nextSpawnTime - time <= 0) {
                let horse;
                if (this.startRight) {
                    horse = new Horsie(this.scene, -1, this.y, this.scene.tileXCount, this.y, this.horseCD);
                } else {
                    horse = new Horsie(this.scene, this.scene.tileXCount, this.y, -1, this.y, this.horseCD);
                    horse.flipX = true;
                }
                this.scene.units.push(horse);
                this.spawning = false;
                // bad
                this.scene.physics.add.existing(horse);
                this.scene.physics.add.collider(this.scene.doggo, horse, this.scene.dogHorseCollide);
            }
        }
    }

    destroy() {
        delete this;
    }
}

export {
    GridUnit, ControlledGridUnit, Doggo, Horsie, HorseSpawner
};
