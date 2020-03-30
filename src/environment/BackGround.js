import { Entity } from '../engine/Entity.js';
import { Animation } from '../engine/Animation.js';

export class Background extends Entity {
    constructor(game) {
        super(game, 0, 0);
        this.back1 = new Animation(this.game.assetManager.getAsset('./resources/img/environment/Background.png'), 0, 0, 13824, 1037, 1, 1, true, true);
        this.win = new Animation(this.game.assetManager.getAsset('./resources/img/hud/Win.png'), 0, 0, 370, 202, 1, 1, true, true);
        this.radius = 200;
    }
    draw(ctx, xView, yView) {
        var hero = this.game.entities[1];
        this.back1.drawFrame(this.game.clockTick, ctx, -xView, -yView, 1);
        if (hero.win) {
            this.win.drawFrame(this.game.clockTick, ctx, ctx.canvas.width - 370 * .75, 0, .75);
        }
        Entity.prototype.draw.call(this);
    }
}
