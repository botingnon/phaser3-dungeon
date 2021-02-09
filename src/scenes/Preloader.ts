import Phaser from "phaser";

export default class Preloader extends Phaser.Scene {
  constructor() {
    super("preloader");
  }

  preload() {
    // https://github.com/sporadic-labs/tile-extruder
    this.load.image("tiles", "tiles/dungeon_tiles_extruded.png");
    this.load.tilemapTiledJSON("dungeon", "tiles/dungeon-01.json");

    this.load.atlas("faune", "character/fauna.png", "character/fauna.json");
    this.load.atlas("lizard", "enemies/lizard.png", "enemies/lizard.json");
  }

  create() {
    this.scene.run("game");
  }
}