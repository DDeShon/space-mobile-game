class Enemy {
  constructor(game) {
    this.game = game;
    this.width = 50;
    this.height = 50;
    this.x = Math.random() * this.game.width;
    this.y = -this.height;
    this.speedX = 0;
    this.speedY = Math.random() * 2 + 0.2;
    this.free = true;
  }

  start() {
    this.x = Math.random() * this.game.width;
    this.y = -this.height;
    this.free = false;
  }

  reset() {
    this.free = true;
  }

  update() {
    if (!this.free) {
      // float in
      if (this.y < 0) this.y += 5;
      this.x += this.speedX;
      this.y += this.speedY;

      if (this.y > this.game.height) {
        this.reset();
      }
    }
  }

  draw() {
    if (!this.free) {
      this.game.ctx.fillStyle = "red";
      this.game.ctx.fillRect(this.x, this.y, this.width, this.height);
    }
  }
}
