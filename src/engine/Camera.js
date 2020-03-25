// Reference: http://jsfiddle.net/gfcarv/QKgHs/ 
/**
 * @description Rectangle class used mostly to represent camera viewport and map dimensions
 * @param {number} x     starting X coordinate
 * @param {number} y      starting Y coordinate
 * @param {number} width    width
 * @param {number} height   height
 */
class Rectangle {
  constructor(x, y, width, height) {
    this.x = x || 0;
    this.y = y || 0;
    this.width = width || 0;
    this.height = height || 0;
    this.right = this.x + this.width;
    this.bottom = this.y + this.height;
  }
  /**
   * @description Sets rectangle to specified coordinates and dimensions
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



/**
 * @description Camera class
 * @param {Entity} followed         entity that camera will follow
 * @param {number} xView            x coordinate of top left of camera's view
 * @param {number} yView            y coordinate of top left of camera's view
 * @param {number} viewportWidth    width of camera's view
 * @param {number} viewportHeight   height of camera's view
 * @param {number} worldWidth       width of entire map
 * @param {number} worldHeight      height of entire map
 */
class Camera {
  constructor(followed, xView, yView, viewportWidth, viewportHeight, worldWidth, worldHeight) {
    this.xView = xView || 0;
    this.yView = yView || 0;
    this.xDeadZone = viewportWidth / 2;
    this.yDeadZone = viewportHeight / 2;
    this.wView = viewportWidth;
    this.hView = viewportHeight;
    this.followed = followed;
    // rectangle that represents the viewport
    this.viewportRect = new Rectangle(this.xView, this.yView, this.wView, this.hView);
    // rectangle that represents the world's boundary (room's boundary)
    this.worldRect = new Rectangle(0, 0, worldWidth, worldHeight);
  }
  // gameObject needs to have "x" and "y" properties (as world(or room) position)
  // noinspection JSUnusedGlobalSymbols
  /**
   * @param {Entity} entity       entity camera is to follow
   * @param {number} xDeadZone    minimum distance from entity to viewport's edge on x axis
   * @param {number} yDeadZone    minimum distance from entity to viewport's edge on y axis
   */
  follow(entity, xDeadZone, yDeadZone) {
    this.followed = entity;
    this.xDeadZone = xDeadZone;
    this.yDeadZone = yDeadZone;
  }
  update() {
    // keep following the player (or other desired object)
    if (this.followed != null) {
      // moves camera on horizontal axis based on followed object position
      if (this.followed.x - this.xView + this.xDeadZone > this.wView)
        this.xView = this.followed.x - (this.wView - this.xDeadZone);
      else if (this.followed.x - this.xDeadZone < this.xView)
        this.xView = this.followed.x - this.xDeadZone;
      // moves camera on vertical axis based on followed object position
      if (this.followed.y - this.yView + this.yDeadZone > this.hView)
        this.yView = this.followed.y - (this.hView - this.yDeadZone);
      else if (this.followed.y - this.yDeadZone < this.yView)
        this.yView = this.followed.y - this.yDeadZone;
    }
    // update viewportRect
    this.viewportRect.set(this.xView, this.yView);
    // don't let camera leaves the world's boundary
    if (!this.viewportRect.within(this.worldRect)) {
      if (this.viewportRect.x < this.worldRect.x)
        this.xView = this.worldRect.x;
      if (this.viewportRect.y < this.worldRect.y)
        this.yView = this.worldRect.y;
      if (this.viewportRect.right > this.worldRect.right) {
        this.xView = this.worldRect.right - this.wView;
      }
      if (this.viewportRect.bottom > this.worldRect.bottom)
        this.yView = this.worldRect.bottom - this.hView;
    }
  }
}


