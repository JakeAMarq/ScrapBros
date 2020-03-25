class Instructions extends Entity {
    constructor(game, x, y) {
        super(game, x, y);
        this.img = new Animation(ASSET_MANAGER.getAsset("./resources/img/hud/Instructions.png"), 0, 0, 370, 202, 1, 1, true, true);
    }
    draw(ctx, xView, yView) {
        if (!this.game.entities[1].win)
            this.img.drawFrame(this.game.clockTick, ctx, this.x, this.y, .75);
    }
}
