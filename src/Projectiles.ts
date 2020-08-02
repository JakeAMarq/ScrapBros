import { Entity } from './engine/Entity.js';
import { Types } from './Enums.js';
import { collisionDetected } from './engine/CollisionManager.js';
import { Physics } from './engine/Physics.js';
import { Animation } from './engine/Animation.js';
import { GameEngine } from './engine/GameEngine.js';

/**
 * Super class for projectiles
 * @param {GameEngine} game     the game engine
 * @param {number} x            starting X value
 * @param {number} y            starting Y value
 * @param {number} scale        scale projectile should be drawn in
 * @param {number} fireRate     fire rate measured in number of update calls per shot
 * @param {number} damage       amount of damage each shot does
 * @param {boolean} friendly    true if hero fired it, false if enemy fired it
 * @param {Physics} physics     Physics object with projectile's physics properties
 * @param {Animation} img       Animation object for when projectile is in flight
 */
class Projectile extends Entity {

    scale: number;
    fireRate: number;
    damage: number;
    friendly: boolean;
    physics: Physics;
    img: Animation;
    type: Types;
    exploding: boolean;

    constructor(game: GameEngine, x: number, y: number, scale: number, fireRate: number, damage: number, friendly: boolean, physics: Physics, img: Animation) {
        super(game, x, y);
        this.scale = scale;
        this.fireRate = fireRate;
        this.damage = damage;
        this.friendly = friendly;
        this.physics = physics;
        this.img = img;
        this.type = Types.Projectile;
    }
    handleCollision(entity: Entity) {
        switch (entity.type) {
            case Types.Hero:
                if (!this.friendly)
                    this.removeFromWorld = true;
                break;
            case Types.Cannon:
                if (this.friendly)
                    this.removeFromWorld = true;
                break;
            case Types.Platform:
            case Types.Spike:
                this.removeFromWorld = true;
                break;
        }
    }
    update() {
        for (var i = 0; i < this.game.entities.length; i++) {
            var ent = this.game.entities[i];
            if (ent !== this && collisionDetected(this, ent)) {
                this.handleCollision(ent);
            }
        }
        if (!this.physics.isDone()) {
            this.physics.tick();
            var pos = this.physics.getPosition();
            this.x = pos.x;
            this.y = pos.y;
        }
        else {
            this.removeFromWorld = true;
        }
        Entity.prototype.update.call(this);
    }
    // Reference: https://www.w3schools.com/graphics/game_rotation.asp 
    draw(ctx: CanvasRenderingContext2D, xView: number, yView: number) {
        ctx.save();
        ctx.translate(this.x + this.width / 2 - xView, this.y + this.height / 2 - yView);
        ctx.rotate(this.physics.currentAngle);
        this.img.drawFrame(this.game.clockTick, ctx, 0, -this.img.spriteSheet.height * this.scale / 2, this.scale);
        ctx.restore();
        Entity.prototype.draw.call(this);
    }
}

/**
 * @description Bullet class - extends Projectile
 * @param {GameEngine} game     the game engine
 * @param {number} x            starting X coordinate
 * @param {number} y            starting Y coordinate
 */
class Rocket extends Projectile {

    manaCost: number;
    explosionAnimation: Animation;
    exploding: boolean;

    constructor(game: GameEngine, x: number, y: number, destX: number, destY: number, initialVelocity: number, friendly: boolean) {
        var scale = 0.5;
        var fireRate = 20;
        var damage = 5;
        var velocity = 15;
        var gravity = 0;
        var accel = 0;
        var timeAlive = 100;
        var physics = new Physics(x, y, timeAlive, destX, destY, gravity, initialVelocity, velocity, accel);
        var img = new Animation(game.assetManager.getAsset('./resources/img/projectiles/rocket.png'), 0, 0, 51, 60, .20, 1, true, false);
        super(game, x, y, scale, fireRate, damage, friendly, physics, img);
        this.width = 25 * scale;
        this.height = 25 * scale;
        this.manaCost = 5;
        this.explosionAnimation = new Animation(this.game.assetManager.getAsset('./resources/img/projectiles/explosion.png'), 0, 0, 51, 51, 0.025, 7, false, false);
        this.exploding = false;
    }
    handleCollision(entity: Entity) {
        switch (entity.type) {
            case Types.Hero:
                if (!this.friendly)
                    this.exploding = true;
                break;
            case Types.Cannon:
                if (this.friendly)
                    this.exploding = true;
                break;
            case Types.Platform:
            case Types.Spike:
                this.exploding = true;
                break;
        }
    }
    update() {
        // if(!this.shoot_audio){
        //     this.shoot_audio = true;
        //     (new Audio("./sounds/rocket_shoot.wav")).play();
        // }
        if (!this.physics.isDone() && !this.exploding) {
            for (var i = 0; i < this.game.entities.length; i++) {
                var ent = this.game.entities[i];
                if (ent !== this && collisionDetected(this, ent)) {
                    this.handleCollision(ent);
                }
            }
            if (!this.exploding) {
                this.physics.tick();
                var pos = this.physics.getPosition();
                this.x = pos.x;
                this.y = pos.y;
            }
        }
        else {
            this.exploding = true;
        }
        if (this.exploding && this.explosionAnimation.isDone())
            this.removeFromWorld = true;
        Entity.prototype.update.call(this);
    }
    draw(ctx: CanvasRenderingContext2D, xView: number, yView: number) {
        if (!this.exploding) {
            ctx.save();
            ctx.translate(this.x + this.width / 2 - xView, this.y + this.height / 2 - yView);
            ctx.rotate(this.physics.currentAngle);
            this.img.drawFrame(this.game.clockTick, ctx, 0, -this.img.spriteSheet.height * this.scale / 2, this.scale);
            ctx.restore();
        }
        else {
            var imgWidthOffset = (this.width / 0.6); // adjust the position of the explosion so the image is centered
            var imgHeightOffset = (this.height / 0.6);
            this.explosionAnimation.drawFrame(this.game.clockTick, ctx, this.x - xView - imgWidthOffset, this.y - yView - imgHeightOffset, this.scale * 2);
        }
    }
}

/**
 * @description Fire class - extends Projectile
 * @param {GameEngine} game     the game engine
 * @param {number} x            starting X coordinate
 * @param {number} y            starting Y coordinate
 */
class Fire extends Projectile {
    manaCost: number;

    constructor(game: GameEngine, x: number, y: number, destX: number, destY: number, initialVelocity: number, friendly: boolean) {
        var scale = 2;
        var fireRate = 1;
        var damage = 0.25;
        var velocity = 10;
        var gravity = Math.random() * 0.075 - 0.03;
        var accel = 0;
        var timeAlive = 40;
        var physics = new Physics(x, y, timeAlive, destX, destY, gravity, initialVelocity, velocity, accel);
        var img = new Animation(game.assetManager.getAsset('./resources/img/projectiles/fire.png'), 0, 0, 25, 12, Math.random() * .03 + 0.1, 10, false, false);
        super(game, x, y, scale, fireRate, damage, friendly, physics, img);
        this.width = 9 * scale;
        this.height = 9 * scale;
        this.manaCost = 0;
    }
    draw(ctx: CanvasRenderingContext2D, xView: number, yView: number) {
        ctx.save();
        ctx.translate(this.x + this.width / 2 - xView, this.y + this.height / 2 - yView);
        ctx.rotate(this.physics.currentAngle);
        this.img.drawFrame(this.game.clockTick, ctx, 0, -1 * this.img.spriteSheet.height * this.scale / 20, this.scale);
        ctx.restore();
    }
}

export { Projectile, Rocket, Fire };
