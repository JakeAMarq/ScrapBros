const TYPES = {
    HERO: 0,
    CANNON: 1,
    PLATFORM: 2,
    PROJECTILE: 3,
    COLLECTABLES: {
        HEALTHPACK: 4.0,
        MANAPACK: 4.1
    },
    WIN: 5,
    SPIKE: 6,
    INVISIBLE: 7
};
Object.freeze(TYPES);

const DIRECTIONS = {
    LEFT: 0,
    RIGHT: 1
};
Object.freeze(DIRECTIONS);

class Entity {
    constructor(game, x, y) {
        this.game = game;
        this.x = x;
        this.y = y;
        this.width = null;
        this.height = null;
        this.type = null;
        this.removeFromWorld = false;
    }
    update() {
    }
    draw(ctx, xView, yView) {
    }
}
