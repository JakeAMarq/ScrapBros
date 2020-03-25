class SplashScreen extends Entity {
    constructor(game) {
        super(game, 0, 0);
        this.img = new Animation(ASSET_MANAGER.getAsset("./resources/img/hud/title_screen.png"), 0, 0, 1000, 750, 1, 1, true, true);
        this.visible = true;
    }
    draw(ctx, xView, yView) {
        if (this.visible)
            this.img.drawFrame(this.game.clockTick, ctx, this.x, this.y);
    }
}
