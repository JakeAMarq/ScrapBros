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
        this.img = new Animation(ASSET_MANAGER.getAsset("./resources/img/collectables/healthPack.png"), 0, 0, 52, 52, 1, 1, true, false);
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
