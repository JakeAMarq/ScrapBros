/**
 * Animation class for spriteSheet animations
 */
export class Animation {
    /**
     * Constructor
     * @param {Image} spriteSheet
     * @param {number} startX
     * @param {number} startY
     * @param {number} frameWidth
     * @param {number} frameHeight
     * @param {number} frameDuration
     * @param {number} frames
     * @param {Boolean} loop
     * @param {Boolean} reverse
     */
    constructor(spriteSheet, startX, startY, frameWidth, frameHeight, frameDuration, frames, loop, reverse) {
        this.spriteSheet = spriteSheet;
        this.startX = startX;
        this.startY = startY;
        this.frameWidth = frameWidth;
        this.frameDuration = frameDuration;
        this.frameHeight = frameHeight;
        this.frames = frames;
        this.totalTime = frameDuration * frames;
        this.elapsedTime = 0;
        this.loop = loop;
        this.reverse = reverse;
    }

    /**
     * Draws frame of spritesheet
     * @param {Number} tick
     * @param {CanvasRenderingContext2D} ctx
     * @param {Number} x
     * @param {Number} y
     * @param {Number} [scaleBy]
     */
    drawFrame(tick, ctx, x, y, scaleBy) {
        scaleBy = scaleBy || 1;
        this.elapsedTime += tick;
        if (this.loop) {
            if (this.isDone()) {
                this.elapsedTime = 0;
            }
        }
        else if (this.isDone()) {
            return;
        }
        let index = this.reverse ? this.frames - this.currentFrame() - 1 : this.currentFrame();
        let vindex = 0;
        if ((index + 1) * this.frameWidth + this.startX > this.spriteSheet.width) {
            index -= Math.floor((this.spriteSheet.width - this.startX) / this.frameWidth);
            vindex++;
        }
        while ((index + 1) * this.frameWidth > this.spriteSheet.width) {
            index -= Math.floor(this.spriteSheet.width / this.frameWidth);
            vindex++;
        }
        const offset = vindex === 0 ? this.startX : 0;
        ctx.drawImage(this.spriteSheet, index * this.frameWidth + offset, vindex * this.frameHeight + this.startY, // source from sheet
            this.frameWidth, this.frameHeight, x, y, this.frameWidth * scaleBy, this.frameHeight * scaleBy);
    }

    /**
     * Returns which frame of the spritesheet the animation is currently on
     * @returns {number}
     */
    currentFrame() {
        return Math.floor(this.elapsedTime / this.frameDuration);
    }

    /**
     * Returns true if the animation has finished, false otherwise
     * @returns {boolean}
     */
    isDone() {
        return (this.elapsedTime >= this.totalTime);
    }
}
