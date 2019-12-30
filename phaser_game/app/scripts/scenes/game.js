import Player from '@/objects/player';

export default class Game extends Phaser.Scene {
  /**
   *  A sample Game scene, displaying the Phaser logo.
   *
   *  @extends Phaser.Scene
   */
  constructor() {
    super({ key: 'Game' });
  }

  /**
   *  Called when a scene is initialized. Method responsible for setting up
   *  the game objects of the scene.
   *
   *  @protected
   *  @param {object} data Initialization parameters.
   */
  create(/* data */) {
    //  TODO: Replace this content with really cool game code here :)
    this.add.image(400, 300, 'sky');
    this.player = this.add.existing(new Player(this, 300, 300));
    this.player2 = this.add.existing(new Player(this, 150, 150));

    this.anims.create({
      key: 'left',
      frames: this.anims.generateFrameNumbers('player', { start: 0, end: 3 }),
      frameRate: 10,
      repeat: -1
    });
    this.anims.create({
      key: 'right',
      frames: this.anims.generateFrameNumbers('player', { start: 5, end: 8 }),
      frameRate: 10,
      repeat: -1
    });
    this.anims.create({
      key: 'turn',
      frames: [{ key: 'player', frame: 4 }],
      frameRate: 20
    });
  }

  /**
   *  Called when a scene is updated. Updates to game logic, physics and game
   *  objects are handled here.
   *
   *  @protected
   *  @param {number} t Current internal clock time.
   *  @param {number} dt Time elapsed since last update.
   */
  update(/* t, dt */) {
    const cursors = this.input.keyboard.createCursorKeys();
    const movementSpeed = 2;
    if (cursors.left.isDown) {
      this.player.x -= movementSpeed;
      this.player.anims.play('left', true);
    } else if (cursors.right.isDown) {
      this.player.x += movementSpeed;
      this.player.anims.play('right', true);
    } else if (cursors.up.isDown) {
      this.player.y -= movementSpeed;
    } else if (cursors.down.isDown) {
      this.player.y += movementSpeed;
    } else {
      this.player.x += 0;
      this.player.anims.play('turn', true);
    }

    // if (cursors.left.isDown) {
    //   this.player2.x -= movementSpeed;
    //   this.player2.anims.play('left', true);
    // } else if (cursors.right.isDown) {
    //   this.player2.x += movementSpeed;
    //   this.player2.anims.play('right', true);
    // } else if (cursors.up.isDown) {
    //   this.player2.y -= movementSpeed;
    // } else if (cursors.down.isDown) {
    //   this.player2.y += movementSpeed;
    // } else {
    //   this.player2.x += 0;
    //   this.player2.anims.play('turn', true);
    // }
  }
}
