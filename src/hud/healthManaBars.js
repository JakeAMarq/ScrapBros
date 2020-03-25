class HealthManaBars extends Entity {
    constructor(game, x, y) {
        super(game, x, y);
        this.backgroundBars = new Animation(ASSET_MANAGER.getAsset("./resources/img/hud/HP_bars_background.png"), 0, 0, 658, 164, 1, 1, true, false);
        this.overlay = new Animation(ASSET_MANAGER.getAsset("./resources/img/hud/HP_bars.png"), 0, 0, 658, 164, 1, 1, true, false);
        this.weapon = new Animation(ASSET_MANAGER.getAsset("./resources/img/projectiles/rocket.png"), 0, 0, 51, 60, .20, 1, true, false);
        this.healthPercent = 100;
        this.manaPercent = 100;
        this.scale = 0.4;
    }
    update() {
        var hero = this.game.entities[1];
        this.healthPercent = hero.currentHP / hero.maxHP;
        this.manaPercent = hero.currentMP / hero.maxMP;
        if (this.healthPercent < 0)
            this.healthPercent = 0;
        if (this.manaPercent < 0)
            this.manaPercent = 0;
    }
    draw(ctx, xView, yView) {
        var hpWidth = 440 * this.healthPercent; // width of hp bar in pixels
        var mpWidth = 323 * this.manaPercent; // width of mp bar in pixels
        // draw background bars
        this.backgroundBars.drawFrame(this.game.clockTick, ctx, this.x, this.y, this.scale);
        // draw health bar
        if (this.healthPercent <= 0.25) {
            ctx.fillStyle = "red";
        }
        else if (this.healthPercent <= 0.75) {
            ctx.fillStyle = "yellow";
        }
        else {
            ctx.fillStyle = "green";
        }
        ctx.save();
        ctx.beginPath();
        ctx.moveTo(this.x + 210 * this.scale, this.y + 40 * this.scale);
        ctx.lineTo(this.x + (210 + hpWidth) * this.scale, this.y + 40 * this.scale);
        ctx.lineTo(this.x + (183 + hpWidth) * this.scale, this.y + 90 * this.scale);
        ctx.lineTo(this.x + 183 * this.scale, this.y + 90 * this.scale);
        ctx.closePath();
        ctx.fill();
        // draw mana bar
        ctx.fillStyle = "blue";
        ctx.beginPath();
        ctx.moveTo(this.x + 187 * this.scale, this.y + 90 * this.scale);
        ctx.lineTo(this.x + (187 + mpWidth) * this.scale, this.y + 90 * this.scale);
        ctx.lineTo(this.x + (166 + mpWidth) * this.scale, this.y + 130 * this.scale);
        ctx.lineTo(this.x + 166 * this.scale, this.y + 130 * this.scale);
        ctx.closePath();
        ctx.fill();
        ctx.restore();
        // draw overlay
        this.overlay.drawFrame(this.game.clockTick, ctx, this.x, this.y, this.scale);
        // draw current weapon
        this.weapon.drawFrame(this.game.clockTick, ctx, this.x + 12, this.y + 20, 0.85);
    }
}
