class Enemy {
  constructor(game) {
    this.game = game;
    this.x = 150;
    this.y = 200;
    this.speedX;
    this.speedY;
    this.width = 50;
    this.height = 50;
  }
  draw() {
    this.game.ctx.fillStyle = "red";
    this.game.ctx.fillRect(this.x, this.y, this.width, this.height);
  }
}
