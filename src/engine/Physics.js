/**
 *
 * @param {number} startX       Object X position
 * @param {number} startY       Object Y position
 * @param {number} duration     Number of ticks before the object disappears
 * @param {number} cursorX      Cursor X position
 * @param {number} cursorY      Cursor Y position
 * @param {number} gravity      Gravitational force
 * @param {number} velocity     Initial velocity
 * @param {number} acceleration Acceleration over time
 *
 * @description Attach physics properties to an object
 */
export class Physics {
    constructor(startX, startY, duration, cursorX, cursorY, gravity, initalVelocity, velocity, acceleration) {
        this.cursorX = cursorX;
        this.cursorY = cursorY;
        this.gravity = gravity;
        this.acceleration = acceleration;
        this.bounces = false;
        this.sticks = false;
        this.startX = startX;
        this.startY = startY;
        this.x = startX;
        this.y = startY;
        this.time = 0;
        this.endTime = Math.ceil(duration);
        this.gravity = gravity;
        this.velocity = velocity;
        this.acceleration = acceleration;
        this.dead = false;
        this.initialAngle = this.getAngle();
        this.currentAngle = this.initialAngle;
        this.initialVelocity = Math.ceil(velocity + initalVelocity * Math.cos(this.initialAngle));
        this.currentVelocity = this.initialVelocity;
    }
    /**
     * @description Advance the time value by +1
     */
    tick() {
        this.time += 1;
        // Update values with time
        this.update();
        // Kill off the object if it has a time alive duration
        if (this.time === this.endTime) {
            this.dead = true;
        }
    }
    /**
     * @description Updates the X and Y position
     */
    update() {
        var lastX = this.x;
        var lastY = this.y;
        //x - x0 = v0 * t + 1/2 a t^2
        //x = x0 + v0 * t + 1/2 a t^2
        //Reduce Calculations if gravity is 0
        if (this.gravity === 0) {
            this.y = this.startY + Math.sin(this.initialAngle) * this.initialVelocity * this.time;
            // Else calculate full equation if gravity is included
        }
        else {
            this.y = this.startY + Math.sin(this.initialAngle) * this.initialVelocity * this.time + .5 * this.gravity * (this.time * this.time);
        }
        //Reduce Calculations if acceleration is 0
        if (this.acceleration === 0) {
            this.x = this.startX + Math.cos(this.initialAngle) * this.initialVelocity * this.time;
            // Else calculate full equation if acceleration is included
        }
        else {
            this.x = this.startX + Math.cos(this.initialAngle) * this.initialVelocity * this.time + .5 * this.acceleration * (this.time * this.time);
        }
        //v = v0 + a t
        //We only need to include if we need to get the current velocity for some reason
        //if (acceleration != 0) {
        //    this.currentVelocity = this.initialVelocity + this.acceleration * this.time;
        //}
        if (this.gravity || this.acceleration)
            this.currentAngle = this.calculateAngle(lastX, lastY, this.x, this.y);
        this.y = Math.ceil(this.y);
        this.x = Math.ceil(this.x);
    }
    /**
     * @param {Number} startX - starting point on x axis
     * @param {Number} startY - starting point on y axis
     * @param {Number} endX - ending point on x axis
     * @param {Number} endY - ending point on y axis
     */
    calculateAngle(startX, startY, endX, endY) {
        var deltaX = endX - startX;
        var deltaY = endY - startY;
        return Math.atan2(deltaY, deltaX);
    }
    /**
     * @param {Number} gravity - Graviational Constant in pixels per frame
     */
    setGravity(gravity) {
        //Update gravity
        this.gravity = gravity;
    }
    /**
     * @param {Number} velocity - Velocity Constant in pixels per frame
     */
    setVelocity(velocity) {
        //Update initialVelocity so equations will calculate the proper currentVelocity
        this.initialVelocity = velocity;
    }
    /**
     * @param {Number} velocity - Velocity Constant in pixels per frame
     */
    setAcceleration(acceleration) {
        //update acceleration so equations will calculate the proper currentVelocity
        this.acceleration = acceleration;
    }
    /**
     * @param {String} type - Angle type "deg" (degrees)
     *
     * @description Returns the current angle. By default it returns the value in radians,
     * insert the a parameter "deg" to get the angle in degrees
     */
    getAngle(type = 'rad') {
        var angle = this.calculateAngle(this.startX, this.startY, this.cursorX, this.cursorY);
        return type === 'deg' ? angle * Math.PI / 180.0 : angle;
    }
    /**
     * @returns {Object} Object with x , y coordinates
     */
    getPosition() {
        return { 'x': this.x, 'y': this.y };
    }
    /**
     * @return {boolean} true if the object has achieved it's goal (timeout, collision, etc.)
     */
    isDone() {
        return this.dead;
    }
    /**
     * @description Stops all physics
     */
    stop() {
        this.dead = true;
    }
}











