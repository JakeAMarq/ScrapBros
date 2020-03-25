/**
 * Returns true if entity1 overlaps with entity2, false otherwise
 * @param {Entity | Rectangle} entity1
 * @param {Entity | Rectangle} entity2
 * @returns {boolean} true if entity1 overlaps with entity2, false otherwise
 */
function collisionDetected(entity1, entity2) {
    return entity1.x + entity1.width >= entity2.x
        && entity1.x <= entity2.x + entity2.width
        && entity1.y + entity1.height >= entity2.y
        && entity1.y < entity2.y + entity2.height;
}

/**
 * Collision manager for entities that need more complicated collision handling (ie. need to handle collisions differently
 * based on whether collision is on left, right, top, or bottom
 */
class CollisionManager {
    constructor(x, y, width, height) {
        this.botBounds = new Rectangle(x + 0.25 * width, y + 0.5 * height, 0.5 * width, 0.5 * height);
        this.topBounds = new Rectangle(x + 0.25 * width, y, 0.5 * width, 0.5 * height);
        this.rightBounds = new Rectangle(x + 0.75 * width, y + 0.1 * height, 0.15 * width, 0.8 * height);
        this.leftBounds = new Rectangle(x, y + 0.1 * height, 0.15 * width, 0.8 * height);
    }

    /**
     * Update the dimensions based off of new x, y, width, and height
     * @param x
     * @param y
     * @param width
     * @param height
     */
    updateDimensions(x, y, width, height) {
        this.botBounds.set(x + 0.25 * width, y + height / 2, 0.5 * width, 0.5 * height);
        this.topBounds.set(x + 0.25 * width, y, 0.5 * width, 0.5 * height);
        this.rightBounds.set(x + 0.75 * width, y + 0.1 * height, 0.25 * width, 0.8 * height);
        this.leftBounds.set(x, y + 0.1 * height, 0.25 * width, 0.8 * height);
    }

    /**
     * Returns true if topBounds and entity overlap, false otherwise
     * @param {Entity | Rectangle} entity
     * @returns {boolean} true if topBounds and entity overlap, false otherwise
     */
    topCollisionDetected(entity) {
        return collisionDetected(this.topBounds, entity);
    }

    /**
     * Returns true if botBounds and entity overlap, false otherwise
     * @param {Entity | Rectangle} entity
     * @returns {boolean} true if botBounds and entity overlap, false otherwise
     */
    botCollisionDetected(entity) {
        return collisionDetected(this.botBounds, entity);
    }

    /**
     * Returns true if leftBounds and entity overlap, false otherwise
     * @param {Entity | Rectangle} entity
     * @returns {boolean} true if leftBounds and entity overlap, false otherwise
     */
    leftCollisionDetected(entity) {
        return collisionDetected(this.leftBounds, entity);
    }

    /**
     * Returns true if rightBounds and entity overlap, false otherwise
     * @param {Entity | Rectangle} entity
     * @returns {boolean} true if rightBounds and entity overlap, false otherwise
     */
    rightCollisionDetected(entity) {
        return collisionDetected(this.rightBounds, entity);
    }
}






