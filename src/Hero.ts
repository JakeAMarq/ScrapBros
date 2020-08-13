import { Entity } from './engine/Entity.js';
import { Directions, Types } from './Enums.js';
import { collisionDetected, CollisionManager } from './engine/CollisionManager.js';
import { Rocket, Fire, Projectile } from './Projectiles.js';
import { Animation } from './engine/Animation.js';
import { GameEngine } from './engine/GameEngine.js';
import { HealthPack, ManaPack } from './environment/Collectables.js';
import { Spike } from './environment/Spike.js';

const sprites = Object.freeze({
    idle: {
        width: 191,
        height: 351,
        frameDuration: 0.06,
        frames: 10
    },
    running: {
        width: 214,
        height: 359,
        frameDuration: 0.04,
        frames: 10
    },
    jumping: {
        width: 213,
        height: 344,
        frameDuration: 0.2,
        frames: 10
    }, 
    shooting: {
        width: 223,
        height: 344,
        frameDuration: 0.03,
        frames: 5
    }
});

/**
 * Class for the playable hero
 */
export class Hero extends Entity {
    animations: {
        idleL: Animation,
        idleR: Animation,
        runningL: Animation,
        runningR: Animation,
        jumpingL: Animation,
        jumpingR: Animation,
        shootingL: Animation,
        shootingR: Animation,
        scale: number
    }
    actions: {
        jumping: boolean,
        shootingBullets: boolean,
        shootingFire: boolean,
        walking: boolean
    }
    physics: {
        velocity: number,
        yAccel: number,
        gravity: number,
        canJump: boolean,
        accel: number
    }
    stats: {
        maxHP: number,
        maxMP: number,
        currentHP: number,
        currentMP: number,
        healthRegen: number,
        manaRegen: number,
    }
    direction: any;
    collisionDelay: number;
    ticksSinceCollison: number;
    collisionManager: CollisionManager;
    ticksSinceShot: number;
    checkpointX: number;
    checkpointY: number;
    /**
     * Create a Hero object
     * @param {GameEngine} game
     * @param {Number} x
     * @param {Number} y
     */
    constructor(game: GameEngine, x: number, y: number) {
        super(game, x, y);
        // Animations
        this.animations = {
            idleR : new Animation(this.game.assetManager.getAsset('./resources/img/hero/Cyborg_Idle_R.png'), 0, 0, 
                sprites.idle.width, sprites.idle.height, sprites.idle.frameDuration, sprites.idle.frames, true, false),
            idleL : new Animation(this.game.assetManager.getAsset('./resources/img/hero/Cyborg_Idle_L.png'), 0, 0, 
                sprites.idle.width, sprites.idle.height, sprites.idle.frameDuration, sprites.idle.frames, true, false),
            runningR : new Animation(this.game.assetManager.getAsset('./resources/img/hero/Cyborg_Walk2_R.png'), 0, 0, 
                sprites.running.width, sprites.running.height, sprites.running.frameDuration, sprites.running.frames, true, false),
            runningL : new Animation(this.game.assetManager.getAsset('./resources/img/hero/Cyborg_Walk2_L.png'), 0, 0,  
                sprites.running.width, sprites.running.height, sprites.running.frameDuration, sprites.running.frames, true, false),
            jumpingR : new Animation(this.game.assetManager.getAsset('./resources/img/hero/Cyborg_Jump2_R.png'), 0, 0, 
                sprites.jumping.width, sprites.jumping.height, sprites.jumping.frameDuration, sprites.jumping.frames, true, false),
            jumpingL : new Animation(this.game.assetManager.getAsset('./resources/img/hero/Cyborg_Jump2_L.png'), 0, 0, 
                sprites.jumping.width, sprites.jumping.height, sprites.jumping.frameDuration, sprites.jumping.frames, true, false),
            shootingR : new Animation(this.game.assetManager.getAsset('./resources/img/hero/Cyborg_Shoot2_R.png'), 0, 0, 
                sprites.shooting.width, sprites.shooting.height, sprites.shooting.frameDuration, sprites.shooting.frames, true, false),
            shootingL : new Animation(this.game.assetManager.getAsset('./resources/img/hero/Cyborg_Shoot2_L.png'), 0, 0, 
                sprites.shooting.width, sprites.shooting.height, sprites.shooting.frameDuration, sprites.shooting.frames, true, false),
            scale: 0.25 
        }

        this.actions = {
            jumping: false,
            shootingBullets: false,
            shootingFire: false,
            walking: false
        };

        this.direction = Directions.Right;
        this.type = Types.Hero;
        
        this.physics = {
            velocity: 7,
            yAccel: 0,
            gravity: 1,
            canJump: true,
            accel: 1
        };

        this.stats = {
            maxHP: 100,
            maxMP: 100,
            currentHP: 100,
            currentMP: 100,
            healthRegen: 0,
            manaRegen: 0
        };

        this.width = sprites.idle.width * this.animations.scale;
        this.height = sprites.idle.height * this.animations.scale;

        this.collisionDelay = 60;
        this.ticksSinceCollison = 60;
        this.collisionManager = new CollisionManager(this.x, this.y, this.width, this.height);
        this.ticksSinceShot = 0;

        this.win = false;
        this.checkpointX = x;
        this.checkpointY = y;
    }
    /**
     * Update Hero's properties by checking/handling collisions and reading/applying player's input
     */
    update() {
        if (this.win) {
            this.actions.shootingBullets = true;
            this.shootFire();
            return;
        }

        this.game.entities.forEach((entity: Entity) => {
            if (entity !== this && collisionDetected(this, entity)) {
                this.handleCollision(entity);
            }
        });

        /*  Need this in the jumping if statement.
            When physics is applied to the entity we
            can check if the
            if (this.jumpAnimationL.isDone()) {
            this.jumpAnimationL.elapsedTime = 0;
            this.jumping = false;
            }
        */
        if (this.isDead()) this.goToLastCheckpoint();

        // If the yaccel is not 0 it means the hero is jumping or falling
        if (this.isAirborne()) {
            this.physics.canJump = false;
        }
        // Updating the heros y location
        this.y += this.physics.yAccel;
        // Applying the effects of gravity
        this.physics.yAccel += this.physics.gravity;
        // Setting the hero to jump if the key is pressed and the hero is not jumping
        if (this.physics.canJump && this.game.controls.activeKeyCodes.has('Space')) {
            this.startJump();
        }

        this.actions.shootingFire = this.game.controls.mouse.rightDown;
        this.actions.shootingBullets = this.game.controls.mouse.leftDown;
        this.actions.walking = this.game.controls.activeKeyCodes.has('KeyD') ||
            this.game.controls.activeKeyCodes.has('ArrowRight') ||
            this.game.controls.activeKeyCodes.has('KeyA') ||
            this.game.controls.activeKeyCodes.has('ArrowLeft');
        
        if (this.actions.walking) {
            this.direction = (this.game.controls.activeKeyCodes.has('KeyD') ||
                this.game.controls.activeKeyCodes.has('39')) ? Directions.Right : Directions.Left;
        }
        
        if (this.actions.walking) {
            this.x += this.physics.velocity * (this.direction === Directions.Right ? 1 : -1);
        }
        // Shooting function for the hero
        if (this.actions.shootingBullets) {
            this.shootBullet();
        }
        else if (this.actions.shootingFire) {
            this.shootFire();
        }
        this.ticksSinceShot++;
        // Collison boundaries
        // this.updateDimensions();
        this.collisionManager.updateDimensions(this.x, this.y, this.width, this.height);
        this.ticksSinceCollison++;
        this.changeHP(this.stats.healthRegen);
        this.changeMP(this.stats.manaRegen);
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

        if (this.actions.shootingFire || this.actions.shootingBullets) {
            (this.game.controls.mouse.currentX > this.x + this.width / 2 ? this.animations.shootingR : this.animations.shootingL)
                .drawFrame(this.game.clockTick, ctx, drawX, drawY, this.animations.scale);
        }
        else if (this.actions.jumping) {
            (this.direction === Directions.Right ? this.animations.jumpingR : this.animations.jumpingL)
                .drawFrame(this.game.clockTick, ctx, drawX, drawY, this.animations.scale);
        }
        else if (this.actions.walking) {
            (this.direction === Directions.Right ? this.animations.runningR : this.animations.runningL)
                .drawFrame(this.game.clockTick, ctx, drawX, drawY, this.animations.scale);
        }
        else {
            (this.direction === Directions.Right ? this.animations.idleR : this.animations.idleL)
                .drawFrame(this.game.clockTick, ctx, drawX, drawY, this.animations.scale);
        }
    }

