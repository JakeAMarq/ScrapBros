import { Platform } from '../environment/Platform.js';
import { Spike } from '../environment/Spike.js';
import { Hero } from '../Hero.js';
import { Cannon } from '../Enemies.js';
import { HealthPack, ManaPack } from '../environment/Collectables.js'

/**
 * @description Level class that builds level based off of string and stores level information
 * @param {GameEngine} game
 * @param {String} levelText
 */
export class LevelBuilder {
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
        let entity;
        for (var i = 0; i < levelText.length; i++) {
            var char = levelText.charAt(i);
            switch (char) { // add tile entity at x * tilesize and y for y coordinates
                case '.': // standard floor tile
                    entity = new Platform(this.game, x * tileSize, y, 'floor');
                    this.game.addEntity(entity);
                    break;
                case '=': // standard floor tile
                    entity = new Platform(this.game, x * tileSize, y, 'bricks');
                    this.game.addEntity(entity);
                    break;
                case '>': // goes on the right side of floor tile ...>
                    entity = new Platform(this.game, x * tileSize, y, 'gap_right');
                    this.game.addEntity(entity);
                    break;
                case '<': // goes on the left side of floor tile <...
                    entity = new Platform(this.game, x * tileSize, y, 'gap_left');
                    this.game.addEntity(entity);
                    break;
                case '^': // entitys on a steel blockd 
                    entity = new Spike(this.game, x * tileSize, y, 'steel_block_spikes');
                    this.game.addEntity(entity);
                    break;
                case '*': // floating entitys
                    entity = new Spike(this.game, x * tileSize, y, 'floating_spikes');
                    this.game.addEntity(entity);
                    break;
                case '#': // floor entitys replace floor tiles
                    entity = new Spike(this.game, x * tileSize, y, 'floor_spikes');
                    this.game.addEntity(entity);
                    break;
                case '-': // floating steel block
                    entity = new Platform(this.game, x * tileSize, y, 'steel_block');
                    this.game.addEntity(entity);
                    break;
                case '?': // transparent block
                    entity = new Platform(this.game, x * tileSize, y, 'invisible');
                    this.game.addEntity(entity);
                    break;
                case 's': // checkpoint
                    entity = new Platform(this.game, x * tileSize, y, 'checkpoint');
                    this.game.addEntity(entity);
                    break;
                case '+': // win upon collision
                    entity = new Platform(this.game, x * tileSize, y, 'win');
                    this.game.addEntity(entity);
                    break;
                case 'p': //player spawn
                    entity = new Hero(this.game, x * tileSize, y);
                    this.game.entities.splice(1, 0, entity); //entities[1] = hero
                    break;
                case 'c': //cannon spawn
                    entity = new Cannon(this.game, x * tileSize, y);
                    this.game.addEntity(entity);
                    break;
                case 'h': //health pack
                    entity = new HealthPack(this.game, x * tileSize, y);
                    this.game.addEntity(entity);
                    break;
                case 'm': //mana pack
                    entity = new ManaPack(this.game, x * tileSize, y);
                    this.game.addEntity(entity);
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
