const Game = {};
let gameCreate;
const config = {
  type: Phaser.AUTO,
  width: 800,
  height: 600,
  physics: {
    default: "arcade"
  },
  scene: {
    preload: preload,
    create: create,
    update: update
  }
};
const game = new Phaser.Game(config);
let playerMap = [];
let bombs = [];
let me = undefined;

function preload() {
  console.log("preload");
  this.load.image("sky", "assets/sky.png");
  this.load.image("bomb", "assets/bomb.png");
  this.load.bitmapFont(
    "carrier_command",
    "assets/carrier_command.png",
    "assets/carrier_command.xml"
  );
  this.load.spritesheet("dude", "assets/dude.png", {
    frameWidth: 32,
    frameHeight: 48
  });
  this.load.image("bomb_explosion_3", "assets/tank_explosion3.png");
  this.load.image("bomb_explosion_2", "assets/tank_explosion2.png");
  this.load.image("bomb_explosion_4", "assets/tank_explosion4.png");
  this.load.image("green_circle", "assets/green_circle.png");
}

function create() {
  gameCreate = this;
  console.log("onCreate");
  try {
    Client.sendTest();
  } catch (e) {
    this.add.bitmapText(60, 100, "carrier_command", "Connection error!", 34);
    return;
  }
  this.add.image(400, 300, "sky");
  bomb = this.add.image(100, 100, "bomb");
  bomb.setScale(0.25);
  bomb.visible = false;

  Client.askNewPlayer();
  Client.whoAmI();
  this.input.keyboard.on("keydown-T", Client.sendTest, this);
  createAnims({ anims: this.anims });
}
const whoAmI = ({ x, y, id }) => {
  me = id;
  const greenCircle = gameCreate.physics.add.sprite(x, y, "green_circle");
  setTimeout(() => {
    greenCircle.visible = false;
  }, 500);
};
const createAnims = ({ anims }) => {
  anims.create({
    key: "left",
    frames: anims.generateFrameNumbers("dude", { start: 0, end: 3 }),
    frameRate: 10,
    repeat: 0
  });
  anims.create({
    key: "right",
    frames: anims.generateFrameNumbers("dude", { start: 5, end: 8 }),
    frameRate: 10,
    repeat: 0
  });
  anims.create({
    key: "turn",
    frames: [{ key: "dude", frame: 4 }],
    frameRate: 20
  });
};

function update() {
  const cursors = this.input.keyboard.createCursorKeys();

  if (cursors.space.isDown) {
    Client.putBomb();
  }

  handleClick(cursors);
}
function handleClick({ left, right, up, down }) {
  if (left.isDown || right.isDown || up.isDown || down.isDown)
    Client.sendClick({
      x: right.isDown - left.isDown,
      y: down.isDown - up.isDown
    });
}

const movePlayer = ({ id, x, y }) => {
  const player = playerMap[id];
  const xDiff = player.x - x;
  if (!!xDiff) player.anims.play(xDiff > 0 ? "left" : "right", true);
  else player.anims.play("turn", true);

  player.x = x;
  player.y = y;
};

const addNewBomb = ({ id, x, y }) => {
  bombs[id] = gameCreate.physics.add.sprite(x, y, "bomb");
  bombs[id].setScale(0.3);
};
const addNewPlayer = ({ id, x, y }) => {
  playerMap[id] = gameCreate.physics.add.sprite(x, y, "dude");
};

const bombExplosion = async (bomb, players) => {
  const explodedBomb = bombs[bomb.id];
  explodedBomb.visible = false;

  const explosions = [
    { x: -50, y: 0, sprite: "bomb_explosion_2" },
    { x: 50, y: 0, sprite: "bomb_explosion_2" },
    { x: 75, y: 0, sprite: "bomb_explosion_2" },
    { x: -75, y: 0, sprite: "bomb_explosion_2" },
    { x: -100, y: 0, sprite: "bomb_explosion_2" },
    { x: 100, y: 0, sprite: "bomb_explosion_2" },
    { x: 125, y: 0, sprite: "bomb_explosion_2" },
    { x: -125, y: 0, sprite: "bomb_explosion_2" },
    { x: 0, y: 50, sprite: "bomb_explosion_2" },
    { x: 0, y: -50, sprite: "bomb_explosion_2" },
    { x: 0, y: 75, sprite: "bomb_explosion_2" },
    { x: 0, y: -75, sprite: "bomb_explosion_2" },
    { x: 0, y: 100, sprite: "bomb_explosion_2" },
    { x: 0, y: -100, sprite: "bomb_explosion_2" },
    { x: 0, y: 125, sprite: "bomb_explosion_2" },
    { x: 0, y: -125, sprite: "bomb_explosion_2" },
    { x: 0, y: 25, sprite: "bomb_explosion_3" },
    { x: 0, y: -25, sprite: "bomb_explosion_3" },
    { x: 25, y: 0, sprite: "bomb_explosion_3" },
    { x: -25, y: 0, sprite: "bomb_explosion_3" },
    { x: 0, y: 0, sprite: "bomb_explosion_4" }
  ].map(({ x, y, sprite }) =>
    gameCreate.physics.add.sprite(
      explodedBomb.x + x,
      explodedBomb.y + y,
      sprite
    )
  );

  setTimeout(() => {
    explosions.forEach(e => {
      e.visible = false;
    });
  }, 500);

  players.forEach(({ id, x, y, hp }) => {
    playerMap[id].x = x;
    playerMap[id].y = y;
    playerMap[id].hp = hp;
  });
  if (playerMap[me].hp <= 0) gameOver();
};

const gameOver = () => {
  gameCreate.add.bitmapText(60, 100, "carrier_command", "GAME OVER!", 34);
  Client.socket.disconnect();
};
const removePlayer = ({ id }) => {
  if (playerMap[id]) {
    playerMap[id].destroy();
    delete playerMap[id];
  }
};
