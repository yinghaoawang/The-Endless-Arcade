function createTileGraphics(scene) {
    let graphics = scene.add.graphics();
    graphics.fillStyle('0xdddddd');
    graphics.lineStyle(1, '0x000000')
    for (let i = 0; i < scene.tileXCount; ++i) {
        for (let j = 0; j < scene.tileYCount; ++j) {
            let tilePos = tilePosToCoords(i, j);
            tilePos.x -= tileSize / 2;
            tilePos.y -= tileSize / 2;
            graphics.fillRect(tilePos.x, tilePos.y, tileSize, tileSize);
            graphics.strokeRect(tilePos.x, tilePos.y, tileSize, tileSize);
        }
    }
    graphics.depth = -100;
    return graphics;
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