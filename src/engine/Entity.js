/**
 * Entity - super class to most objects in the game
 */
export class Entity {
    /**
     * Create an Entity object
     * @param {GameEngine} game
     * @param {Number} x
     * @param {Number} y
     */
    constructor(game, x, y) {
        this.game = game;
        this.x = x;
        this.y = y;
        this.width = null;
        this.height = null;
        this.type = null;
        this.removeFromWorld = false;
    }

    /**
     * Update Entity's properties
     */
    update() {
    }

    /**
     * Draw Entity on canvas
     */
    draw() {
    }

    /**
     * Draw Entity's hitbox(es) on canvas
     * @param {CanvasRenderingContext2D} ctx
     * @param {Number} xView
     * @param {Number} yView
     */
    drawHitBox(ctx, xView, yView) {
        if (this.width && this.height) {
            this.game.ctx.save();
            this.game.ctx.strokeStyle = 'white';
            this.game.ctx.strokeRect(this.x - xView, this.y - yView, this.width, this.height);
            this.game.ctx.restore();
        }
        if (this.collisionManager) {
            this.game.ctx.save();
            this.game.ctx.fillStyle = 'red';
            this.game.ctx.fillRect(this.collisionManager.topBounds.x - xView, this.collisionManager.topBounds.y - yView, this.collisionManager.topBounds.width, this.collisionManager.topBounds.height);
            this.game.ctx.fillStyle = 'blue';
            this.game.ctx.fillRect(this.collisionManager.botBounds.x - xView, this.collisionManager.botBounds.y - yView, this.collisionManager.botBounds.width, this.collisionManager.botBounds.height);
            this.game.ctx.fillStyle = 'green';
            this.game.ctx.fillRect(this.collisionManager.leftBounds.x - xView, this.collisionManager.leftBounds.y - yView, this.collisionManager.leftBounds.width, this.collisionManager.leftBounds.height);
            this.game.ctx.fillStyle = 'yellow';
            this.game.ctx.fillRect(this.collisionManager.rightBounds.x - xView, this.collisionManager.rightBounds.y - yView, this.collisionManager.rightBounds.width, this.collisionManager.rightBounds.height);
            this.game.ctx.restore();
        }
    }
}
