// This game shell was happily copied from Googler Seth Ladd's "Bad Aliens" game and his Google IO talk in 2011


// Requests an animation frame
window.requestAnimFrame = (function () {
    return window.requestAnimationFrame ||
            window.webkitRequestAnimationFrame ||
            window.mozRequestAnimationFrame ||
            window.oRequestAnimationFrame ||
            window.msRequestAnimationFrame ||
            function (/* function */ callback, /* DOMElement */ element) {
                window.setTimeout(callback, 1000 / 60);
            };
})();


// A timer for the game
class Timer {
    constructor(props) {
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

// Game engine
class GameEngine {
    constructor() {
        this.camera = null;
        this.paused = false;
        this.entities = [];
        this.hudEntities = [];
        this.showOutlines = false;
        this.ctx = null;
        this.click = null;
        this.mouse = null;
        this.leftMouseDown = null;
        this.rightMouseDown = null;
        this.mouseX = null;
        this.mouseY = null;
        this.lastMouseX = null; // used to update mouseX and mouseY even if the mouse doesn't move
        this.lastMouseY = null; // ^
        this.lastXView = null; // ^
        this.lastYView = null; // ^
        this.wheel = null;
        this.surfaceWidth = null;
        this.surfaceHeight = null;
        this.keysActive = null;
    }
    // The initialized function
    init(ctx, camera) {
        this.ctx = ctx;
        this.camera = camera;
        this.surfaceWidth = this.ctx.canvas.width;
        this.surfaceHeight = this.ctx.canvas.height;
        this.leftMouseDown = false;
        this.rightMouseDown = false;
        this.keysActive = new Array(255).fill(false); // Keeps track of active keys on canvas
        this.startInput();
        this.timer = new Timer();
        console.log('game initialized');
    }
    // Starting the game
    start() {
        console.log("starting game");
        var that = this;
        (function gameLoop() {
            that.loop();
            requestAnimFrame(gameLoop, that.ctx.canvas);
        })();
    }
    startInput() {
        console.log('Starting input');
        var that = this;
        this.ctx.canvas.addEventListener("keydown", function (e) {
            e.preventDefault();
            //console.log(e);
            // Array of all of the keys on the keyboard
            // Set key that is pressed to true
            that.keysActive[e.which] = true;
            if (e.code === "Escape") {
                if (that.paused)
                    that.resume();
                else
                    that.pause();
            }
        }, false);
        // When a key is released
        this.ctx.canvas.addEventListener("keyup", function (e) {
            that.keysActive[e.which] = false;
        }, false);
        /*
        Set all keys to false when the canvas loses focus so that you character doesn't
        keep moving without the key pressed
        */
        this.ctx.canvas.addEventListener("focusout", function (e) {
            that.keysActive.fill(false);
            //that.attack = false;
        });
        // Right click event
        this.ctx.canvas.addEventListener("contextmenu", (e) => {
            // Action
            //that.attack = true;
        });
        // Left click event
        this.ctx.canvas.addEventListener("mousedown", (e) => {
            // Action
            //that.keysActive.fill(true);
            if (e.which === 1) {
                that.leftMouseDown = true;
            }
            else if (e.which === 3) {
                that.rightMouseDown = true;
            }
        });
        this.ctx.canvas.addEventListener("mouseup", (e) => {
            // Action
            //that.keysActive.fill(true);
            if (e.which === 1) {
                that.leftMouseDown = false;
            }
            else if (e.which === 3) {
                that.rightMouseDown = false;
            }
        });
        this.ctx.canvas.addEventListener("mousemove", function (e) {
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
            // visualize hitboxes
            // var ent = this.entities[i];
            // if (ent.width && ent.height) {
            //     this.ctx.save();
            //     this.ctx.strokeStyle = "white";
            //     this.ctx.strokeRect(ent.x - this.camera.xView, ent.y - this.camera.yView, ent.width, ent.height);
            //     this.ctx.restore();
            // }
            // if (ent.collisionManager) {
            //     this.ctx.save();
            //     this.ctx.fillStyle = "red";
            //     this.ctx.fillRect(ent.collisionManager.topBounds.x - this.camera.xView, ent.collisionManager.topBounds.y - this.camera.yView, ent.collisionManager.topBounds.width, ent.collisionManager.topBounds.height);
            //     this.ctx.fillStyle = "blue";
            //     this.ctx.fillRect(ent.collisionManager.botBounds.x - this.camera.xView, ent.collisionManager.botBounds.y - this.camera.yView, ent.collisionManager.botBounds.width, ent.collisionManager.botBounds.height);
            //     this.ctx.fillStyle = "green";
            //     this.ctx.fillRect(ent.collisionManager.leftBounds.x - this.camera.xView, ent.collisionManager.leftBounds.y - this.camera.yView, ent.collisionManager.leftBounds.width, ent.collisionManager.leftBounds.height);
            //     this.ctx.fillStyle = "yellow";
            //     this.ctx.fillRect(ent.collisionManager.rightBounds.x - this.camera.xView, ent.collisionManager.rightBounds.y - this.camera.yView, ent.collisionManager.rightBounds.width, ent.collisionManager.rightBounds.height);
            //     this.ctx.restore();
            // }
        }
        for (let i = 0; i < this.hudEntities.length; i++) {
            this.hudEntities[i].draw(this.ctx, this.camera.xView, this.camera.yView);
        }
        this.ctx.restore();
    }
    update() {
        let i;
        let entity;
        const entitiesCount = this.entities.length;
        for (i = 0; i < entitiesCount; i++) {
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
        this.mouseX = this.lastMouseX + this.camera.xView - this.lastXView;
        this.mouseY = this.lastMouseY + this.camera.yView - this.lastYView;
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
        this.ctx.fillStyle = "rgba(0, 0, 0, 0.4)";
        this.ctx.fillRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
    }
    resume() {
        this.paused = false;
    }
}
