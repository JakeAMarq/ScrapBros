import { Entity } from '../engine/Entity.js';
import { Types } from '../Enums.js';
import { collisionDetected, CollisionManager } from '../engine/CollisionManager.js';
import { Animation } from '../engine/Animation.js';
import { GameEngine } from '../engine/GameEngine.js';

export class Platform extends Entity {
    frames: number;
    fps: number;
    fileName: string;
    hazardous: boolean;
    collisionManager: CollisionManager;
    tile: Animation;
    constructor(game: GameEngine, x: number, y: number, type: string) {
        super(game, x, y);
        this.width = 52;
        this.height = 52;
        this.frames = 1;
        this.fps = 0.2;
        this.type = Types.Platform;
        this.fileName = './resources/img/environment/';
        this.hazardous = false;
        this.collisionManager = new CollisionManager(this.x, this.y, this.width, this.height);
        switch (type) {
            case 'invisible':
                this.type = Types.InvisibleTile;
                this.fileName += 'invisible.png';
                break;
            case 'win':
                this.fileName += 'goal.png';
                this.width = 104;
                this.height = 104;
                this.frames = 5;
                this.fps = .1;
                this.type = Types.WinTile;
                break;
            case 'gap_right':
                this.fileName += 'floor_gap_right.png';
                break;
            case 'gap_left':
                this.fileName += 'floor_gap_left.png';
                break;
            case 'floor':
                this.fileName += 'floor.png';
                break;
            case 'steel_block':
                this.fileName += 'steel_block.png';
                break;
            case 'bricks':
                this.fileName += 'bricks.png';
                break;
            case 'checkpoint':
                this.fileName += 'checkpoint.png';
                this.width = 104;
                this.height = 104;
                this.frames = 5;
                this.fps = .1;
                this.type = Types.Checkpoint;
                break;
        }
        this.tile = new Animation(this.game.assetManager.getAsset(this.fileName), 0, 0, this.width, this.height, this.fps, this.frames, true, true);
    }
    handleCollision(entity: Entity) {
        // switch (entity.type) {
        //     case Types.Hero:
        //         entity.currentHP = entity.currentHP - 20;
        //         break;
        //     case Types.Cannon:
        //         entity.currentHP = entity.currentHP - 20;
        //         break;
        //     default:
            
        // }
    }
    // The update function
    update() {
        // Collison is only checked if the block is hazardous
        if (this.hazardous == true) {
            for (var i = 0; i < this.game.entities.length; i++) {
                var ent = this.game.entities[i];
                if (ent !== this && collisionDetected(this, ent)) {
                    this.handleCollision(ent);
                }
            }
        }
        Entity.prototype.update.call(this);
    }
    draw(ctx: CanvasRenderingContext2D, xView: number, yView: number) {
        this.tile.drawFrame(this.game.clockTick, ctx, this.x - xView, this.y - yView, 1);
        Entity.prototype.draw.call(this);
    }
}
