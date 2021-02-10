import Phaser from "phaser";

import { debugDraw } from "../utils/debug";
import { createLizardAnims } from "../anims/EnemyAnims";
import { createCharacterAnims } from "../anims/CharacterAnims";

import Lizard from "../enemies/Lizard";

import "../chatacter/Faune";
import Faune from "../chatacter/Faune";

import { eventsCenter } from "../events/EventsCenter";

export default class Game extends Phaser.Scene {
  private cursors!: Phaser.Types.Input.Keyboard.CursorKeys;
  private faune!: Faune;

  constructor() {
    super("game");
  }

  preload() {
    this.cursors = this.input.keyboard.createCursorKeys();
  }

  create() {
    this.scene.run("game-ui");

    createLizardAnims(this.anims);
    createCharacterAnims(this.anims);

    const map = this.make.tilemap({ key: "dungeon" });
    const tileset = map.addTilesetImage("dungeon", "tiles", 16, 16, 1, 2);

    map.createLayer("Ground", tileset);
    const wallslayer = map.createLayer("Walls", tileset);

    wallslayer.setCollisionByProperty({ collides: true });

    debugDraw(wallslayer, this);
    this.faune = this.add.faune(128, 128, "faune");

    this.cameras.main.startFollow(this.faune, true);

    const lizards = this.physics.add.group({
      classType: Lizard,
      createCallback: (go: Phaser.GameObjects.GameObject) => {
        const lizGo = go as Lizard;
        lizGo.body.onCollide = true;
      },
    });

    lizards.get(256, 128, "lizard");

    this.physics.add.collider(this.faune, wallslayer);
    this.physics.add.collider(lizards, wallslayer);

    this.physics.add.collider(
      lizards,
      this.faune,
      this.handlePlayerLizardCollision,
      undefined,
      this
    );
  }

  private handlePlayerLizardCollision(
    obj1: Phaser.GameObjects.GameObject,
    obj2: Phaser.GameObjects.GameObject
  ) {
    const lizard = obj2 as Lizard;

    const dx = this.faune.x - lizard.x;
    const dy = this.faune.y - lizard.y;

    const dir = new Phaser.Math.Vector2(dx, dy).normalize().scale(200);

    this.faune.handlerDamage(dir);

    eventsCenter.emit("player-health-chenged", this.faune.health);
  }

  update(t: number, dt: number) {
    if (this.faune) {
      this.faune.update(this.cursors);
    }
  }
}
