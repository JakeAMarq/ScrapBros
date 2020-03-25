class Spike extends Entity{
    constructor(game, x, y, type) {
        super(game, x, y);
        this.type = TYPES.SPIKE;
        this.width = 52;
        this.height = 52;
        this.collisionManager = new CollisionManager(x, y, this.width, this.height);
        this.damage = 34;
        this.fileName = "./resources/img/environment/spikes/";
        switch (type) {
            case "floating_spikes":
                this.height = 25;
                this.collisionManager.topBounds.set(x + 10, y, this.width - 20, 0.4 * this.height);
                this.collisionManager.botBounds.set(x, y + 0.4 * this.height, this.width, 0.6 * this.height);
                this.fileName += "floating_spikes.png";
                break;
            case "steel_block_spikes":
                this.collisionManager.topBounds.set(x, y - 1, this.width, 0.3 * this.height);
                this.collisionManager.botBounds.set(x, y + 0.3 * this.height, this.width, 0.7 * this.height);
                this.fileName += "steel_block_spikes.png";
                break;
            case "floor_spikes":
                this.collisionManager.topBounds.set(x, y - 1, this.width, 0.4 * this.height);
                this.collisionManager.botBounds.set(x, y + 0.4 * this.height, this.width, 0.6 * this.height);
                this.fileName += "floor_spikes.png";
                break;
        }
        this.tile = new Animation(ASSET_MANAGER.getAsset(this.fileName), 0, 0, this.width, this.height, .20, 1, true, true);
    }
    draw(ctx, xView, yView) {
        this.tile.drawFrame(this.game.clockTick, ctx, this.x - xView, this.y - yView);
        Entity.prototype.draw.call(this);
    }
}
