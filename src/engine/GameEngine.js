// This game shell was happily copied from Googler Seth Ladd's "Bad Aliens" game and his Google IO talk in 2011

const SIXTIETH_OF_SECOND = 16.66667;
const LEFT_MOUSE_BUTTON_MOUSE_EVENT_CODE = 0;
const RIGHT_MOUSE_BUTTON_MOUSE_EVENT_CODE = 2;

// Requests an animation frame
window.requestAnimFrame = (function () {
    return window.requestAnimationFrame ||
            window.webkitRequestAnimationFrame ||
            window.mozRequestAnimationFrame ||
            window.oRequestAnimationFrame ||
            window.msRequestAnimationFrame ||
            function (callback) {
                window.setTimeout(callback, SIXTIETH_OF_SECOND);
            };
})();

class Timer {
    constructor() {
        this.gameTime = 0;
        this.maxStep = 0.05;
        this.wallLastTimestamp = 0;
    }

    tick() {
        var wallCurrent = Date.now();
        var wallDelta = (wallCurrent - this.wallLastTimestamp) / 1000;
        this.wallLastTimestamp = wallCurrent;
        var gameDelta = Math.min(wallDelta, this.maxStep);
        this.gameTime += gameDelta;
        return gameDelta;
    }
}

/**
 * GameEngine class
 */
export class GameEngine {
    constructor(assetManager) {
        this.camera = null;
        this.assetManager = assetManager;
        this.paused = false;
        this.entities = [];
        this.hudEntities = [];
        this.ctx = null;

        this.input = {
            mouse: {
                leftDown: false,
                rightDown: false,
                x: null,
                y: null
            },
            keysActive : [] // Keeps track of active keys on canvas
        };

        this.lastMouseX = null; // used to update mouseX and mouseY even if the mouse doesn't move
        this.lastMouseY = null; // ^
        this.lastXView = null;  // ^
        this.lastYView = null;  // ^

    }
    // The initialized function
    init(ctx, camera) {
        this.ctx = ctx;
        this.camera = camera;
        this.startInput();
        this.timer = new Timer();
        console.log('game initialized');
    }
    // Starting the game
    start() {
        console.log('starting game');
        const that = this;
        (function gameLoop() {
            that.loop();
            window.requestAnimFrame(gameLoop, that.ctx.canvas);
        })();
    }
    startInput() {
        console.log('Starting input');
        const that = this;
        this.ctx.canvas.addEventListener('keydown', function (e) {
            e.preventDefault();
            // Set key that is pressed to true
            that.input.keysActive[e.code] = true;
            if (e.code === 'Escape') {
                if (that.paused)
                    that.resume();
                else
                    that.pause();
            }
        }, false);
        // When a key is released
        this.ctx.canvas.addEventListener('keyup', function (e) {
            that.input.keysActive[e.code] = false;
        }, false);
        /*
        Set all keys to false when the canvas loses focus so that you character doesn't
        keep moving without the key pressed
        */
        this.ctx.canvas.addEventListener('focusout', function () {
            that.input.keysActive.fill(false);
            that.input.mouse.leftDown = false;
            that.input.mouse.rightDown = false;
        });
        this.ctx.canvas.addEventListener('mousedown', (e) => {
            console.log(e);
            if (e.button === LEFT_MOUSE_BUTTON_MOUSE_EVENT_CODE) {
                that.input.mouse.leftDown = true;
            }
            else if (e.button === RIGHT_MOUSE_BUTTON_MOUSE_EVENT_CODE) {
                that.input.mouse.rightDown = true;
            }
        });
        this.ctx.canvas.addEventListener('mouseup', (e) => {
            console.log(e);
            if (e.button === LEFT_MOUSE_BUTTON_MOUSE_EVENT_CODE) {
                that.input.mouse.leftDown = false;
            }
            else if (e.button === RIGHT_MOUSE_BUTTON_MOUSE_EVENT_CODE) {
                that.input.mouse.rightDown = false;
            }
        });
        this.ctx.canvas.addEventListener('mousemove', function (e) {
            that.lastMouseX = e.clientX + that.camera.xView;
            that.lastMouseY = e.clientY + that.camera.yView;
            that.lastXView = that.camera.xView;
            that.lastYView = that.camera.yView;
        });
        console.log('Input started');
    }
    addEntity(entity) {
        // console.log('added entity');
        this.entities.push(entity);
    }
    draw() {
        this.ctx.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
        this.ctx.save();
        for (let i = 0; i < this.entities.length; i++) {
            this.entities[i].draw(this.ctx, this.camera.xView, this.camera.yView);
            // this.entities[i].drawHitBox(this.ctx, this.camera.xView, this.camera.yView);
        }

        // HUD must always be drawn over other entities
        for (let i = 0; i < this.hudEntities.length; i++) {
            this.hudEntities[i].draw(this.ctx, this.camera.xView, this.camera.yView);
        }
        this.ctx.restore();
    }
    updateMousePosition() {
        this.input.mouse.x = this.lastMouseX + this.camera.xView - this.lastXView;
        this.input.mouse.y = this.lastMouseY + this.camera.yView - this.lastYView;
    }
    update() {
        let i;
        let entity;
        for (i = 0; i < this.entities.length; i++) {
            entity = this.entities[i];
            if (!entity.removeFromWorld) {
                entity.update();
            }
        }

        for (i = 0; i < this.hudEntities.length; i++) {
            entity = this.hudEntities[i];
            if (!entity.removeFromWorld) {
                entity.update();
            }
        }
        this.camera.update();
        this.updateMousePosition();
        for (i = this.entities.length - 1; i >= 0; --i) {
            if (this.entities[i].removeFromWorld) {
                // console.log("removed entity"); 
                this.entities.splice(i, 1);
            }
        }
    }
    loop() {
        if (!this.paused) {
            this.clockTick = this.timer.tick();
            this.update();
            this.draw();
        }
    }
    pause() {
        this.paused = true;
        this.ctx.fillStyle = 'rgba(0, 0, 0, 0.4)';
        this.ctx.fillRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
    }
    resume() {
        this.paused = false;
    }
}
