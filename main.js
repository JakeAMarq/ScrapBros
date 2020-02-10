var ASSET_MANAGER = new AssetManager();

ASSET_MANAGER.queueDownload("./img/Instructions.png");

ASSET_MANAGER.queueDownload("./img/hero/Hero.png");
ASSET_MANAGER.queueDownload("./img/hero/HeroSword.png");
ASSET_MANAGER.queueDownload("./img/hero/HeroSwordR.png");
ASSET_MANAGER.queueDownload("./img/environment/Background.png");
ASSET_MANAGER.queueDownload("./img/environment/52Tile.png");
ASSET_MANAGER.queueDownload("./img/environment/52Tilea.png");
ASSET_MANAGER.queueDownload("./img/HudPrototype1.png");
ASSET_MANAGER.queueDownload("./img/projectiles/bullet.png");
ASSET_MANAGER.queueDownload("./img/projectiles/fire.png");
ASSET_MANAGER.queueDownload("./img/enemies/Cannon.png");
ASSET_MANAGER.queueDownload("./img/enemies/CannonR.png");

ASSET_MANAGER.downloadAll(function () {
    var canvas = document.getElementById('gameWorld');
    var ctx = canvas.getContext('2d');

    var gameEngine = new GameEngine();
    var bg = new Background(gameEngine);
    var hero = new Hero(gameEngine);

    var camera = new Camera(0, 0, ctx.canvas.width, ctx.canvas.height, 1680, 1050);
    camera.follow(hero, ctx.canvas.width / 2, ctx.canvas.height / 4);               

    var e1 = new Cannon(gameEngine);

    gameEngine.addEntity(bg);
    gameEngine.addEntity(hero);
    gameEngine.addEntity(e1);
    for (var i = 450; i <= 1400; i += 50) {
        var tile = new Platform(gameEngine, i, 400);
        gameEngine.addEntity(tile);
    }

    gameEngine.init(ctx, camera);
    gameEngine.start();
});
