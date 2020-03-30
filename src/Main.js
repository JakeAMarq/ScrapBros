import { GameEngine } from './engine/GameEngine.js'
import { AssetManager } from './engine/AssetManager.js';
import { Background } from './environment/BackGround.js';
import { Instructions, ResourceBars } from './Hud.js';
import { LevelBuilder } from './engine/LevelBuilder.js';
import { Camera } from './engine/Camera.js';

/**
 * Returns contents of .txt file as filePath as a string
 * @param {string} filePath relative path of .txt file
 * @returns {string}
 */
async function loadString(filePath) {
    let levelString = '';
    await fetch(filePath)
            .then(response => response.text())
			.then(text => levelString = text);
	console.log('Loaded ' + filePath);
    return levelString;
}

const imageFilePaths = [
	'./resources/img/hero/Cyborg_Walk2_L.png',
	'./resources/img/hero/Cyborg_Walk2_R.png',
	'./resources/img/hero/Cyborg_Idle_L.png',
	'./resources/img/hero/Cyborg_Idle_R.png',
	'./resources/img/hero/Cyborg_Jump2_L.png',
	'./resources/img/hero/Cyborg_Jump2_R.png',
	'./resources/img/hero/Cyborg_Shoot2_L.png',
	'./resources/img/hero/Cyborg_Shoot2_R.png',
	'./resources/img/environment/Background.png',
	'./resources/img/environment/background_100x100.png',
	'./resources/img/environment/background_100x100_light.png',
	'./resources/img/environment/bricks.png',
	'./resources/img/environment/floor.png',
	'./resources/img/environment/floor_gap_left.png',
	'./resources/img/environment/floor_gap_right.png',
	'./resources/img/environment/invisible.png',
	'./resources/img/environment/steel_block.png',
	'./resources/img/environment/checkpoint.png',
	'./resources/img/environment/goal.png',
	'./resources/img/environment/spikes/steel_block_spikes.png',
	'./resources/img/environment/spikes/floating_spikes.png',
	'./resources/img/environment/spikes/floor_spikes.png',
	'./resources/img/hud/HP_bars.png',
	'./resources/img/hud/HP_bars_background.png',
	'./resources/img/hud/Instructions.png',
	'./resources/img/hud/Win.png',
	'./resources/img/hud/title_screen.png',
	'./resources/img/projectiles/rocket.png',
	'./resources/img/projectiles/explosion.png',
	'./resources/img/projectiles/fire.png',
	'./resources/img/enemies/cannon/Cannon2_L.png',
	'./resources/img/enemies/cannon/Cannon2_R.png',
	'./resources/img/environment/collectables/healthPack.png',
	'./resources/img/environment/collectables/manaPack.png'
];

const ASSET_MANAGER = new AssetManager();

imageFilePaths.forEach(function (file) {
	ASSET_MANAGER.queueDownload(file);
});

ASSET_MANAGER.downloadAll(async function () {
	const canvas = document.getElementById('gameWorld');
	const ctx = canvas.getContext('2d');

	const gameEngine = new GameEngine(ASSET_MANAGER);
	const background = new Background(gameEngine);
	const healthManaBars = new ResourceBars(gameEngine, 10, 10);
	const instructions = new Instructions(gameEngine, ctx.canvas.width - 370 * .75, 0);

	const levelText = await loadString('./resources/levels/level3.txt');

	gameEngine.addEntity(background);
	gameEngine.hudEntities.push(healthManaBars);
	gameEngine.hudEntities.push(instructions);



	const level = new LevelBuilder(gameEngine, levelText);
	const camera = new Camera(gameEngine.entities[1], 0, 0, ctx.canvas.width, ctx.canvas.height, level.width, level.height);

	gameEngine.init(ctx, camera);
	gameEngine.start();
	
});
