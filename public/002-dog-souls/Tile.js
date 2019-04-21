function createTileGraphics(scene) {
    let graphics = scene.add.graphics();
    for (let i = 0; i < scene.tileXCount; ++i) {
        for (let j = scene.tileYCount - 2; j > 0; --j) {
            let tilePos = tilePosToCoords(i, j);
            tilePos.x -= tileSize / 2;
            tilePos.y -= tileSize / 2;
            graphics.fillStyle('0x9b7653');
            graphics.fillRect(tilePos.x, tilePos.y, tileSize, tileSize);
        }
    }
    drawGrassOnRow(scene, graphics, 0);
    drawGrassOnRow(scene, graphics, scene.tileYCount - 1);
    graphics.depth = -100;
    return graphics;
}

function drawGrassOnRow(scene, graphics, tileY) {
    graphics.fillStyle('0x526F35');
    for (let i = 0; i < scene.tileXCount; ++i) {
        let tilePos = tilePosToCoords(i, tileY);
        tilePos.x -= tileSize / 2;
        tilePos.y -= tileSize / 2;
        graphics.fillStyle('0x526F35');
        graphics.fillRect(tilePos.x, tilePos.y, tileSize, tileSize);
    }
}

function tilePosToCoords(tileX, tileY) {
    return {
        x: tileSize * Math.floor(tileX) + tileXOffset + tileSize / 2,
        y: tileSize * Math.floor(tileY) + tileYOffset + tileSize / 2
    };
}

function coordsToTilePos(x, y) {
    return {
        x: Math.floor((x - tileXOffset - (tileSize / 2)) / tileSize),
        y: Math.floor((y - tileYOffset - (tileSize / 2)) / tileSize),
    }
}