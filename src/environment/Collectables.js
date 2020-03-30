import { Entity } from '../engine/Entity.js';
import { TYPES } from '../Enums.js';
import { Animation } from '../engine/Animation.js';

/**
 * HealthPack entity
 */
class HealthPack extends Entity {
    /**
     * Constructor
     * @param {GameEngine} game
     * @param {Number} x
     * @param {Number} y
     */
    constructor(game, x, y) {
        super(game, x, y);
        this.img = new Animation(this.game.assetManager.getAsset('./resources/img/environment/collectables/healthPack.png'), 0, 0, 52, 52, 1, 1, true, false);
        this.type = TYPES.COLLECTABLES.HEALTHPACK;
        this.healthValue = 25;
        this.scale = 1;
        this.width = 52;
        this.height = 52;
    }

    /**
     * Draw function
     * @param {CanvasRenderingContext2D} ctx
     * @param {Number} xView
     * @param {Number} yView
     */
    draw(ctx, xView, yView) {
        this.img.drawFrame(this.game.clockTick, ctx, this.x - xView, this.y - yView, this.scale);
    }
}

/**
 * ManaPack entity
 */
class ManaPack extends Entity {
    /**
     * Constructor
     * @param {GameEngine} game
     * @param {Number} x
     * @param {Number} y
     */
    constructor(game, x, y) {
        super(game, x, y);
        this.img = new Animation(this.game.assetManager.getAsset('./resources/img/environment/collectables/manaPack.png'), 0, 0, 52, 52, 1, 1, true, false);
        this.type = TYPES.COLLECTABLES.MANAPACK;
        this.manaValue = 25;
        this.scale = 1;
        this.width = 52;
        this.height = 52;
    }

    /**
     * Draw function
     * @param {CanvasRenderingContext2D} ctx
     * @param {Number} xView
     * @param {Number} yView
     */
    draw(ctx, xView, yView) {
        this.img.drawFrame(this.game.clockTick, ctx, this.x - xView, this.y - yView, this.scale);
    }
}

export { HealthPack, ManaPack };
