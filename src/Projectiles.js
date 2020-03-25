/**
 * @description Super class for projectiles
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
    constructor(game, x, y, scale, fireRate, damage, friendly, physics, img) {
        super(game, x, y);
        this.scale = scale;
        this.fireRate = fireRate;
        this.damage = damage;
        this.friendly = friendly;
        this.physics = physics;
        this.img = img;
        this.type = TYPES.PROJECTILE;
    }
    handleCollision(entity) {
        switch (entity.type) {
            case TYPES.HERO:
                if (!this.friendly)
                    this.removeFromWorld = true;
                break;
            case TYPES.CANNON:
                if (this.friendly)
                    this.removeFromWorld = true;
                break;
            case TYPES.PLATFORM:
            case TYPES.SPIKE:
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
    draw(ctx, xView, yView) {
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
    constructor(game, x, y, destX, destY, initialVelocity, friendly) {
        var scale = 0.5;
        var fireRate = 20;
        var damage = 5;
        var velocity = 15;
        var gravity = 0;
        var accel = 0;
        var timeAlive = 100;
        var physics = new Physics(x, y, timeAlive, destX, destY, gravity, initialVelocity, velocity, accel);
        var img = new Animation(ASSET_MANAGER.getAsset("./resources/img/projectiles/rocket.png"), 0, 0, 51, 60, .20, 1, true, false);
        super(game, x, y, scale, fireRate, damage, friendly, physics, img);
        this.width = 25 * scale;
        this.height = 25 * scale;
        this.manaCost = 5;
        this.explosion = new Animation(ASSET_MANAGER.getAsset("./resources/img/projectiles/explosion.png"), 0, 0, 51, 51, 0.025, 7, false, false);
        this.exploding = false;
        this.explosion_audio = false; // make sure the explosion sound only plays once.
        this.shoot_audio = false;
    }
    handleCollision(entity) {
        switch (entity.type) {
            case TYPES.HERO:
                if (!this.friendly)
                    this.exploding = true;
                break;
            case TYPES.CANNON:
                if (this.friendly)
                    this.exploding = true;
                break;
            case TYPES.PLATFORM:
            case TYPES.SPIKE:
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
            // if(!this.explosion_audio){
            //     this.explosion_audio = true;
            //     (new Audio("./sounds/rocket_explode.mp3")).play();
            // }
            this.exploding = true;
        }
        if (this.exploding && this.explosion.isDone())
            this.removeFromWorld = true;
        Entity.prototype.update.call(this);
    }
    draw(ctx, xView, yView) {
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
            this.explosion.drawFrame(this.game.clockTick, ctx, this.x - xView - imgWidthOffset, this.y - yView - imgHeightOffset, this.scale * 2);
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
    constructor(game, x, y, destX, destY, initialVelocity, friendly) {
        var scale = 2;
        var fireRate = 1;
        var damage = 0.25;
        var velocity = 10;
        var gravity = Math.random() * 0.075 - 0.03;
        var accel = 0;
        var timeAlive = 40;
        var physics = new Physics(x, y, timeAlive, destX, destY, gravity, initialVelocity, velocity, accel);
        var img = new Animation(ASSET_MANAGER.getAsset("./resources/img/projectiles/fire.png"), 0, 0, 25, 12, Math.random() * .03 + 0.1, 10, false, false);
        super(game, x, y, scale, fireRate, damage, friendly, physics, img);
        this.width = 9 * scale;
        this.height = 9 * scale;
        this.manaCost = 0;
    }
    draw(ctx, xView, yView) {
        ctx.save();
        ctx.translate(this.x + this.width / 2 - xView, this.y + this.height / 2 - yView);
        ctx.rotate(this.physics.currentAngle);
        this.img.drawFrame(this.game.clockTick, ctx, 0, -1 * this.img.spriteSheet.height * this.scale / 20, this.scale);
        ctx.restore();
    }
}
