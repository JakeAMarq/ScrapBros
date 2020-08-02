import { Entity } from './engine/Entity.js';
import { Directions, Types } from './Enums.js';
import { collisionDetected, CollisionManager } from './engine/CollisionManager.js';
import { Rocket, Fire, Projectile } from './Projectiles.js';
import { Animation } from './engine/Animation.js';
import { GameEngine } from './engine/GameEngine.js';
import { HealthPack, ManaPack } from './environment/Collectables.js';
import { Spike } from './environment/Spike.js';

const IDLE_FRAME_WIDTH = 191;

/**
 * Class for the playable hero
 */
export class Hero extends Entity {
    idleR: Animation;
    RunningR: Animation;
    jumpAnimationR: Animation;
    shootAnimationR: Animation;
    jumping: boolean;
    shootingBullets: boolean;
    shootingFire: boolean;
    walking: boolean;
    direction: any;
    velocity: number;
    yAccel: number;
    gravity: number;
    jumpStart: boolean;
    maxHP: number;
    currentHP: number;
    healthRegen: number;
    manaRegen: number;
    scale: number;
    collisionDelay: number;
    ticksSinceCollison: number;
    collisionManager: CollisionManager;
    ticksSinceShot: number;
    startX: number;
    startY: number;
    currentMP: number;
    maxMP: number;
    idleL: Animation;
    RunningL: Animation;
    jumpAnimationL: Animation;
    shootAnimationL: Animation;
    accel: number;
    /**
     * Create a Hero object
     * @param {GameEngine} game
     * @param {Number} x
     * @param {Number} y
     */
    constructor(game: GameEngine, x: number, y: number) {
        super(game, x, y);
        // Animations
        this.idleR = new Animation(this.game.assetManager.getAsset('./resources/img/hero/Cyborg_Idle_R.png'), 0, 0, IDLE_FRAME_WIDTH, 351, 0.06, 10, true, false);
        this.idleL = new Animation(this.game.assetManager.getAsset('./resources/img/hero/Cyborg_Idle_L.png'), 0, 0, IDLE_FRAME_WIDTH, 351, 0.06, 10, true, false);
        this.RunningR = new Animation(this.game.assetManager.getAsset('./resources/img/hero/Cyborg_Walk2_R.png'), 0, 0, 214, 359, 0.04, 10, true, false);
        this.RunningL = new Animation(this.game.assetManager.getAsset('./resources/img/hero/Cyborg_Walk2_L.png'), 0, 0, 214, 359, 0.04, 10, true, false);
        this.jumpAnimationR = new Animation(this.game.assetManager.getAsset('./resources/img/hero/Cyborg_Jump2_R.png'), 0, 0, 213, 344, 0.2, 10, true, false);
        this.jumpAnimationL = new Animation(this.game.assetManager.getAsset('./resources/img/hero/Cyborg_Jump2_L.png'), 0, 0, 213, 344, 0.2, 10, true, false);
        this.shootAnimationR = new Animation(this.game.assetManager.getAsset('./resources/img/hero/Cyborg_Shoot2_R.png'), 0, 0, 223, 344, 0.03, 5, true, false);
        this.shootAnimationL = new Animation(this.game.assetManager.getAsset('./resources/img/hero/Cyborg_Shoot2_L.png'), 0, 0, 223, 344, 0.03, 5, true, false);

        this.jumping = false;                   // if the hero is jumping
        this.shootingBullets = false;           // if the hero is attacking
        this.shootingFire = false;              // if the hero is shooting
        this.walking = false;                   // if the hero is walking
        this.direction = Directions.Right;
        this.type = Types.Hero;

        this.velocity = 7;
        this.yAccel = 0;                // the heros vertical acceleration for gravity
        this.gravity = 1;               // The effect of gravity
        this.jumpStart = true;          // whether the hero gets y accel at the beginning of a jump

        this.maxHP = 100;
        this.currentHP = 100;
        this.maxMP = 100;
        this.currentMP = 100;
        this.healthRegen = 0;           // amount hp increases every update
        this.manaRegen = 0;             // amount mana increases every update

        this.scale = .25;
        this.width = 191 * this.scale;
        this.height = 351 * this.scale;

        this.collisionDelay = 60;
        this.ticksSinceCollison = 60;
        this.collisionManager = new CollisionManager(this.x, this.y, this.width, this.height);
        this.ticksSinceShot = 0;

        this.win = false;
        this.startX = x;
        this.startY = y;
    }
    /**
     * Update Hero's properties by checking/handling collisions and reading/applying player's input
     */
    update() {
        if (!this.win) {
            for (var i = 0; i < this.game.entities.length; i++) {
                var ent = this.game.entities[i];
                if (ent !== this && collisionDetected(this, ent)) {
                    this.handleCollision(ent);
                }
            }
            /*  Need this in the jumping if statement.
                When physics is applied to the entity we
                can check if the
                if (this.jumpAnimationL.isDone()) {
                this.jumpAnimationL.elapsedTime = 0;
                this.jumping = false;
                }
            */
            if (this.y > 2000 || this.currentHP <= 0) {
                this.yAccel = 0;
                this.x = this.startX;
                this.y = this.startY;
                this.currentHP = this.maxHP;
                this.currentMP = this.maxMP;
            }
            // If the yaccel is not 0 it means the hero is jumping or falling
            if (this.yAccel !== 0) {
                this.jumpStart = false;
            }
            // Updating the heros y location
            this.y += this.yAccel;
            // Applying the effects of gravity
            this.yAccel += this.gravity;
            // Setting the hero to jump if the key is pressed and the hero is not jumping
            if (!this.jumping && this.game.controls.activeKeyCodes.has('Space')) {
                this.jumping = true;
            }
            this.walking = this.game.controls.activeKeyCodes.has('KeyD') ||
                this.game.controls.activeKeyCodes.has('ArrowRight') ||
                this.game.controls.activeKeyCodes.has('KeyA') ||
                this.game.controls.activeKeyCodes.has('ArrowLeft');
            if (this.walking) {
                this.direction = (this.game.controls.activeKeyCodes.has('KeyD') ||
                    this.game.controls.activeKeyCodes.has('39')) ? Directions.Right : Directions.Left;
            }
            // The jumping function of the hero
            if (this.jumping) {
                if (this.jumpStart) {
                    this.yAccel = -25;
                }
                this.jumpStart = false;
            }
            if (this.walking) {
                this.x += (this.direction === Directions.Right) ? this.velocity : -this.velocity;
            }
            // Shooting function for the hero
            this.shootingFire = this.game.controls.mouse.rightDown;
            this.shootingBullets = this.game.controls.mouse.leftDown;
            if (this.shootingBullets) {
                this.shootBullet();
            }
            else if (this.shootingFire) {
                this.shootFire();
            }
            this.ticksSinceShot++;
        }
        else {
            this.shootingBullets = true;
            this.shootFire();
        }
        // Collison boundaries
        // this.updateDimensions();
        this.collisionManager.updateDimensions(this.x, this.y, this.width, this.height);
        this.ticksSinceCollison++;
        this.changeHP(this.healthRegen);
        this.changeMP(this.manaRegen);
        Entity.prototype.update.call(this);
    }

