/**
 * @description Level class that builds level based off of string and stores level information
 * @param {GameEngine} game
 * @param {String} levelText
 */
class LevelBuilder {
    constructor(game, levelText) {
        this.game = game;
        this.width = 0;
        this.height = 0;
        this.build(levelText);
    }
    /**
     * @description Builds level based off string and sets level's dimensions
     * @param {String} levelText string representing level
     */
    build(levelText) {
        var tileSize = 52;
        var y = 0;
        var x = 0;
        for (var i = 0; i < levelText.length; i++) {
            var char = levelText.charAt(i);
            switch (char) { // add tile entity at x * tilesize and y for y coordinates
                case '.': // standard floor tile
                    var platform = new Platform(this.game, x * tileSize, y, "floor");
                    this.game.addEntity(platform);
                    break;
                case '=': // standard floor tile
                    var platform = new Platform(this.game, x * tileSize, y, "bricks");
                    this.game.addEntity(platform);
                    break;
                case '>': // goes on the right side of floor tile ...>
                    var platform = new Platform(this.game, x * tileSize, y, "gap_right");
                    this.game.addEntity(platform);
                    break;
                case '<': // goes on the left side of floor tile <...
                    var platform = new Platform(this.game, x * tileSize, y, "gap_left");
                    this.game.addEntity(platform);
                    break;
                case '^': // spikes on a steel blockd 
                    var spike = new Spike(this.game, x * tileSize, y, "steel_block_spikes");
                    this.game.addEntity(spike);
                    break;
                case '*': // floating spikes
                    var spike = new Spike(this.game, x * tileSize, y, "floating_spikes");
                    this.game.addEntity(spike);
                    break;
                case '#': // floor spikes replace floor tiles
                    var spike = new Spike(this.game, x * tileSize, y, "floor_spikes");
                    this.game.addEntity(spike);
                    break;
                case '-': // floating steel block
                    var platform = new Platform(this.game, x * tileSize, y, "steel_block");
                    this.game.addEntity(platform);
                    break;
                    d;
                case '?': // transparent block
                    var platform = new Platform(this.game, x * tileSize, y, "invisible");
                    this.game.addEntity(platform);
                    break;
                case 's': // checkpoint
                    var platform = new Platform(this.game, x * tileSize, y, "checkpoint");
                    this.game.addEntity(platform);
                    break;
                    d;
                case '+': // win upon collision
                    var winTile = new Platform(this.game, x * tileSize, y, "win");
                    this.game.addEntity(winTile);
                    break;
                case 'p': //player spawn
                    var hero = new Hero(this.game, x * tileSize, y);
                    this.game.entities.splice(1, 0, hero); //entities[1] = hero
                    break;
                case 'c': //cannon spawn
                    var e1 = new Cannon(this.game, x * tileSize, y);
                    this.game.addEntity(e1);
                    break;
                case 'h': //health pack
                    var healthPack = new HealthPack(this.game, x * tileSize, y);
                    this.game.addEntity(healthPack);
                    break;
                case 'm': //mana pack
                    var manaPack = new ManaPack(this.game, x * tileSize, y);
                    this.game.addEntity(manaPack);
                    break;
                case '\n': //break
                    y += tileSize;
                    if (x > this.width / tileSize)
                        this.width = tileSize * (x + 1);
                    x = -1;
                    break;
            }
            x++;
            this.height = y + tileSize;
        }
    }
}

LevelBuilder.prototype = new Entity();
LevelBuilder.prototype.constructor = LevelBuilder;