    /**
     * Prevents Hero from walking/falling/jumping into entity
     * @param {Entity} entity
     */
    blockMovement(entity: Entity) {
        if (this.collisionManager.topCollisionDetected(entity)) {
            this.y = entity.y + this.height;
            this.physics.yAccel = 0;
        }
        else if (this.collisionManager.botCollisionDetected(entity)) {
            this.actions.jumping = false;
            this.y = entity.y - this.height;
            this.physics.canJump = true;
            if (this.physics.yAccel > 0) {
                this.physics.yAccel = 0;
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
                this.checkpointX = entity.x;
                this.checkpointY = entity.y - 100;
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
        if (this.actions.jumping) {
            this.width = 402 * this.animations.scale;
            this.height = 365 * this.animations.scale;
        }
        else if (this.physics.accel !== 0) {
            this.width = 295 * this.animations.scale;
            this.height = 343 * this.animations.scale;
        }
        else {
            this.width = sprites.idle.width * this.animations.scale;
            this.height = sprites.idle.height * this.animations.scale;
        }
        this.collisionManager.updateDimensions(this.x, this.y, this.width, this.height);
    }
    changeHP(amount: number) {
        this.stats.currentHP += amount;
        if (this.stats.currentHP < 0)
            this.stats.currentHP = 0;
        else if (this.stats.currentHP > this.stats.maxHP)
            this.stats.currentHP = this.stats.maxHP;
    }
    changeMP(amount: number) {
        this.stats.currentMP += amount;
        if (this.stats.currentMP < 0)
            this.stats.currentMP = 0;
        else if (this.stats.currentMP > this.stats.maxMP)
            this.stats.currentMP = this.stats.maxMP;
    }
    shootBullet() {
        // Need to figure out way to have offset scale with bullet's width/height
        const startX = this.game.controls.mouse.currentX > this.x + this.width / 2 ? this.x + 180 * this.animations.scale : this.x;
        const startY = this.y + 145 * this.animations.scale;
        let rocket;
        if (this.actions.walking) {
            rocket = new Rocket(this.game, startX, startY, this.game.controls.mouse.currentX, this.game.controls.mouse.currentY, (this.direction === Directions.Right ? 1 : -1) * this.physics.velocity, true);
        }
        else {
            rocket = new Rocket(this.game, startX, startY, this.game.controls.mouse.currentX, this.game.controls.mouse.currentY, 0, true);
        }
        if (this.ticksSinceShot >= rocket.fireRate && this.stats.currentMP >= rocket.manaCost) {
            this.game.addEntity(rocket);
            this.ticksSinceShot = 0;
            this.changeMP(-rocket.manaCost);
        }
    }
    shootFire() {
        // Need to figure out way to have offset scale with fire's width/height
        var startX = this.game.controls.mouse.currentX > this.x + this.width / 2 ? this.x + 160 * this.animations.scale : this.x;
        var startY = this.y + 140 * this.animations.scale;
        let fire;
        if (this.actions.walking) {
            fire = new Fire(this.game, startX, startY, this.game.controls.mouse.currentX, this.game.controls.mouse.currentY, (this.direction === Directions.Right ? 1 : -1) * this.physics.velocity, true);
        }
        else {
            fire = new Fire(this.game, startX, startY, this.game.controls.mouse.currentX, this.game.controls.mouse.currentY, 0, true);
        }
        if (this.ticksSinceShot >= fire.fireRate && this.stats.currentMP >= fire.manaCost) {
            this.game.addEntity(fire);
            this.ticksSinceShot = 0;
            this.changeMP(-fire.manaCost);
        }
    }
    goToLastCheckpoint() {
        this.physics.yAccel = 0;
        this.x = this.checkpointX;
        this.y = this.checkpointY;
        this.stats.currentHP = this.stats.maxHP;
        this.stats.currentMP = this.stats.maxMP;
    }
    isDead() {
        return this.currentHP <= 0 || this.hasFallenOutOfMap();
    }
    hasFallenOutOfMap() {
        return this.y > 2000;
    }
    isAirborne() {
        return this.physics.yAccel !== 0;
    }
    startJump() {
        this.actions.jumping = true;
        this.physics.yAccel = -25;
        this.physics.canJump = false;
    }
}

// Hero.prototype = new Entity();
// Hero.prototype.constructor = Hero;