    /**
     * Draw Hero on canvas
     * @param {CanvasRenderingContext2D} ctx
     * @param {Number} xView
     * @param {Number} yView
     */
    draw(ctx: CanvasRenderingContext2D, xView: number, yView: number) {
        const drawX = this.x - xView;
        const drawY = this.y - yView;
        // if (this.shootingFire || this.game.controls.activeKeyCodes['F'.charCodeAt(0)] || this.shootingBullets) {
        //     (this.game.controls.mouse.x > this.x + this.width / 2 ? this.shootAnimationR : this.shootAnimationL)
        //         .drawFrame(this.game.clockTick, ctx, drawX, drawY, this.scale);
        // }
        // else if (this.jumping) {
        //     (this.direction == DIRECTIONS.RIGHT ? this.jumpAnimationR : this.jumpAnimationL)
        //         .drawFrame(this.game.clockTick, ctx, drawX - 100 * this.scale, drawY, this.scale);
        // }
        // else if (this.walking) {
        //     if (this.direction == DIRECTIONS.RIGHT) {
        //         this.RunningR.drawFrame(this.game.clockTick, ctx, drawX - 100 * this.scale, drawY, this.scale);
        //     } else {
        //         this.RunningL.drawFrame(this.game.clockTick, ctx, drawX, drawY, this.scale);
        //     }
        // } else {
        //     (this.direction == DIRECTIONS.RIGHT ? this.idleR : this.idleL)
        //         .drawFrame(this.game.clockTick, ctx, drawX, drawY, this.scale);
        // }
        if (this.shootingFire || this.shootingBullets) {
            (this.game.controls.mouse.currentX > this.x + this.width / 2 ? this.shootAnimationR : this.shootAnimationL)
                .drawFrame(this.game.clockTick, ctx, drawX, drawY, this.scale);
        }
        else if (this.jumping) {
            (this.direction === Directions.Right ? this.jumpAnimationR : this.jumpAnimationL)
                .drawFrame(this.game.clockTick, ctx, drawX, drawY, this.scale);
        }
        else if (this.walking) {
            (this.direction === Directions.Right ? this.RunningR : this.RunningL)
                .drawFrame(this.game.clockTick, ctx, drawX, drawY, this.scale);
        }
        else {
            (this.direction === Directions.Right ? this.idleR : this.idleL)
                .drawFrame(this.game.clockTick, ctx, drawX, drawY, this.scale);
        }
    }

