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

  this.input.keyboard.on("keydown-T", Client.sendTest, this);
  createAnims({ anims: this.anims });
}
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

  // if (cursors.space.isDown) {
  //   bomb.x = player.x;
  //   bomb.y = player.y;
  //   bomb.visible = true;
  // }

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

const addNewPlayer = ({ id, x, y }) => {
  console.log("addNewPlayer", id);
  playerMap[id] = gameCreate.physics.add.sprite(x, y, "dude");
};

const removePlayer = ({ id }) => {
  if (playerMap[id]) {
    playerMap[id].destroy();
    delete playerMap[id];
  }
};
