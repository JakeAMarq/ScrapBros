import { Rectangle } from './Rectangle.js';
import { Entity } from './Entity.js';

/**
 * Returns true if entity1 overlaps with entity2, false otherwise
 * @param {Entity | Rectangle} entity1
 * @param {Entity | Rectangle} entity2
 * @returns {boolean} true if entity1 overlaps with entity2, false otherwise
 */
function collisionDetected(entity1: Entity | Rectangle, entity2: Entity | Rectangle) {
    return entity1.x + entity1.width >= entity2.x
        && entity1.x <= entity2.x + entity2.width
        && entity1.y + entity1.height >= entity2.y
        && entity1.y < entity2.y + entity2.height;
}

const TOP_BOUNDS_X_OFFSET_PERCENTAGE = 0.25;
const TOP_BOUNDS_WIDTH_PERCENTAGE = 0.5;
const TOP_BOUNDS_HEIGHT_PERCENTAGE = 0.5;

const BOT_BOUNDS_X_OFFSET_PERCENTAGE = 0.25;
const BOT_BOUNDS_Y_OFFSET_PERCENTAGE = 0.5;
const BOT_BOUNDS_WIDTH_PERCENTAGE = 0.5;
const BOT_BOUNDS_HEIGHT_PERCENTAGE = 0.5

const LEFT_BOUNDS_Y_OFFSET_PERCENTAGE = 0.1;
const LEFT_BOUNDS_WIDTH_PERCENTAGE = 0.15;
const LEFT_BOUNDS_HEIGHT_PERCENTAGE = 0.8;

const RIGHT_BOUNDS_X_OFFSET_PERCENTAGE = 0.75;
const RIGHT_BOUNDS_Y_OFFSET_PERCENTAGE = 0.1;
const RIGHT_BOUNDS_WIDTH_PERCENTAGE = 0.15;
const RIGHT_BOUNDS_HEIGHT_PERCENTAGE = 0.8;

/**
 * Collision manager for entities that need more complicated collision handling (ie. need to handle collisions differently
 * based on whether collision is on left, right, top, or bottom
 */
class CollisionManager {
    x: number;
    y: number;
    width: number;
    height: number;

    topBounds: Rectangle;
    botBounds: Rectangle;
    leftBounds: Rectangle;
    rightBounds: Rectangle;

    constructor(x: number, y: number, width: number, height: number) {
        this.topBounds = new Rectangle(
            x + TOP_BOUNDS_X_OFFSET_PERCENTAGE * width, 
            y, 
            TOP_BOUNDS_WIDTH_PERCENTAGE * width, 
            TOP_BOUNDS_HEIGHT_PERCENTAGE * height
        );
        this.botBounds = new Rectangle(
            x + BOT_BOUNDS_X_OFFSET_PERCENTAGE * width, 
            y + BOT_BOUNDS_Y_OFFSET_PERCENTAGE * height, 
            BOT_BOUNDS_WIDTH_PERCENTAGE * width,
            BOT_BOUNDS_HEIGHT_PERCENTAGE * height
        );
        this.leftBounds = new Rectangle(
            x, 
            y + LEFT_BOUNDS_Y_OFFSET_PERCENTAGE * height, 
            LEFT_BOUNDS_WIDTH_PERCENTAGE * width, 
            LEFT_BOUNDS_HEIGHT_PERCENTAGE * height
        );
        this.rightBounds = new Rectangle(
            x + RIGHT_BOUNDS_X_OFFSET_PERCENTAGE * width, 
            y + RIGHT_BOUNDS_Y_OFFSET_PERCENTAGE * height, 
            RIGHT_BOUNDS_WIDTH_PERCENTAGE * width, 
            RIGHT_BOUNDS_HEIGHT_PERCENTAGE * height
        );
    }

    /**
     * Update the dimensions based off of new x, y, width, and height
     * @param x
     * @param y
     * @param width
     * @param height
     */
    updateDimensions(x: number, y: number, width: number, height: number) {
        this.topBounds.set(
            x + TOP_BOUNDS_X_OFFSET_PERCENTAGE * width, 
            y, 
            TOP_BOUNDS_WIDTH_PERCENTAGE * width, 
            TOP_BOUNDS_HEIGHT_PERCENTAGE * height
        );
        this.botBounds.set(
            x + BOT_BOUNDS_X_OFFSET_PERCENTAGE * width, 
            y + BOT_BOUNDS_Y_OFFSET_PERCENTAGE * height, 
            BOT_BOUNDS_WIDTH_PERCENTAGE * width,
            BOT_BOUNDS_HEIGHT_PERCENTAGE * height
        );
        this.leftBounds.set(
            x, 
            y + LEFT_BOUNDS_Y_OFFSET_PERCENTAGE * height, 
            LEFT_BOUNDS_WIDTH_PERCENTAGE * width, 
            LEFT_BOUNDS_HEIGHT_PERCENTAGE * height
        );
        this.rightBounds.set(
            x + RIGHT_BOUNDS_X_OFFSET_PERCENTAGE * width, 
            y + RIGHT_BOUNDS_Y_OFFSET_PERCENTAGE * height, 
            RIGHT_BOUNDS_WIDTH_PERCENTAGE * width, 
            RIGHT_BOUNDS_HEIGHT_PERCENTAGE * height
        );
    }

    /**
     * Returns true if topBounds and entity overlap, false otherwise
     * @param {Entity | Rectangle} entity
     * @returns {boolean} true if topBounds and entity overlap, false otherwise
     */
    topCollisionDetected(entity: Entity | Rectangle) {
        return collisionDetected(this.topBounds, entity);
    }

    /**
     * Returns true if botBounds and entity overlap, false otherwise
     * @param {Entity | Rectangle} entity
     * @returns {boolean} true if botBounds and entity overlap, false otherwise
     */
    botCollisionDetected(entity: Entity | Rectangle) {
        return collisionDetected(this.botBounds, entity);
    }

    /**
     * Returns true if leftBounds and entity overlap, false otherwise
     * @param {Entity | Rectangle} entity
     * @returns {boolean} true if leftBounds and entity overlap, false otherwise
     */
    leftCollisionDetected(entity: Entity | Rectangle) {
        return collisionDetected(this.leftBounds, entity);
    }

    /**
     * Returns true if rightBounds and entity overlap, false otherwise
     * @param {Entity | Rectangle} entity
     * @returns {boolean} true if rightBounds and entity overlap, false otherwise
     */
    rightCollisionDetected(entity: Entity | Rectangle) {
        return collisionDetected(this.rightBounds, entity);
    }
}

export { collisionDetected, CollisionManager };