    /**
     * Prevents Hero from walking/falling/jumping into entity
     * @param {Entity} entity
     */
    blockMovement(entity: Entity) {
        if (this.collisionManager.topCollisionDetected(entity)) {
            this.y = entity.y + this.height;
            this.yAccel = 0;
        }
        else if (this.collisionManager.botCollisionDetected(entity)) {
            this.jumping = false;
            this.y = entity.y - this.height;
            this.jumpStart = true;
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
    handleCollision(entity: Entity) {
        switch (entity.type) {
            case Types.Projectile:
                let projectile = entity as Projectile;
                if (!projectile.friendly)
                    this.changeHP(-projectile.damage);
                break;
            case Types.HealthPack:
                let healthPack = entity as HealthPack;
                this.changeHP(healthPack.healthValue);
                healthPack.removeFromWorld = true;
                break;
            case Types.ManaPack:
                let manaPack = entity as ManaPack;
                this.changeMP(manaPack.manaValue);
                manaPack.removeFromWorld = true;
                break;
            case Types.WinTile:
                this.win = true;
                break;
            case Types.Checkpoint:
                this.startX = entity.x;
                this.startY = entity.y - 100;
                break;
            case Types.Cannon:
                if (this.ticksSinceCollison >= this.collisionDelay) {
                    this.changeHP(-20);
                    this.ticksSinceCollison = 0;
                }
                this.blockMovement(entity);
                break;
            case Types.InvisibleTile:
            case Types.Platform:
                this.blockMovement(entity);
                break;
            case Types.Spike:
                let spike = entity as Spike;
                if (spike.collisionManager.topCollisionDetected(this)) {
                    if (this.ticksSinceCollison >= this.collisionDelay) {
                        this.changeHP(-spike.damage);
                        this.ticksSinceCollison = 0;
                    }
                }
                this.blockMovement(spike);
                break;
        }
    }
    // Let's revisit this idea after the deadline, but right now it causes some issues
    updateDimensions() {
        if (this.jumping) {
            this.width = 402 * this.scale;
            this.height = 365 * this.scale;
        }
        else if (this.accel !== 0) {
            this.width = 295 * this.scale;
            this.height = 343 * this.scale;
        }
        else {
            this.width = 191 * this.scale;
            this.height = 351 * this.scale;
        }
        this.collisionManager.updateDimensions(this.x, this.y, this.width, this.height);
    }
    changeHP(amount: number) {
        this.currentHP += amount;
        if (this.currentHP < 0)
            this.currentHP = 0;
        else if (this.currentHP > this.maxHP)
            this.currentHP = this.maxHP;
    }
    changeMP(amount: number) {
        this.currentMP += amount;
        if (this.currentMP < 0)
            this.currentMP = 0;
        else if (this.currentMP > this.maxMP)
            this.currentMP = this.maxMP;
    }
    shootBullet() {
        // Need to figure out way to have offset scale with bullet's width/height
        const startX = this.game.controls.mouse.currentX > this.x + this.width / 2 ? this.x + 180 * this.scale : this.x;
        var startY = this.y + 145 * this.scale;
        let rocket;
        if (this.walking) {
            rocket = new Rocket(this.game, startX, startY, this.game.controls.mouse.currentX, this.game.controls.mouse.currentY, (this.direction === Directions.Right ? 1 : -1) * this.velocity, true);
        }
        else {
            rocket = new Rocket(this.game, startX, startY, this.game.controls.mouse.currentX, this.game.controls.mouse.currentY, 0, true);
        }
        if (this.ticksSinceShot >= rocket.fireRate && this.currentMP >= rocket.manaCost) {
            this.game.addEntity(rocket);
            this.ticksSinceShot = 0;
            this.changeMP(-rocket.manaCost);
        }
    }
    shootFire() {
        // Need to figure out way to have offset scale with fire's width/height
        var startX = this.game.controls.mouse.currentX > this.x + this.width / 2 ? this.x + 160 * this.scale : this.x;
        var startY = this.y + 140 * this.scale;
        let fire;
        if (this.walking) {
            fire = new Fire(this.game, startX, startY, this.game.controls.mouse.currentX, this.game.controls.mouse.currentY, (this.direction === Directions.Right ? 1 : -1) * this.velocity, true);
        }
        else {
            fire = new Fire(this.game, startX, startY, this.game.controls.mouse.currentX, this.game.controls.mouse.currentY, 0, true);
        }
        if (this.ticksSinceShot >= fire.fireRate && this.currentMP >= fire.manaCost) {
            this.game.addEntity(fire);
            this.ticksSinceShot = 0;
            this.changeMP(-fire.manaCost);
        }
    }
}

// Hero.prototype = new Entity();
// Hero.prototype.constructor = Hero;









