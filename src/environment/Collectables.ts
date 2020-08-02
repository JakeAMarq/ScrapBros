import { Entity } from '../engine/Entity.js';
import { Types } from '../Enums.js';
import { Animation } from '../engine/Animation.js';
import { GameEngine } from '../engine/GameEngine.js';

/**
 * HealthPack entity
 */
class HealthPack extends Entity {
    img: Animation;
    healthValue: number;
    scale: number;
    /**
     * Constructor
     * @param {GameEngine} game
     * @param {Number} x
     * @param {Number} y
     */
    constructor(game: GameEngine, x: number, y: number) {
        super(game, x, y);
        this.img = new Animation(this.game.assetManager.getAsset('./resources/img/environment/collectables/healthPack.png'), 0, 0, 52, 52, 1, 1, true, false);
        this.type = Types.HealthPack;
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
    draw(ctx: CanvasRenderingContext2D, xView: number, yView: number) {
        this.img.drawFrame(this.game.clockTick, ctx, this.x - xView, this.y - yView, this.scale);
    }
}

/**
 * ManaPack entity
 */
class ManaPack extends Entity {
    img: Animation;
    manaValue: number;
    scale: number;
    /**
     * Constructor
     * @param {GameEngine} game
     * @param {Number} x
     * @param {Number} y
     */
    constructor(game: GameEngine, x: number, y: number) {
        super(game, x, y);
        this.img = new Animation(this.game.assetManager.getAsset('./resources/img/environment/collectables/manaPack.png'), 0, 0, 52, 52, 1, 1, true, false);
        this.type = Types.ManaPack;
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
    draw(ctx: CanvasRenderingContext2D, xView: number, yView: number) {
        this.img.drawFrame(this.game.clockTick, ctx, this.x - xView, this.y - yView, this.scale);
    }
}

export { HealthPack, ManaPack };
