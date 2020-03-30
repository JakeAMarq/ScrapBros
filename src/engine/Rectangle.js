/**
 * Rectangle class used mostly to represent camera viewport and map dimensions
 */
export class Rectangle {
    /**
     * Create a rectangle
     * @param {number} x starting X coordinate
     * @param {number} y starting Y coordinate
     * @param {number} width width
     * @param {number} height height
     */
    constructor(x, y, width, height) {
        this.x = x || 0;
        this.y = y || 0;
        this.width = width || 0;
        this.height = height || 0;
        this.right = this.x + this.width;
        this.bottom = this.y + this.height;
    }
    /**
     * Sets rectangle to specified coordinates and dimensions
     * @param {number}  x
     * @param {number}  y
     * @param {number}  [width]
     * @param {number}  [height]
     */
    set(x, y, width, height) {
        this.x = x;
        this.y = y;
        this.width = width || this.width;
        this.height = height || this.height;
        this.right = (this.x + this.width);
        this.bottom = (this.y + this.height);
    }
    /**
     * @param {Rectangle} rectangle  Rectangle that's being checked if this rectangle is inside of
     *
     * @returns {Boolean} if this rectangle is fully within rectangle, false otherwise
     */
    within(rectangle) {
        return (rectangle.x <= this.x &&
            rectangle.right >= this.right &&
            rectangle.y <= this.y &&
            rectangle.bottom >= this.bottom);
    }
}
