import { Entity } from './engine/Entity.js';
import { collisionDetected, CollisionManager } from './engine/CollisionManager.js';
import { Types, Directions } from './Enums.js';
import { Animation } from './engine/Animation.js';
import { Fire, Projectile } from './Projectiles.js';
import { GameEngine } from './engine/GameEngine.js';

/**
 * Cannon
 */
export class Cannon extends Entity {
    scale: number;
    walkingRight: Animation;
    walkingLeft: Animation;
    jumping: boolean;
    walking: boolean;
    direction: Directions;
    velocity: number;
    yAccel: number;
    gravity: number;
    startX: number;
    maxHP: number;
    currentHP: number;
    collisionManager: CollisionManager;
    accel: number;
    /**
     * Constructor
     * @param {GameEngine} game
     * @param {Number} x
     * @param {Number} y
     */
    constructor(game: GameEngine, x: number, y: number) {
        super(game, x, y);
        //Changes size and relative location of entities
        this.scale = 1.5;
        const frameWidth = 113;
        const frameHeight = 82;
        this.width = frameWidth * this.scale;
        this.height = (frameHeight - 3) * this.scale;
        const animationSpeed = 0.05 * this.scale;
        this.walkingRight = new Animation(this.game.assetManager.getAsset('./resources/img/enemies/cannon/Cannon2_R.png'), 0, 0, frameWidth, frameHeight, animationSpeed, 10, true, false);
        this.walkingLeft = new Animation(this.game.assetManager.getAsset('./resources/img/enemies/cannon/Cannon2_L.png'), 0, 0, frameWidth, frameHeight, animationSpeed, 10, true, true);
        this.jumping = false;
        this.walking = true;
        this.direction = Directions.Right;
        this.velocity = 5;
        this.yAccel = 0;
        this.gravity = 1;
        this.type = Types.Cannon;
        this.startX = x;
        this.maxHP = 25;
        this.currentHP = 25;
        this.collisionManager = new CollisionManager(this.x, this.y, this.width, this.height);
        // Needs location parameters set
    }

    /**
     * Collision handler, called when Cannon collides with entity
     * @param {Entity} entity
     */
    handleCollision(entity: Entity) {
        switch (entity.type) {
            case Types.Projectile:
                let projectile = entity as Projectile
                if (projectile.friendly && !projectile.exploding) {
                    this.takeDamage(projectile.damage);
                }
                break;
            default:
                if (this.collisionManager.topCollisionDetected(entity)) {
                    this.y = entity.y + this.height;
                    this.yAccel = 0;
                }
                else if (this.collisionManager.botCollisionDetected(entity)) {
                    this.jumping = false;
                    this.y = entity.y - this.height;
                    if (this.yAccel > 0) {
                        this.yAccel = 0;
                    }
                }
                else if (this.collisionManager.rightCollisionDetected(entity)) {
                    this.x = entity.x - this.width;
                }
                else if (this.collisionManager.leftCollisionDetected(entity)) {
                    this.x = entity.x + entity.width;
                }
        }
    }

    /**
     * Update function
     */
    update() {

        // Checks for collision with all other entities, handles collision if collision occurs
        for (let i = 0; i < this.game.entities.length; i++) {
            const ent = this.game.entities[i];
            if (ent !== this && collisionDetected(this, ent)) {
                this.handleCollision(ent);
            }
        }
        if (this.jumping === false) {
            if (this.accel < -1) {
                this.accel += .2;
            }
            else if (this.accel > 1) {
                this.accel -= .2;
            }
            else {
                this.accel = 0;
            }
        }

        // Adjusts x value if cannon is walking
        if (this.walking)
            this.x = this.x + (this.direction === Directions.Right ? 1 : -1) * this.velocity;

        // Switches direction to right if current x values is less than startX - 200
        if (this.x < this.startX - 200) {
            this.direction = Directions.Right;
        }

        // Switches direction to left if current x values is greater than startX + 200
        if (this.x > this.startX + 200) {
            this.direction = Directions.Left;
        }
        this.y = this.y + this.yAccel;
        this.yAccel = this.yAccel + this.gravity;
        this.collisionManager.updateDimensions(this.x, this.y, this.width, this.height);
        this.shoot();
    }

    /**
     * Draw function
     * @param {CanvasRenderingContext2D} ctx
     * @param {Number} xView
     * @param {Number} yView
     */
    draw(ctx: CanvasRenderingContext2D, xView: number, yView: number) {
        const drawX = this.x - xView;
        const drawY = this.y - yView;
        if (this.walking) {
            (this.direction === Directions.Right ? this.walkingRight : this.walkingLeft)
                .drawFrame(this.game.clockTick, ctx, drawX, drawY, this.scale);
        }
    }

    /**
     * Shoots fire at the ground in front of Cannon
     */
    shoot() {
        const xProjectileStart = 12 * this.scale;
        const yProjectileStart = 28 * this.scale;
        const yProjectileEnd = 35 * this.scale;
        let projectile;
        if (this.direction === Directions.Right) { //right
            projectile = new Fire(this.game, this.x + this.width - xProjectileStart, this.y + yProjectileStart, this.x + this.width + 50, this.y + yProjectileEnd, this.velocity, false);
            this.game.addEntity(projectile);
        } else {
            projectile = new Fire(this.game, this.x + xProjectileStart, this.y + yProjectileStart, this.x - 50, this.y + yProjectileEnd, this.velocity, false);
            this.game.addEntity(projectile);
        }
    }

    /**
     * Cannon's HP goes down according to damage and dies if HP goes to or below zero
     * @param damage
     */
    takeDamage(damage: number) {
        this.currentHP -= damage;
        if (this.currentHP <= 0)
            this.removeFromWorld = true;
    }
}
