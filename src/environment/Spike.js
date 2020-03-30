import { Entity } from '../engine/Entity.js';
import { TYPES } from '../Enums.js';
import { CollisionManager } from '../engine/CollisionManager.js';
import { Animation } from '../engine/Animation.js';

export class Spike extends Entity{
    constructor(game, x, y, spikeType) {
        super(game, x, y);
        this.type = TYPES.SPIKE;
        this.width = 52;
        this.height = 52;
        this.collisionManager = new CollisionManager(x, y, this.width, this.height);
        this.damage = 34;
        this.filePath = './resources/img/environment/spikes/';
        switch (spikeType) {
            case 'floating_spikes':
                this.height = 25;
                this.collisionManager.topBounds.set(x + 10, y, this.width - 20, 0.4 * this.height);
                this.collisionManager.botBounds.set(x, y + 0.4 * this.height, this.width, 0.6 * this.height);
                this.filePath += 'floating_spikes.png';
                break;
            case 'steel_block_spikes':
                this.collisionManager.topBounds.set(x, y - 1, this.width, 0.3 * this.height);
                this.collisionManager.botBounds.set(x, y + 0.3 * this.height, this.width, 0.7 * this.height);
                this.filePath += 'steel_block_spikes.png';
                break;
            case 'floor_spikes':
                this.collisionManager.topBounds.set(x, y - 1, this.width, 0.4 * this.height);
                this.collisionManager.botBounds.set(x, y + 0.4 * this.height, this.width, 0.6 * this.height);
                this.filePath += 'floor_spikes.png';
                break;
        }
        console.log(this.filePath);
        this.tile = new Animation(this.game.assetManager.getAsset(this.filePath), 0, 0, this.width, this.height, .20, 1, true, true);
    }
    draw(ctx, xView, yView) {
        this.tile.drawFrame(this.game.clockTick, ctx, this.x - xView, this.y - yView);
        Entity.prototype.draw.call(this);
    }
}
