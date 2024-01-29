class Enemy {
  constructor(game) {
    this.game = game;
    this.width = 50;
    this.height = 50;
    this.x;
    this.y;
    this.speedX = 0;
    this.speedY = Math.random() * 2 + 0.2;
    this.lives;
    this.free = true;
  }

  start() {
    this.x = Math.random() * this.game.width;
    this.y = -this.height;
    this.lives = 2;
    this.free = false;
  }

  reset() {
    this.free = true;
  }

  update() {
    if (!this.free) {
      // float in
      if (this.y < 0) this.y += 5;

      // make sure the enemy is always visible
      if (this.x > this.game.width - this.width) {
        this.x = this.game.width - this.width;
      }
      this.x += this.speedX;
      this.y += this.speedY;

      // check collision
      if (
        this.game.checkCollision(this, this.game.mouse) &&
        this.game.mouse.pressed
      ) {
        this.lives--;
      }

      if (this.lives < 1) {
        this.reset();
      }

      if (this.y > this.game.height) {
        this.reset();
      }
    }
  }

  draw() {
    if (!this.free) {
      this.game.ctx.fillStyle = "red";
      this.game.ctx.fillRect(this.x, this.y, this.width, this.height);
      this.game.ctx.fillStyle = "blue";
      this.game.ctx.fillText(
        this.lives,
        this.x + this.width * 0.5,
        this.y + this.height * 0.5
      );
    }
  }
}
