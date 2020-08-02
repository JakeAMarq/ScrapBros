import { Entity } from '../engine/Entity.js';
import { Types } from '../Enums.js';
import { CollisionManager } from '../engine/CollisionManager.js';
import { Animation } from '../engine/Animation.js';
import { GameEngine } from '../engine/GameEngine.js';

export class Spike extends Entity{
    collisionManager: CollisionManager;
    damage: number;
    filePath: string;
    tile: Animation;
    constructor(game: GameEngine, x: number, y: number, spikeType: string) {
        super(game, x, y);
        this.type = Types.Spike;
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
        this.tile = new Animation(this.game.assetManager.getAsset(this.filePath), 0, 0, this.width, this.height, .20, 1, true, true);
    }
    draw(ctx: CanvasRenderingContext2D, xView: number, yView: number) {
        this.tile.drawFrame(this.game.clockTick, ctx, this.x - xView, this.y - yView);
        Entity.prototype.draw.call(this);
    }
}
