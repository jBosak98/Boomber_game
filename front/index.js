console.log("game started");

const config = {
  type: Phaser.AUTO,
  width: 1000,
  height: 800,
  physics: {
    default: "arcade",
    arcade: {
      gravity: { y: 300 },
      debug: false
    }
  }
  //   scene: {
  //     preload: preload,
  //     create: create,
  //     update: update
  //   }
};
const Game = {};
const game = new Phaser.Game(config);

Game.preload = function() {
  console.log("preload");
  this.load.image("sky", "assets/sky.png");
  this.load.spritesheet("dude", "assets/dude.png", {
    frameWidth: 32,
    frameHeight: 48
  });
};
let player;
Game.create = function() {
  console.log("create");
  game.add.image(200, 0, "sky");
  game.add.image(200, 200, "sky");
  game.add.image(0, 0, "sky");
  game.add.image(0, 200, "sky");
  console.log(this.physics);
  player = this.physics.add.sprite(100, 450, "dude");
  anims.create({
    key: "left",
    frames: anims.generateFrameNumbers("player", { start: 0, end: 3 }),
    frameRate: 10,
    repeat: -1
  });
  anims.create({
    key: "right",
    frames: anims.generateFrameNumbers("player", { start: 5, end: 8 }),
    frameRate: 10,
    repeat: -1
  });
  anims.create({
    key: "turn",
    frames: [{ key: "player", frame: 4 }],
    frameRate: 20
  });
};
Game.update = function() {
  console.log("update");
};
console.log(game);
game.state.add("Game", Game);
// game.state.start("Game");
